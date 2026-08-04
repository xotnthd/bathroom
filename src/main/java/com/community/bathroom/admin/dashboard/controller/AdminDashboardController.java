package com.community.bathroom.admin.dashboard.controller;

import com.community.bathroom.admin.dashboard.service.AdminDashboardService;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin/api/dashboard")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    // 대시보드는 특정 메뉴 권한이 아니라 로그인한 관리자의 소속 sysId 검증만 필요 (사이드바 부트스트랩과 동일한 성격)
    @TenantGuard(action = TenantGuard.Action.READ)
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(@RequestParam(required = false) String sysId) {
        return ResponseEntity.ok(adminDashboardService.getDashboardSummary(sysId));
    }
}
