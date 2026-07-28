package com.community.bathroom.admin.prdloc.controller;

import com.community.bathroom.admin.prdloc.service.AdminPrdLocService;
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
@RequestMapping("/admin/api/prdloc")
public class AdminPrdLocController {

    @Autowired
    private AdminPrdLocService adminPrdLocService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRDLOC_01")
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getLocationList(@RequestParam String sysId) {
        return ResponseEntity.ok(adminPrdLocService.getLocationList(sysId));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRDLOC_01")
    @GetMapping("/detail/{sysId}/{idx}")
    public ResponseEntity<Map<String, Object>> getLocation(@PathVariable String sysId, @PathVariable Long idx) {
        return ResponseEntity.ok(adminPrdLocService.getLocation(sysId, idx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_PRDLOC_01")
    @PostMapping("/save")
    public ResponseEntity<?> saveLocation(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminPrdLocService.saveLocation(param);
        return ResponseEntity.ok(param);
    }

    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_PRDLOC_01")
    @DeleteMapping("/delete/{sysId}/{idx}")
    public ResponseEntity<?> deleteLocation(@PathVariable String sysId, @PathVariable Long idx) {
        adminPrdLocService.deleteLocation(sysId, idx);
        return ResponseEntity.ok().build();
    }
}
