package com.community.bathroom.admin.auth.controller;

import com.community.bathroom.admin.auth.service.AdminLoginService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/api/auth")
public class AdminLoginController {

    @Autowired
    private AdminLoginService adminLoginService;

    // 관리자 로그인 API
    @AuditLog(actionName = "관리자 로그인 API")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginParam) {
        String userId = loginParam.get("userId");
        String pswd = loginParam.get("pswd"); // 실무에선 이 값을 시큐리티가 가로채거나 여기서 BCrypt 매칭

        // 비즈니스 검증 레이어(Service)를 호출하여 완결된 유저 객체를 확보합니다.
        Map<String, Object> loginUser = adminLoginService.loginProcess(userId, pswd);

        if (loginUser != null) {
            // 정상 인증 확인됨 - 클라이언트(React)로 유저 정보 전달
            return ResponseEntity.ok(loginUser);
        } else {
            // ID 오류 혹은 비밀번호 불일치 시 동일하게 401 보안 무인증 에러 처리
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }
}
