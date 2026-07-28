package com.community.bathroom.comn.log.aspect;

import com.community.bathroom.comn.log.annotation.AuditLog;
import com.community.bathroom.comn.log.mapper.AuditLogMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
public class AuditLogAspect {

    @Autowired
    private AuditLogMapper auditLogMapper;

    // --- [수정 전] ---
    // @Autowired
    // private ObjectMapper objectMapper;

    // --- [수정 후] ---
    private final ObjectMapper objectMapper = new ObjectMapper();

    // @AuditLog 어노테이션이 붙은 메서드를 가로챔
    @Around("@annotation(com.community.bathroom.comn.log.annotation.AuditLog)")
    public Object logAudit(ProceedingJoinPoint joinPoint) throws Throwable {

        // 1. 본래 비즈니스 로직(컨트롤러 메서드) 먼저 실행
        Object result = joinPoint.proceed();

        try {
            // 2. 실행 성공 시 로깅 데이터 수집 시작
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();

            // 어노테이션에서 기능명 추출
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            AuditLog auditLog = signature.getMethod().getAnnotation(AuditLog.class);
            String fnctnNm = auditLog.actionName();

            // 보안 컨텍스트에서 접속자 ID 추출
            String userId = "anonymous";
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
                userId = ((UserDetails) auth.getPrincipal()).getUsername();
            }

            // 클라이언트 IP 추출 (프록시 환경 고려)
            String oprtnIp = request.getHeader("X-Forwarded-For");
            if (oprtnIp == null) oprtnIp = request.getRemoteAddr();

            // 메서드로 넘어온 파라미터를 JSON으로 직렬화 (로그 스냅샷)
            Object[] args = joinPoint.getArgs();
            String logCn = objectMapper.writeValueAsString(args.length > 0 ? args[0] : "{}");

            // 3. Mapper로 넘길 파라미터 맵 구성
            Map<String, Object> logParam = new HashMap<>();
            logParam.put("sysId", "CORE"); // 시스템 ID 하드코딩 또는 파라미터에서 추출
            logParam.put("userId", userId);
            logParam.put("fnctnNm", fnctnNm);
            logParam.put("reqUrl", request.getRequestURI());
            logParam.put("oprtnIp", oprtnIp);
            logParam.put("logCn", logCn);

            // 4. DB Insert 실행
            auditLogMapper.insertAuditLog(logParam);

        } catch (Exception e) {
            // 로깅 중 에러가 발생해도 본래 비즈니스 로직 응답에는 영향을 주지 않도록 예외 처리
            System.err.println("❌ [AuditLog] 감사 로그 저장 중 오류 발생: " + e.getMessage());
        }

        return result;
    }
}