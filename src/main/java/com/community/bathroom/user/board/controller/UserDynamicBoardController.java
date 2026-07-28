package com.community.bathroom.user.board.controller;

import com.community.bathroom.user.board.service.UserDynamicBoardService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/user/api/board/dynamic")
public class UserDynamicBoardController {

    @Autowired
    private UserDynamicBoardService userDynamicBoardService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @AuditLog(actionName = "사용자 동적 게시판 목록 조회")
    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> getDynamicBoardList(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        param.put("isAdmin", "N"); // 사용자 권한 강제 주입

        Map<String, Object> result = userDynamicBoardService.getDynamicBoardList(param);
        return ResponseEntity.ok(result);
    }

    @AuditLog(actionName = "사용자 동적 게시글 상세 조회")
    @PostMapping("/detail")
    public ResponseEntity<Map<String, Object>> getDynamicBoardDetail(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        param.put("currentUserId", getLoginUserId());

        Map<String, Object> result = userDynamicBoardService.getDynamicBoardDetail(param);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/master")
    public ResponseEntity<Map<String, Object>> getBoardMasterInfo(@RequestBody Map<String, String> param) {
        String sysId = param.getOrDefault("sysId", "CORE");
        String brdId = param.get("brdId");
        Map<String, Object> masterInfo = userDynamicBoardService.getBoardMasterInfo(sysId, brdId);
        
        if (masterInfo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(masterInfo);
    }
}
