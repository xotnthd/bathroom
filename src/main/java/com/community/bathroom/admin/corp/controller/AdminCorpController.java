package com.community.bathroom.admin.corp.controller;

import com.community.bathroom.admin.corp.service.AdminCorpService;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * TN_CORP_D001(업체 상세정보) - TN_SYS_M001과 1:1(sys_id). AdminSysForm.jsx의 "업체 상세 정보" 카드에서만 쓰인다.
 * AdminSystemController.getSystemDetail()과 달리 모든 테넌트의 부트스트랩 호출(AdminLayout)이 아니라
 * CORE 전용 업체 관리 화면에서만 쓰이므로 SUPER_ADMIN_ONLY로 막는다.
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
    @GetMapping("/detail/{sysId}")
    public ResponseEntity<Map<String, Object>> getCorpDetail(@PathVariable String sysId) {
        return ResponseEntity.ok(adminCorpService.getCorpDetail(sysId));
    }

    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/save")
    public ResponseEntity<?> saveCorpDetail(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminCorpService.saveCorpDetail(param);
        return ResponseEntity.ok().build();
    }
}
