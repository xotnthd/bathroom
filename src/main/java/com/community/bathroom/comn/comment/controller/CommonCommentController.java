package com.community.bathroom.comn.comment.controller;

import com.community.bathroom.comn.comment.service.CommonCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/board/comment")
public class CommonCommentController {

    @Autowired
    private CommonCommentService commonCommentService;

    @PostMapping("/list")
    public ResponseEntity<?> getCommentList(@RequestBody Map<String, Object> param) {
        List<Map<String, Object>> list = commonCommentService.getCommentList(param);
        
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) ? auth.getName() : null;

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("currentUserId", currentUserId);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveComment(
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam("commentData") String commentDataJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> param = mapper.readValue(commentDataJson, new TypeReference<Map<String, Object>>() {});
            
            commonCommentService.saveComment(param, files);
            Map<String, Object> res = new HashMap<>();
            res.put("status", "SUCCESS");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("댓글 저장 실패");
        }
    }

    @DeleteMapping("/delete/{cmtIdx}")
    public ResponseEntity<?> deleteComment(@PathVariable Long cmtIdx) {
        try {
            commonCommentService.deleteComment(cmtIdx);
            Map<String, Object> res = new HashMap<>();
            res.put("status", "SUCCESS");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("댓글 삭제 실패");
        }
    }
}
