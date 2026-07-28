package com.community.bathroom.admin.vote.controller;

import com.community.bathroom.admin.vote.service.AdminVoteService;
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
@RequestMapping("/admin/api/vote")
public class AdminVoteController {

    @Autowired
    private AdminVoteService adminVoteService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/vote")
    @PostMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getVoteList(@RequestBody Map<String, Object> param) {
        return ResponseEntity.ok(adminVoteService.getVoteList(param));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/vote")
    @GetMapping("/detail/{sysId}/{voteIdx}")
    public ResponseEntity<Map<String, Object>> getVoteDetail(@PathVariable String sysId, @PathVariable Long voteIdx) {
        return ResponseEntity.ok(adminVoteService.getVoteDetail(sysId, voteIdx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/vote")
    @PostMapping("/save")
    public ResponseEntity<?> saveVote(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        return ResponseEntity.ok(adminVoteService.saveVote(param));
    }

    @TenantGuard(action = TenantGuard.Action.DELETE, menuUrl = "/admin/vote")
    @DeleteMapping("/delete/{sysId}/{voteIdx}")
    public ResponseEntity<?> deleteVote(@PathVariable String sysId, @PathVariable Long voteIdx) {
        adminVoteService.deleteVote(sysId, voteIdx);
        return ResponseEntity.ok().build();
    }

    // --- 아래는 "투표 결과 관리"(결과관리 하위) 화면 전용 - 투표 관리(관리/등록) 메뉴 권한과 별개로 검사한다 ---

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/vote/result/list")
    @PostMapping("/result/list")
    public ResponseEntity<List<Map<String, Object>>> getVoteListForResult(@RequestBody Map<String, Object> param) {
        return ResponseEntity.ok(adminVoteService.getVoteList(param));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/vote/result/list")
    @GetMapping("/result/detail/{sysId}/{voteIdx}")
    public ResponseEntity<Map<String, Object>> getVoteDetailForResult(@PathVariable String sysId, @PathVariable Long voteIdx) {
        return ResponseEntity.ok(adminVoteService.getVoteDetail(sysId, voteIdx));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/vote/result/list")
    @GetMapping("/eligibility/{sysId}/{voteIdx}")
    public ResponseEntity<Map<String, Object>> getEligibility(@PathVariable String sysId, @PathVariable Long voteIdx) {
        return ResponseEntity.ok(adminVoteService.getEligibility(sysId, voteIdx, getLoginUserId()));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/vote/result/list")
    @PostMapping("/cast")
    public ResponseEntity<?> castVote(@RequestBody Map<String, Object> param) {
        try {
            String sysId = (String) param.get("sysId");
            Long voteIdx = ((Number) param.get("voteIdx")).longValue();
            Long optIdx = ((Number) param.get("optIdx")).longValue();
            adminVoteService.castVote(sysId, voteIdx, getLoginUserId(), optIdx);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/vote/result/list")
    @GetMapping("/result/{sysId}/{voteIdx}")
    public ResponseEntity<Map<String, Object>> getResult(@PathVariable String sysId, @PathVariable Long voteIdx) {
        return ResponseEntity.ok(adminVoteService.getResult(sysId, voteIdx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuUrl = "/admin/vote/result/list")
    @PostMapping("/draw/{sysId}/{voteIdx}")
    public ResponseEntity<?> drawWinner(@PathVariable String sysId, @PathVariable Long voteIdx) {
        try {
            return ResponseEntity.ok(adminVoteService.drawWinner(sysId, voteIdx));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
