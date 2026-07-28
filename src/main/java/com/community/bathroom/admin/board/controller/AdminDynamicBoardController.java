package com.community.bathroom.admin.board.controller;

import com.community.bathroom.admin.board.service.AdminDynamicBoardService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/admin/api/board/dynamic")
public class AdminDynamicBoardController {

    @Autowired
    private AdminDynamicBoardService adminDynamicBoardService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    // 참고: 게시판마다 menu_url이 달라(예: /admin/board/view/{brdId}) 고정 메뉴로 앵커링할 수 없어
    // sysId 검증만 적용한다 (메뉴/CRUD 매트릭스 체크는 생략).
    @AuditLog(actionName = "관리자 동적 게시판 목록 조회")
    @TenantGuard(action = TenantGuard.Action.READ)
    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> getDynamicBoardList(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        param.put("isAdmin", "Y"); // 관리자 권한 강제 주입

        Map<String, Object> result = adminDynamicBoardService.getDynamicBoardList(param);
        return ResponseEntity.ok(result);
    }

    @AuditLog(actionName = "관리자 동적 게시글 상세 조회")
    @TenantGuard(action = TenantGuard.Action.READ)
    @PostMapping("/detail")
    public ResponseEntity<Map<String, Object>> getDynamicBoardDetail(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        param.put("currentUserId", getLoginUserId());

        Map<String, Object> result = adminDynamicBoardService.getDynamicBoardDetail(param);
        return ResponseEntity.ok(result);
    }

    @TenantGuard(action = TenantGuard.Action.READ)
    @PostMapping("/master")
    public ResponseEntity<Map<String, Object>> getBoardMasterInfo(@RequestBody Map<String, String> param) {
        String sysId = param.getOrDefault("sysId", "CORE");
        String brdId = param.get("brdId");
        return ResponseEntity.ok(adminDynamicBoardService.getBoardMasterInfo(sysId, brdId));
    }
}
