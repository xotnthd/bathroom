package com.community.bathroom.comn.security.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse; // [추가]
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext; // [추가]
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository; // [추가]
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth") // [공통 API 경로]
public class CommonAuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    // [수정 1] 파라미터에 HttpServletResponse response 추가
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletRequest request, HttpServletResponse response) {
        String loginId = loginData.get("loginId");
        String loginPw = loginData.get("loginPw");

        System.out.println("=========================================");
        System.out.println("1. [프론트엔드 전달값 확인] ID: " + loginId + ", PW: " + loginPw);

        try {
            // 인증 시도
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginId, loginPw);
            Authentication authentication = authenticationManager.authenticate(token);
            System.out.println("2. [DB 검증 통과] 권한: " + authentication.getAuthorities());

            // 세션 저장 로직
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            HttpSessionSecurityContextRepository contextRepository = new HttpSessionSecurityContextRepository();
            contextRepository.saveContext(context, request, response);

            System.out.println("3. [세션 저장 완료] 세션ID: " + request.getSession().getId());
            System.out.println("   -> 세션에 저장된 권한정보(SecurityContext): " + context.getAuthentication().getAuthorities());
            System.out.println("   -> 세션에 저장된 사용자ID: " + context.getAuthentication().getName());
            System.out.println("=========================================");

            String role = authentication.getAuthorities().iterator().next().getAuthority();
            Map<String, Object> resBody = new HashMap<>();
            resBody.put("message", "로그인 성공");
            resBody.put("role", role);

            Object principal = authentication.getPrincipal();
            if (principal instanceof com.community.bathroom.comn.security.model.AdminPrincipal admin) {
                resBody.put("sysId", admin.getSysId());
                resBody.put("athrtyLevel", admin.getAthrtyLevel());
            } else if (principal instanceof com.community.bathroom.comn.security.model.UserPrincipal user) {
                resBody.put("sysId", user.getSysId());
                resBody.put("userGradeCd", user.getUserGradeCd());
                resBody.put("userGradeSortOrd", user.getUserGradeSortOrd());
            }

            return ResponseEntity.ok(resBody);

        } catch (org.springframework.security.authentication.AccountExpiredException e) {
            System.err.println("❌ [에러] 퇴사 처리된 계정입니다: " + loginId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("퇴사 처리된 계정입니다. 로그인할 수 없습니다.");
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            System.err.println("❌ [에러] 비밀번호가 일치하지 않습니다. (DB 비밀번호 암호화 여부 확인 필요)");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호 불일치");
        } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
            System.err.println("❌ [에러] DB에서 해당 아이디(" + loginId + ")를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 없음");
        } catch (Exception e) {
            System.err.println("❌ [기타 치명적 에러 발생] 아래 로그를 확인하세요!");
            e.printStackTrace(); // 진짜 에러 원인 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러: " + e.getMessage());
        }
    }

    @GetMapping("/expired")
    public ResponseEntity<?> sessionExpired() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("다른 기기에서 로그인하여 세션이 만료되었거나, 타임아웃 되었습니다.");
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인되어 있지 않습니다.");
        }

        // [수정] Principal 객체에서 명확하게 ID 추출
        org.springframework.security.core.userdetails.UserDetails userDetails =
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();

        String loginId = userDetails.getUsername(); // 우리가 UserDetails에 넣은 ID
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "authenticated");
        response.put("loginId", loginId); // 확실하게 프론트엔드로 전달
        response.put("role", role);

        // sysId 등 부가 정보는 인증 시점에 이미 principal에 실려있으므로 재조회 없이 그대로 사용
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.community.bathroom.comn.security.model.AdminPrincipal admin) {
            response.put("sysId", admin.getSysId());
            response.put("athrtyLevel", admin.getAthrtyLevel());
        } else if (principal instanceof com.community.bathroom.comn.security.model.UserPrincipal user) {
            response.put("sysId", user.getSysId());
            response.put("userGradeCd", user.getUserGradeCd());
            response.put("userGradeSortOrd", user.getUserGradeSortOrd());
        }

        return ResponseEntity.ok(response);
    }
}