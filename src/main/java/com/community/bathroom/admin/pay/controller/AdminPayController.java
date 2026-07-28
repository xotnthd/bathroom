package com.community.bathroom.admin.pay.controller;

import com.community.bathroom.admin.pay.service.AdminPayService;
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
 * 요금제(상업 조건: 결제방식/가격/할인/템플릿 참조) 관리 - CORE 최고관리자 전용.
 * 권한 구조 자체는 admin/authtpl(권한 템플릿) 도메인이 담당하며, 여기서는 그 템플릿을 참조해
 * 실제 가격/결제방식을 붙인 "상품"만 다룬다.
 */
@RestController
@RequestMapping("/admin/api/pay")
public class AdminPayController {

    @Autowired
    private AdminPayService adminPayService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @AuditLog(actionName = "요금제 목록 조회")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getPayList() {
        return ResponseEntity.ok(adminPayService.getPayList());
    }

    @AuditLog(actionName = "요금제 상세 조회")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @GetMapping("/detail/{payPlanCd}")
    public ResponseEntity<Map<String, Object>> getPay(@PathVariable String payPlanCd) {
        return ResponseEntity.ok(adminPayService.getPay(payPlanCd));
    }

    @AuditLog(actionName = "요금제 저장")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/save")
    public ResponseEntity<?> savePay(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminPayService.savePay(param);
        return ResponseEntity.ok().build();
    }

    @AuditLog(actionName = "요금제 삭제")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @DeleteMapping("/delete/{payPlanCd}")
    public ResponseEntity<?> deletePay(@PathVariable String payPlanCd) {
        try {
            adminPayService.deletePay(payPlanCd);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @AuditLog(actionName = "업체 요금제 이력 조회")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @GetMapping("/history/{sysId}")
    public ResponseEntity<List<Map<String, Object>>> getHistory(@PathVariable String sysId) {
        return ResponseEntity.ok(adminPayService.getHistory(sysId));
    }

    @AuditLog(actionName = "업체 요금제 배정/변경")
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/assign")
    public ResponseEntity<?> assign(@RequestBody Map<String, Object> param) {
        String sysId = (String) param.get("sysId");
        Long payIdx = ((Number) param.get("payIdx")).longValue();
        String chgRsn = (String) param.get("chgRsn");
        adminPayService.assignPay(sysId, payIdx, chgRsn, getLoginUserId());
        return ResponseEntity.ok().build();
    }
}
