package com.community.bathroom.admin.code.controller;

import com.community.bathroom.admin.code.service.AdminCodeService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/code")
public class AdminCodeController {

    @Autowired
    private AdminCodeService adminCodeService;

    /* ==========================================================
     * 1. 최상위 그룹 코드 (TN_COM_C001) 제어부
     * ========================================================== */
    @AuditLog(actionName = "최상위 그룹 코드 리스트")
    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/code")
    @GetMapping("/group/list")
    public ResponseEntity<List<Map<String, Object>>> getGroupCodeList(@RequestParam(required = false) String sysId) {
        return ResponseEntity.ok(adminCodeService.getGroupCodeList(sysId));
    }

    @AuditLog(actionName = "코드 그룹 저장")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/code")
    @PostMapping("/group/save")
    public ResponseEntity<?> saveGroupCode(@RequestBody Map<String, Object> param) {
        param.put("userId", "admin");
        adminCodeService.saveGroupCode(param);
        return ResponseEntity.ok().build();
    }

    @AuditLog(actionName = "코드 그룹 삭제")
    @TenantGuard(action = TenantGuard.Action.DELETE, menuUrl = "/admin/code")
    @DeleteMapping("/group/delete/{sysId}/{comCd}")
    public ResponseEntity<?> deleteGroupCode(@PathVariable String sysId, @PathVariable String comCd) {
        adminCodeService.deleteGroupCode(sysId, comCd);
        return ResponseEntity.ok().build();
    }

    /* ==========================================================
     * 2. 계층형 상세 세부 코드 (TN_COM_C002) 제어부 (중간레벨, 상세레벨 통합 통제)
     * ========================================================== */
    @AuditLog(actionName = "코드 디테일 리스트")
    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/code")
    @GetMapping("/detail/list")
    public ResponseEntity<List<Map<String, Object>>> getDetailCodeList(
            @RequestParam(required = false) String sysId,
            @RequestParam String grpCd,
            @RequestParam String uprComCd) {
        return ResponseEntity.ok(adminCodeService.getDetailCodeList(sysId, grpCd, uprComCd));
    }

    @AuditLog(actionName = "코드 디테일 저장")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/code")
    @PostMapping("/detail/save")
    public ResponseEntity<?> saveDetailCode(@RequestBody Map<String, Object> param) {
        param.put("userId", "admin");
        adminCodeService.saveDetailCode(param);
        return ResponseEntity.ok().build();
    }

    @AuditLog(actionName = "코드 디테일 삭제")
    @TenantGuard(action = TenantGuard.Action.DELETE, menuUrl = "/admin/code")
    @DeleteMapping("/detail/delete/{sysId}/{grpCd}/{uprComCd}/{comCd}")
    public ResponseEntity<?> deleteDetailCode(
            @PathVariable String sysId,
            @PathVariable String grpCd,
            @PathVariable String uprComCd,
            @PathVariable String comCd) {
        adminCodeService.deleteDetailCode(sysId, grpCd, uprComCd, comCd);
        return ResponseEntity.ok().build();
    }

}