package com.community.bathroom.admin.prdcte.controller;

import com.community.bathroom.admin.prdcte.service.AdminPrdCteService;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/prdcte")
public class AdminPrdCteController {

    @Autowired
    private AdminPrdCteService adminPrdCteService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/prd/category")
    @PostMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getChildList(@RequestBody Map<String, Object> param) {
        String sysId = (String) param.get("sysId");
        Long uprCteIdx = param.get("uprCteIdx") != null ? ((Number) param.get("uprCteIdx")).longValue() : null;
        return ResponseEntity.ok(adminPrdCteService.getChildList(sysId, uprCteIdx));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/prd/category")
    @GetMapping("/leaf/list")
    public ResponseEntity<List<Map<String, Object>>> getLeafCategoryList(@RequestParam String sysId) {
        return ResponseEntity.ok(adminPrdCteService.getLeafCategoryList(sysId));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/prd/category")
    @PostMapping("/save")
    public ResponseEntity<?> saveCategory(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminPrdCteService.saveCategory(param);
        return ResponseEntity.ok().build();
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/prd/category")
    @PostMapping("/sort/save")
    public ResponseEntity<?> saveSortOrder(@RequestBody Map<String, Object> param) {
        String sysId = (String) param.get("sysId");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) param.get("items");
        adminPrdCteService.saveSortOrder(sysId, items);
        return ResponseEntity.ok().build();
    }

    @TenantGuard(action = TenantGuard.Action.DELETE, menuUrl = "/admin/prd/category")
    @DeleteMapping("/delete/{sysId}/{idx}")
    public ResponseEntity<?> deleteCategory(@PathVariable String sysId, @PathVariable Long idx) {
        adminPrdCteService.deleteCategory(sysId, idx);
        return ResponseEntity.ok().build();
    }
}
