package com.community.bathroom.admin.menu.controller;

import com.community.bathroom.admin.menu.service.AdminMenuService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import com.community.bathroom.comn.security.model.AdminPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/admin/api/menu")
public class AdminMenuController {

    @Autowired
    private AdminMenuService adminMenuService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    private boolean isCallerTrueSuperAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getPrincipal() instanceof AdminPrincipal principal && principal.isTrueSuperAdmin();
    }

    // 활성화 및 미삭제(del_yn = 'N')된 상태의 계층별 메뉴 배열 풀링 API
    @AuditLog(actionName = "메뉴 리스트 가져오기")
    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/menu")
    @PostMapping("/hierarchical/list")
    public ResponseEntity<List<Map<String, Object>>> getHierarchicalMenuList(@RequestBody Map<String, String> param) {
        String sysId = param.getOrDefault("sysId", "CORE");
        String sysSectCd = param.get("sysSectCd");
        String uprMenuId = param.get("uprMenuId");
        return ResponseEntity.ok(adminMenuService.getHierarchicalMenuList(sysId, sysSectCd, uprMenuId, isCallerTrueSuperAdmin()));
    }

    // 메뉴 속성 및 동적 게시판 연동 정보 저장/수정 (Upsert)
    @AuditLog(actionName = "메뉴 저장")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/menu")
    @PostMapping("/save")
    public ResponseEntity<?> saveMenu(@RequestBody Map<String, Object> menuParam) {
        try {
            menuParam.put("userId", getLoginUserId()); // 세션 유저 아이디 치환
            adminMenuService.saveMenu(menuParam, isCallerTrueSuperAdmin());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 같은 부모 아래 형제 메뉴들의 노출 순서 일괄 재지정 (위/아래 재정렬 후 "순서 저장")
    @AuditLog(actionName = "메뉴 순서 일괄 변경")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/menu")
    @PostMapping("/sort/save")
    public ResponseEntity<?> saveMenuSortOrder(@RequestBody Map<String, Object> param) {
        String sysId = (String) param.get("sysId");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) param.get("items");
        adminMenuService.saveMenuSortOrder(sysId, items);
        return ResponseEntity.ok().build();
    }

    // 물리 삭제 구문을 전면 폐기하고 del_yn = 'Y'로 치환 업데이트하는 Soft Delete API
    @AuditLog(actionName = "메뉴 삭제")
    @TenantGuard(action = TenantGuard.Action.DELETE, menuUrl = "/admin/menu")
    @DeleteMapping("/delete/{sysId}/{menuId}")
    public ResponseEntity<?> deleteMenu(@PathVariable String sysId, @PathVariable String menuId) {
        adminMenuService.deleteMenu(sysId, menuId);
        return ResponseEntity.ok().build();
    }

    // ---------------- [추가분] ----------------
    // 사이드바 렌더링을 위해 활성화된 전체 메뉴 트리를 평면 목록으로 한 번에 가져옵니다.
    // 모든 화면 진입 시 공통으로 호출되는 부트스트랩 성격이라 특정 메뉴 권한이 아니라 sysId만 검증한다.
    @TenantGuard(action = TenantGuard.Action.READ)
    @PostMapping("/sidebar/list")
    public ResponseEntity<List<Map<String, Object>>> getSidebarMenuList(@RequestBody Map<String, String> param) {
        String sysId = param.getOrDefault("sysId", "CORE");
        String sysSectCd = param.getOrDefault("sysSectCd", "MG");
        String athrtyCd = param.get("athrtyCd");
        return ResponseEntity.ok(adminMenuService.getSidebarMenuList(sysId, sysSectCd, athrtyCd));
    }
}