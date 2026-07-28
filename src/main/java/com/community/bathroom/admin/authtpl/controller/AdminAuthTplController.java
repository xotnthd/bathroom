package com.community.bathroom.admin.authtpl.controller;

import com.community.bathroom.admin.authtpl.service.AdminAuthTplService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 권한코드 템플릿(부서 × 역할 × 메뉴매핑 구조) 관리 - CORE 최고관리자 전용.
 * 상업적 요금제(가격/결제방식)는 별개인 admin/pay 도메인에서 다루며, 요금제가 이 템플릿을 참조한다.
 * 신규 테넌트 생성 시 선택된 요금제가 가리키는 템플릿 구조가 그대로 복제된다 (AdminSystemServiceImpl.createSystem 참고).
 */
@RestController
@RequestMapping("/admin/api/auth-template")
public class AdminAuthTplController {

    @Autowired
    private AdminAuthTplService adminAuthTplService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    // --- 권한 템플릿 ---
    @AuditLog(actionName = "권한 템플릿 목록 조회")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/tpl/list")
    public ResponseEntity<List<Map<String, Object>>> getTplList() {
        return ResponseEntity.ok(adminAuthTplService.getTplList());
    }

    @AuditLog(actionName = "권한 템플릿 저장")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/tpl/save")
    public ResponseEntity<?> saveTpl(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminAuthTplService.saveTpl(param);
        return ResponseEntity.ok().build();
    }

    @AuditLog(actionName = "권한 템플릿 삭제")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @DeleteMapping("/tpl/delete/{tplCd}")
    public ResponseEntity<?> deleteTpl(@PathVariable String tplCd) {
        adminAuthTplService.deleteTpl(tplCd);
        return ResponseEntity.ok().build();
    }

    // --- 부서 템플릿 ---
    @AuditLog(actionName = "권한 템플릿 부서 목록 조회")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/dept/list")
    public ResponseEntity<List<Map<String, Object>>> getDeptList(@RequestBody Map<String, Object> param) {
        Long tplIdx = ((Number) param.get("tplIdx")).longValue();
        return ResponseEntity.ok(adminAuthTplService.getDeptList(tplIdx));
    }

    @AuditLog(actionName = "권한 템플릿 부서 저장")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/dept/save")
    public ResponseEntity<?> saveDept(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminAuthTplService.saveDept(param);
        return ResponseEntity.ok().build();
    }

    @AuditLog(actionName = "권한 템플릿 부서 삭제")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @DeleteMapping("/dept/delete/{deptIdx}")
    public ResponseEntity<?> deleteDept(@PathVariable Long deptIdx) {
        adminAuthTplService.deleteDept(deptIdx);
        return ResponseEntity.ok().build();
    }

    // --- 역할 템플릿 ---
    @AuditLog(actionName = "권한 템플릿 역할 목록 조회")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/role/list")
    public ResponseEntity<List<Map<String, Object>>> getRoleList(@RequestBody Map<String, Object> param) {
        Long deptIdx = ((Number) param.get("deptIdx")).longValue();
        return ResponseEntity.ok(adminAuthTplService.getRoleList(deptIdx));
    }

    @AuditLog(actionName = "권한 템플릿 역할 저장")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/role/save")
    public ResponseEntity<?> saveRole(@RequestBody Map<String, Object> param) {
        try {
            param.put("userId", getLoginUserId());
            adminAuthTplService.saveRole(param);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @AuditLog(actionName = "권한 템플릿 역할 삭제")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @DeleteMapping("/role/delete/{athrtyIdx}")
    public ResponseEntity<?> deleteRole(@PathVariable Long athrtyIdx) {
        adminAuthTplService.deleteRole(athrtyIdx);
        return ResponseEntity.ok().build();
    }

    // --- 역할별 메뉴 CRUD 매핑 ---
    @AuditLog(actionName = "권한 템플릿 메뉴 매핑 조회")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/menu-map/list")
    public ResponseEntity<List<Map<String, Object>>> getMenuMap(@RequestBody Map<String, Object> param) {
        Long athrtyIdx = ((Number) param.get("athrtyIdx")).longValue();
        String sysSectCd = (String) param.get("sysSectCd");
        return ResponseEntity.ok(adminAuthTplService.getMenuMap(athrtyIdx, sysSectCd));
    }

    @AuditLog(actionName = "권한 템플릿 메뉴 매핑 일괄 저장")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/menu-map/save")
    public ResponseEntity<?> saveMenuMap(@RequestBody List<Map<String, Object>> items) {
        if (adminAuthTplService.touchesCoreOnlyMenu(items)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("CORE 관리 메뉴는 권한 템플릿에 부여할 수 없습니다.");
        }
        String userId = getLoginUserId();
        items.forEach(item -> item.put("userId", userId));
        adminAuthTplService.saveMenuMap(items);
        return ResponseEntity.ok().build();
    }
}
