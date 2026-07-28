package com.community.bathroom.admin.prdsup.controller;

import com.community.bathroom.admin.prdsup.service.AdminPrdSupService;
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
@RequestMapping("/admin/api/prdsup")
public class AdminPrdSupController {

    @Autowired
    private AdminPrdSupService adminPrdSupService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/prd/supplier")
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getSupplierList(@RequestParam String sysId) {
        return ResponseEntity.ok(adminPrdSupService.getSupplierList(sysId));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/prd/supplier")
    @GetMapping("/detail/{sysId}/{idx}")
    public ResponseEntity<Map<String, Object>> getSupplier(@PathVariable String sysId, @PathVariable Long idx) {
        return ResponseEntity.ok(adminPrdSupService.getSupplier(sysId, idx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/prd/supplier")
    @PostMapping("/save")
    public ResponseEntity<?> saveSupplier(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminPrdSupService.saveSupplier(param);
        return ResponseEntity.ok(param);
    }

    @TenantGuard(action = TenantGuard.Action.DELETE, menuUrl = "/admin/prd/supplier")
    @DeleteMapping("/delete/{sysId}/{idx}")
    public ResponseEntity<?> deleteSupplier(@PathVariable String sysId, @PathVariable Long idx) {
        adminPrdSupService.deleteSupplier(sysId, idx);
        return ResponseEntity.ok().build();
    }
}
