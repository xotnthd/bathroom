package com.community.bathroom.admin.user.controller;

import com.community.bathroom.admin.user.service.AdminUserService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import com.community.bathroom.comn.security.model.AdminPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/user")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private com.community.bathroom.comn.security.mapper.SecurityMapper securityMapper;

    private boolean isCallerTrueSuperAdmin() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getPrincipal() instanceof AdminPrincipal principal && principal.isTrueSuperAdmin();
    }

    // [구조 개편] 권한코드 및 검색 조건(아이디, 이름, 상태코드)을 받아 동적으로 회원을 검색하는 API
    @AuditLog(actionName = "유저 조회")
    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_USER_01")
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchUserList(@RequestParam Map<String, Object> searchParam) {
        // 기본 시스템 식별자 강제 주입
        if (!searchParam.containsKey("sysId")) {
            searchParam.put("sysId", "CORE");
        }
        searchParam.put("callerIsTrueSuper", isCallerTrueSuperAdmin());

        // 현재 로그인한 사용자 정보 조회하여 권한 레벨 가져오기
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            Map<String, Object> userData = securityMapper.selectAdminById(auth.getName());
            if (userData != null && userData.get("athrtyLevel") != null) {
                searchParam.put("currentAthrtyLevel", userData.get("athrtyLevel"));
            } else {
                searchParam.put("currentAthrtyLevel", 99); // 기본값: 가장 낮은 권한
            }
        }

        return ResponseEntity.ok(adminUserService.getSearchUserList(searchParam));
    }

    // 회원 단건 상세 조회
    @AuditLog(actionName = "유저 상세 조회")
    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_USER_01")
    @GetMapping("/detail/{sysId}/{userId}")
    public ResponseEntity<Map<String, Object>> getUserDetail(@PathVariable String sysId, @PathVariable String userId) {
        return ResponseEntity.ok(adminUserService.getUserDetail(sysId, userId, isCallerTrueSuperAdmin()));
    }

    // 회원 정보 저장 및 수정 (마스터/상세 동시 Upsert)
    @AuditLog(actionName = "회원 정보 저장 및 수정")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_USER_01")
    @PostMapping("/save")
    public ResponseEntity<?> saveUser(
            @RequestParam Map<String, Object> param,
            @RequestParam(value = "files", required = false) org.springframework.web.multipart.MultipartFile[] files) {
        boolean callerIsTrueSuper = isCallerTrueSuperAdmin();
        if ("SUPR".equals(param.get("athrtyCd")) && !callerIsTrueSuper) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("사용할 수 없는 권한코드입니다.");
        }

        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = (auth != null && auth.isAuthenticated()) ? auth.getName() : "admin";
        param.put("registerId", currentUserId);

        int currentAthrtyLevel = 99;
        if (auth != null && auth.isAuthenticated()) {
            Map<String, Object> userData = securityMapper.selectAdminById(currentUserId);
            if (userData != null && userData.get("athrtyLevel") != null) {
                currentAthrtyLevel = ((Number) userData.get("athrtyLevel")).intValue();
            }
        }
        param.put("currentAthrtyLevel", currentAthrtyLevel);

        adminUserService.saveUserWithFiles(param, files);
        return ResponseEntity.ok().build();
    }

    // 회원 계정 삭제
    @AuditLog(actionName = "회원 계정 삭제")
    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_USER_01")
    @DeleteMapping("/delete/{sysId}/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String sysId, @PathVariable String userId) {
        if ("spadmin".equals(userId) && !isCallerTrueSuperAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("삭제할 수 없는 계정입니다.");
        }

        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        int currentAthrtyLevel = 99;
        if (auth != null && auth.isAuthenticated()) {
            Map<String, Object> userData = securityMapper.selectAdminById(auth.getName());
            if (userData != null && userData.get("athrtyLevel") != null) {
                currentAthrtyLevel = ((Number) userData.get("athrtyLevel")).intValue();
            }
        }

        adminUserService.deleteUser(sysId, userId, currentAthrtyLevel);
        return ResponseEntity.ok().build();
    }
}