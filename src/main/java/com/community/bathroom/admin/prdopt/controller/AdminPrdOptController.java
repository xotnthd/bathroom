package com.community.bathroom.admin.prdopt.controller;

import com.community.bathroom.admin.prdopt.service.AdminPrdOptService;
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
@RequestMapping("/admin/api/prdopt")
public class AdminPrdOptController {

    @Autowired
    private AdminPrdOptService adminPrdOptService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRDOPT_01")
    @GetMapping("/group/list")
    public ResponseEntity<List<Map<String, Object>>> getGroupList(@RequestParam String sysId) {
        return ResponseEntity.ok(adminPrdOptService.getGroupList(sysId));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_PRDOPT_01")
    @PostMapping("/group/save")
    public ResponseEntity<?> saveGroup(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminPrdOptService.saveGroup(param);
        return ResponseEntity.ok().build();
    }

    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_PRDOPT_01")
    @DeleteMapping("/group/delete/{sysId}/{idx}")
    public ResponseEntity<?> deleteGroup(@PathVariable String sysId, @PathVariable Long idx) {
        adminPrdOptService.deleteGroup(sysId, idx);
        return ResponseEntity.ok().build();
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRDOPT_01")
    @GetMapping("/value/list")
    public ResponseEntity<List<Map<String, Object>>> getValueList(@RequestParam Long optGrpIdx) {
        return ResponseEntity.ok(adminPrdOptService.getValueList(optGrpIdx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_PRDOPT_01")
    @PostMapping("/value/save")
    public ResponseEntity<?> saveValue(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminPrdOptService.saveValue(param);
        return ResponseEntity.ok().build();
    }

    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_PRDOPT_01")
    @DeleteMapping("/value/delete/{idx}")
    public ResponseEntity<?> deleteValue(@PathVariable Long idx) {
        adminPrdOptService.deleteValue(idx);
        return ResponseEntity.ok().build();
    }
}
