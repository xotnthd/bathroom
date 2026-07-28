package com.community.bathroom.admin.auth.controller;

import com.community.bathroom.admin.auth.service.AdminAuthService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import com.community.bathroom.comn.security.model.AdminPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/auth")
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    private AdminPrincipal getPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AdminPrincipal principal) {
            return principal;
        }
        return null;
    }

    // 권한 그룹 목록 조회 (삭제되지 않은 데이터만)
    // 회원관리/권한관리/권한템플릿관리 등 여러 화면이 공유하는 참조 데이터 조회이므로 특정 메뉴에 종속시키지 않는다
    // (테넌트 격리는 TenantGuard 자체가 계속 강제함).
    @AuditLog(actionName = "권한 그룹 목록 조회") // 👈 이것만 딱 붙이면 끝!
    @TenantGuard(action = TenantGuard.Action.READ)
    @GetMapping("/role/list")
    public ResponseEntity<List<Map<String, Object>>> getRoleList(
            @RequestParam(required = false) String sysId,
            @RequestParam(defaultValue = "MG") String sysSeCd) {
        AdminPrincipal principal = getPrincipal();
        boolean callerIsTrueSuper = principal != null && principal.isTrueSuperAdmin();
        int currentUserLevel = principal != null ? principal.getAthrtyLevel() : 99;
        return ResponseEntity.ok(adminAuthService.getRoleList(sysId, sysSeCd, callerIsTrueSuper, currentUserLevel));
    }

    // 권한 그룹 저장/수정 (팝업 모달용)
    @AuditLog(actionName = "권한 그룹 저장/수정") // 👈 이것만 딱 붙이면 끝!
    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/auth")
    @PostMapping("/role/save")
    public ResponseEntity<?> saveRole(@RequestBody Map<String, Object> param) {
        try {
            AdminPrincipal principal = getPrincipal();
            // 클라이언트가 보낸 currentUserLevel/isTrueSuperAdmin은 절대 신뢰하지 않고 서버 세션 값으로 덮어씀
            param.put("userId", principal != null ? principal.getUsername() : "admin");
            param.put("currentUserLevel", principal != null ? principal.getAthrtyLevel() : 99);
            param.put("isTrueSuperAdmin", principal != null && principal.isTrueSuperAdmin());
            adminAuthService.saveRole(param);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 권한 레벨 일괄 저장 (역할 목록의 ▲▼ 버튼으로 조정된 레벨을 반영)
    @AuditLog(actionName = "권한 레벨 일괄 저장")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/auth")
    @PostMapping("/role/level/save")
    public ResponseEntity<?> saveRoleLevels(@RequestBody List<Map<String, Object>> paramList) {
        try {
            AdminPrincipal principal = getPrincipal();
            int currentUserLevel = principal != null ? principal.getAthrtyLevel() : 99;
            boolean isTrueSuperAdmin = principal != null && principal.isTrueSuperAdmin();
            String userId = principal != null ? principal.getUsername() : "admin";
            adminAuthService.saveRoleLevels(paramList, currentUserLevel, isTrueSuperAdmin, userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 권한 그룹 논리 삭제
    @AuditLog(actionName = "권한 그룹 논리 삭제") // 👈 이것만 딱 붙이면 끝!
    @TenantGuard(action = TenantGuard.Action.DELETE, menuUrl = "/admin/auth")
    @DeleteMapping("/role/delete/{sysId}/{athrtyComCd}")
    public ResponseEntity<?> deleteRole(@PathVariable String sysId, @PathVariable String athrtyComCd) {
        try {
            AdminPrincipal principal = getPrincipal();
            int currentUserLevel = principal != null ? principal.getAthrtyLevel() : 99;
            boolean isTrueSuperAdmin = principal != null && principal.isTrueSuperAdmin();
            adminAuthService.deleteRole(sysId, athrtyComCd, currentUserLevel, isTrueSuperAdmin);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 권한별 메뉴 매트릭스 조회 (노출 여부 포함)
    @AuditLog(actionName = "권한별 메뉴 매트릭스 조회") // 👈 이것만 딱 붙이면 끝!
    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/auth")
    @GetMapping("/matrix")
    public ResponseEntity<List<Map<String, Object>>> getAuthMenuMatrix(
            @RequestParam(required = false) String sysId,
            @RequestParam String athrtyComCd) {
        AdminPrincipal principal = getPrincipal();
        boolean callerIsTrueSuper = principal != null && principal.isTrueSuperAdmin();
        if ("SUPR".equals(athrtyComCd) && !callerIsTrueSuper) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(adminAuthService.getAuthMenuMatrix(sysId, athrtyComCd));
    }

    // 매트릭스 설정 일괄 저장
    @AuditLog(actionName = "매트릭스 설정 일괄 저장") // 👈 이것만 딱 붙이면 끝!
    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/auth")
    @PostMapping("/matrix/save")
    public ResponseEntity<?> saveAuthMenuMatrix(@RequestBody List<Map<String, Object>> paramList) {
        AdminPrincipal principal = getPrincipal();
        boolean callerIsTrueSuper = principal != null && principal.isTrueSuperAdmin();
        boolean touchesSupr = paramList.stream().anyMatch(p -> "SUPR".equals(p.get("athrtyComCd")));
        if (touchesSupr && !callerIsTrueSuper) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (adminAuthService.touchesCoreOnlyMenuForNonCoreRole(paramList)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("CORE 관리 메뉴는 SUPR/S001 계정에만 부여할 수 있습니다.");
        }
        adminAuthService.saveAuthMenuMatrix(paramList);
        return ResponseEntity.ok().build();
    }
}