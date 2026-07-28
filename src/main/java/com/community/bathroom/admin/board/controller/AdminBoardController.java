package com.community.bathroom.admin.board.controller;

import com.community.bathroom.admin.board.service.AdminBoardService;
import com.community.bathroom.comn.log.annotation.AuditLog;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/admin/api/board")
public class AdminBoardController {

    @Autowired
    private AdminBoardService adminBoardService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    // 1. 게시판 마스터 정보 목록 조회
    @AuditLog(actionName = "게시판 마스터 목록 조회")
    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_BOARD_01")
    @PostMapping("/managing/list")
    public ResponseEntity<List<Map<String, Object>>> getBoardManagingList(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        return ResponseEntity.ok(adminBoardService.getBoardManagingList(param));
    }

    // 1-1. 게시판 마스터 단건 상세 조회
    @AuditLog(actionName = "게시판 마스터 상세 조회")
    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_BOARD_01")
    @GetMapping("/managing/detail/{sysId}/{brdId}")
    public ResponseEntity<Map<String, Object>> getBoardManagingDetail(@PathVariable String sysId, @PathVariable String brdId) {
        return ResponseEntity.ok(adminBoardService.getBoardManagingDetail(sysId, brdId));
    }

    // 2. 공통코드 동적 풀링
    @AuditLog(actionName = "공통코드 동적 풀링")
    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_BOARD_01")
    @PostMapping("/common/code")
    public ResponseEntity<List<Map<String, Object>>> getCommonCodeList(@RequestBody Map<String, String> param) {
        String sysId = param.getOrDefault("sysId", "CORE");
        String grpCd = param.get("grpCd");
        String uprComCd = param.get("uprComCd");
        return ResponseEntity.ok(adminBoardService.getCommonCodeList(sysId, grpCd, uprComCd));
    }

    // 3. 게시판 마스터 설정 저장/수정
    @AuditLog(actionName = "게시판 마스터 설정 저장/수정")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_BOARD_01")
    @PostMapping("/managing/save")
    public ResponseEntity<?> saveBoardManaging(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId()); // 세션 유저 아이디 치환
        adminBoardService.saveBoardManaging(param);
        return ResponseEntity.ok().build();
    }

    // 4. 게시판 마스터 영구 삭제 (논리 삭제 아님)
    @AuditLog(actionName = "게시판 마스터 영구 삭제")
    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_BOARD_01")
    @DeleteMapping("/managing/delete/{sysId}/{brdId}")
    public ResponseEntity<?> deleteBoardManaging(@PathVariable String sysId, @PathVariable String brdId) {
        adminBoardService.deleteBoardManaging(sysId, brdId);
        return ResponseEntity.ok().build();
    }

    // 5. 특정 게시판의 게시물 (포스트) 실시간 뷰어 리스트 조회
    @AuditLog(actionName = "게시물 목록 실시간 조회")
    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_BOARD_POST")
    @PostMapping("/post/monitor")
    public ResponseEntity<List<Map<String, Object>>> getMonitorPostList(@RequestBody Map<String, String> param) {
        String sysId = param.getOrDefault("sysId", "CORE");
        String brdId = param.get("brdId");
        return ResponseEntity.ok(adminBoardService.getMonitorPostList(sysId, brdId));
    }

    // 6. 공통 파일 그룹에 속한 1:N 맵핑 파일 스토리지 목록 풀링
    @AuditLog(actionName = "게시물 연동 1:N 다중 파일 스토리지 목록 조회")
    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_BOARD_POST")
    @PostMapping("/common/file/list")
    public ResponseEntity<List<Map<String, Object>>> getCommonFileList(@RequestBody Map<String, String> param) {
        String sysId = param.getOrDefault("sysId", "CORE");
        String fileGrpId = param.get("fileGrpId");
        return ResponseEntity.ok(adminBoardService.getCommonFileList(sysId, fileGrpId));
    }

    // 7. 게시글 및 1:N 다중 파일 업로드 통합 저장 (Service로 토스)
    @AuditLog(actionName = "게시글 및 1:N 다중 파일 업로드 통합 저장")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_BOARD_POST")
    @PostMapping("/post/save")
    public ResponseEntity<?> saveBoardPost(
            @RequestParam Map<String, Object> param,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {

        if (!param.containsKey("sysId")) param.put("sysId", "CORE");
        param.put("userId", getLoginUserId()); // 세션 유저 아이디 치환

        adminBoardService.saveBoardPostWithFiles(param, files);
        return ResponseEntity.ok().build();
    }

    // 8. 게시글 강제 차단 (논리 삭제)
    // 참고: idx 하나만 받아서 sysId를 알 수 없음 - 소속 테넌트 소유권 검증은 서비스 레이어 후속 작업 필요 (알려진 갭)
    @AuditLog(actionName = "게시글 강제 차단 (논리 삭제)")
    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_BOARD_POST")
    @DeleteMapping("/post/kick/{idx}")
    public ResponseEntity<?> kickBoardPost(@PathVariable Long idx) {
        adminBoardService.deleteBoardPost(idx);
        return ResponseEntity.ok().build();
    }

    // 9. 게시글 일괄 차단 (논리 삭제)
    @AuditLog(actionName = "게시글 일괄 차단")
    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_BOARD_POST")
    @PostMapping("/post/kick/bulk")
    public ResponseEntity<?> kickBoardPostBulk(@RequestBody List<Long> ids) {
        adminBoardService.deleteBoardPostBulk(ids);
        return ResponseEntity.ok().build();
    }

    // 10. 게시글 강제 차단 해제 (원복)
    @AuditLog(actionName = "게시글 차단 해제")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_BOARD_POST")
    @PostMapping("/post/restore/{idx}")
    public ResponseEntity<?> restoreBoardPost(@PathVariable Long idx) {
        adminBoardService.restoreBoardPost(idx);
        return ResponseEntity.ok().build();
    }

    // 11. 게시글 일괄 차단 해제 (원복)
    @AuditLog(actionName = "게시글 일괄 차단 해제")
    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_BOARD_POST")
    @PostMapping("/post/restore/bulk")
    public ResponseEntity<?> restoreBoardPostBulk(@RequestBody List<Long> ids) {
        adminBoardService.restoreBoardPostBulk(ids);
        return ResponseEntity.ok().build();
    }

}