package com.community.bathroom.admin.corp.controller;

import com.community.bathroom.admin.corp.service.AdminCorpService;
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
 * TN_CORP_D001(업체 마스터) - 어느 시스템(테넌트)에도 종속되지 않는 독립 마스터다.
 * "시스템 이용관리"(AdminSysForm.jsx) 화면에서 TN_SYS_M001.corp_idx로 매핑해서 읽기 전용으로 가져다 쓴다.
 * TN_PAY_M001(요금제)과 동일하게 CORE에서만 관리하는 전역 마스터라 SUPER_ADMIN_ONLY로 막는다
 * (AdminPayController와 동일한 컨벤션).
 */
@RestController
@RequestMapping("/admin/api/corp")
public class AdminCorpController {

    @Autowired
    private AdminCorpService adminCorpService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getCorpList(@RequestBody Map<String, Object> param) {
        return ResponseEntity.ok(adminCorpService.getCorpList(param));
    }

    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @GetMapping("/detail/{idx}")
    public ResponseEntity<Map<String, Object>> getCorpDetail(@PathVariable Long idx) {
        return ResponseEntity.ok(adminCorpService.getCorpDetail(idx));
    }

    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/save")
    public ResponseEntity<?> saveCorp(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminCorpService.saveCorp(param);
        return ResponseEntity.ok().build();
    }

    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @DeleteMapping("/delete/{idx}")
    public ResponseEntity<?> deleteCorp(@PathVariable Long idx) {
        adminCorpService.deleteCorp(idx);
        return ResponseEntity.ok().build();
    }
}
