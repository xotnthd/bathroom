package com.community.bathroom.comn.security.aspect;

import com.community.bathroom.comn.security.annotation.TenantGuard;
import com.community.bathroom.comn.security.mapper.SecurityMapper;
import com.community.bathroom.comn.security.model.AdminPrincipal;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 서버사이드 테넌트(sys_id) 격리 + 메뉴별 CRUD 권한 매트릭스(TN_ATH_M001) 강제.
 * {@link TenantGuard}가 붙은 컨트롤러 메서드를 감싸서:
 *   1) 요청에 실린 sysId가 로그인한 관리자의 실제 소속과 일치하는지 확인 (교차 테넌트 가능자는 예외)
 *   2) 그 sysId에서 해당 메뉴(menuId로 조회)에 대해 요구된 CRUD 권한을 갖고 있는지 확인
 * 어느 쪽이든 실패하면 즉시 403을 반환하고 실제 컨트롤러 로직은 실행되지 않는다.
 */
@Aspect
@Component
public class TenantGuardAspect {

    @Autowired
    private SecurityMapper securityMapper;

    @Around("@annotation(tenantGuard)")
    public Object enforce(ProceedingJoinPoint joinPoint, TenantGuard tenantGuard) throws Throwable {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof AdminPrincipal principal)) {
            return forbidden("인증 정보가 없습니다.");
        }

        if (tenantGuard.action() == TenantGuard.Action.SUPER_ADMIN_ONLY) {
            if (!principal.isCrossTenantCapable()) {
                return forbidden("접근 권한이 없습니다.");
            }
            return joinPoint.proceed();
        }

        Object[] args = joinPoint.getArgs();
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
        Parameter[] params = method.getParameters();

        String claimedSysId = null;
        Map<String, Object> mapArg = null;
        List<Map<String, Object>> listOfMapsArg = null;
        List<Integer> stringSysIdArgIndexes = new ArrayList<>();

        for (int i = 0; i < params.length; i++) {
            Object val = args[i];
            if (val instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> m = (Map<String, Object>) val;
                mapArg = m;
                Object v = m.get("sysId");
                if (v != null && !String.valueOf(v).isEmpty()) {
                    claimedSysId = String.valueOf(v);
                }
            } else if (val instanceof List<?> list && !list.isEmpty() && list.get(0) instanceof Map) {
                // 예: 매트릭스 일괄 저장처럼 행(Map) 목록을 통째로 받는 엔드포인트 - 각 행의 sysId를 확인/주입한다.
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> l = (List<Map<String, Object>>) list;
                listOfMapsArg = l;
                for (Map<String, Object> row : l) {
                    Object v = row.get("sysId");
                    if (v != null && !String.valueOf(v).isEmpty()) {
                        claimedSysId = String.valueOf(v);
                    }
                }
            } else if (params[i].getType() == String.class && "sysId".equalsIgnoreCase(resolveParamName(params[i]))) {
                // 값이 null이어도(= @RequestParam(required=false)로 클라이언트가 아예 안 보낸 경우) 이 위치가
                // sysId 슬롯이라는 사실 자체는 파라미터 타입으로 판단해야 한다 (null instanceof String은 항상 false라 놓치기 쉬움).
                stringSysIdArgIndexes.add(i);
                if (val != null && !((String) val).isEmpty()) {
                    claimedSysId = (String) val;
                }
            }
        }

        String effectiveSysId;
        if (principal.isCrossTenantCapable()) {
            // 교차 테넌트 가능자(S001, CORE의 A001)는 클라이언트가 지정한 sysId를 그대로 신뢰한다 (시스템 전환 기능).
            effectiveSysId = (claimedSysId != null) ? claimedSysId : principal.getSysId();
        } else {
            // 그 외 전원: 본인 소속과 다른 sysId를 요청하면 즉시 거부 (침묵 교정 금지, fail-closed).
            if (claimedSysId != null && !claimedSysId.equals(principal.getSysId())) {
                return forbidden("다른 시스템의 데이터에 접근할 수 없습니다.");
            }
            effectiveSysId = principal.getSysId();
        }

        // 실제로 컨트롤러가 받게 될 인자에 확정된 sysId를 명시적으로 채워 넣는다.
        // (클라이언트가 아예 sysId를 안 보낸 경우의 기존 하드코딩 기본값("CORE")과 충돌하지 않도록 하기 위함)
        if (mapArg != null) {
            mapArg.put("sysId", effectiveSysId);
        }
        if (listOfMapsArg != null) {
            for (Map<String, Object> row : listOfMapsArg) {
                row.put("sysId", effectiveSysId);
            }
        }
        for (int idx : stringSysIdArgIndexes) {
            args[idx] = effectiveSysId;
        }

        // 서비스 기한 만료 시 조회(READ)를 제외한 모든 기능 차단 (SUPER_ADMIN_ONLY 화면은 위에서 이미 통과되어 여기 안 걸림 -
        // 요금제 갱신/서비스 기간 연장은 그쪽 경로로만 가능해야 하므로 의도된 동작).
        if (tenantGuard.action() != TenantGuard.Action.READ) {
            java.time.LocalDate serviceEndde = securityMapper.selectServiceEnddeBySysId(effectiveSysId);
            if (serviceEndde != null && serviceEndde.isBefore(java.time.LocalDate.now())) {
                return forbidden("서비스 이용 기간이 만료되어 조회 외 기능은 사용할 수 없습니다. 관리자에게 문의하세요.");
            }
        }

        if (tenantGuard.menuId() != null && !tenantGuard.menuId().isEmpty()) {
            Map<String, Object> menuInfo = securityMapper.selectMenuBySysIdAndId(effectiveSysId, tenantGuard.menuId());
            if (menuInfo == null) {
                return forbidden("사용할 수 없는 기능입니다.");
            }
            String menuId = (String) menuInfo.get("menuId");
            boolean sensitive = "Y".equals(menuInfo.get("sensitiveYn"));

            // SUPR(진짜 최고관리자)은 민감 메뉴 포함 무조건 통과. S001은 민감하지 않은 메뉴에서만 매트릭스 체크를 건너뛴다
            // - 민감 메뉴는 S001이라도 아래의 실제 TN_ATH_M001 매트릭스 확인을 그대로 통과해야 한다.
            if (principal.isTrueSuperAdmin() || (principal.isSuperAdmin() && !sensitive)) {
                return joinPoint.proceed(args);
            }

            Map<String, Object> perm = securityMapper.selectMenuPermission(effectiveSysId, principal.getRole(), menuId);
            if (perm == null) {
                return forbidden("접근 권한이 없습니다.");
            }
            boolean ok = switch (tenantGuard.action()) {
                case READ -> "Y".equals(perm.get("inqireYn"));
                case WRITE -> "Y".equals(perm.get("rgstYn")) || "Y".equals(perm.get("mdfcnYn"));
                case DELETE -> "Y".equals(perm.get("delYn"));
                default -> false;
            };
            if (!ok) {
                return forbidden("접근 권한이 없습니다.");
            }
        } else if (principal.isSuperAdmin() || principal.isTrueSuperAdmin()) {
            // menuId가 없는(=sysId만 검증하는) 일반 케이스는 기존과 동일하게 S001/SUPR 전면 통과
            return joinPoint.proceed(args);
        }

        return joinPoint.proceed(args);
    }

    private String resolveParamName(Parameter param) {
        PathVariable pv = param.getAnnotation(PathVariable.class);
        if (pv != null) {
            if (!pv.value().isEmpty()) return pv.value();
            if (!pv.name().isEmpty()) return pv.name();
            return param.getName();
        }
        RequestParam rp = param.getAnnotation(RequestParam.class);
        if (rp != null) {
            if (!rp.value().isEmpty()) return rp.value();
            if (!rp.name().isEmpty()) return rp.name();
            return param.getName();
        }
        return null;
    }

    private ResponseEntity<Map<String, Object>> forbidden(String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Forbidden");
        body.put("message", message);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }
}
