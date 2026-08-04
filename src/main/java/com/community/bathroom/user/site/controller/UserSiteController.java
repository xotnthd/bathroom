package com.community.bathroom.user.site.controller;

import com.community.bathroom.comn.file.service.CommonFileService;
import com.community.bathroom.comn.security.model.UserPrincipal;
import com.community.bathroom.user.site.mapper.UserSiteMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 공개 홈페이지(비로그인 방문자) 전용 - 화면 구성 설정 조회.
 * /admin/api/sys/detail은 TenantGuard가 붙어 로그인이 없으면 무조건 401이 나므로,
 * 익명 방문자도 호출 가능해야 하는 레이아웃/배너/테마 정보는 이 공개 엔드포인트로 따로 노출한다.
 */
@RestController
@RequestMapping("/user/api/site")
public class UserSiteController {

    @Autowired
    private UserSiteMapper userSiteMapper;

    @Autowired
    private CommonFileService commonFileService;

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getSiteConfig(@RequestParam(defaultValue = "CORE") String sysId) {
        Map<String, Object> config = userSiteMapper.selectSiteConfig(sysId);
        return ResponseEntity.ok(config != null ? config : new HashMap<>());
    }

    // 공개 홈페이지 GNB(2~3뎁스) - 로그인 여부/등급에 따라 관리자가 설정한 메뉴만 걸러서 노출한다.
    @GetMapping("/menu-tree")
    public ResponseEntity<List<Map<String, Object>>> getUsMenuTree(@RequestParam(defaultValue = "CORE") String sysId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean loggedIn = false;
        int userGradeSortOrd = -1;
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            loggedIn = true;
            if (auth.getPrincipal() instanceof UserPrincipal user) {
                userGradeSortOrd = user.getUserGradeSortOrd();
            } else {
                // 관리자가 "사용자 화면 테스트"로 미리보기하는 경우 - 등급 제한 메뉴도 전부 보이도록 최고 등급 취급
                userGradeSortOrd = Integer.MAX_VALUE;
            }
        }

        List<Map<String, Object>> all = userSiteMapper.selectUsMenuList(sysId);
        List<Map<String, Object>> visible = new ArrayList<>();
        for (Map<String, Object> menu : all) {
            boolean loginRequired = "Y".equals(menu.get("loginRequiredYn"));
            if (loginRequired && !loggedIn) continue;

            Object requiredGradeCd = menu.get("requiredGradeCd");
            if (requiredGradeCd != null && !String.valueOf(requiredGradeCd).isEmpty()) {
                int requiredSortOrd = ((Number) menu.get("requiredGradeSortOrd")).intValue();
                if (userGradeSortOrd < requiredSortOrd) continue;
            }
            visible.add(menu);
        }
        return ResponseEntity.ok(visible);
    }

    // 로고/배너 이미지 전용 공개 다운로드. /admin/api/comn/file/download는 로그인이 필요해 익명 방문자가 못 쓰므로,
    // 딱 그 sysId의 로고/배너 파일그룹에 속한 fileSn만 검증 후 공개로 서빙한다 (다른 파일 무단 조회 방지).
    @GetMapping("/file/{fileSn}")
    public ResponseEntity<Void> downloadSiteFile(@PathVariable Long fileSn, @RequestParam(defaultValue = "CORE") String sysId, HttpServletResponse response) {
        if (userSiteMapper.countSiteFile(sysId, fileSn) == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        commonFileService.downloadFile(fileSn, response);
        return ResponseEntity.ok().build();
    }
}
