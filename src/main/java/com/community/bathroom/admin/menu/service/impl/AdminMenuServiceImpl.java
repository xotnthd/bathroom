package com.community.bathroom.admin.menu.service.impl;

import com.community.bathroom.admin.menu.mapper.AdminMenuMapper;
import com.community.bathroom.admin.menu.service.AdminMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class AdminMenuServiceImpl implements AdminMenuService {

    @Autowired
    private AdminMenuMapper adminMenuMapper;

    @Override
    public List<Map<String, Object>> getHierarchicalMenuList(String sysId, String sysSectCd, String uprMenuId, boolean callerIsTrueSuper) {
        return adminMenuMapper.selectHierarchicalMenuList(sysId, sysSectCd, uprMenuId, callerIsTrueSuper);
    }

    @Override
    @Transactional
    public void saveMenu(Map<String, Object> menuParam, boolean callerIsTrueSuper) {
        String sysId = (String) menuParam.get("sysId");
        String menuId = (String) menuParam.get("menuId");

        // [밸리데이션] 기등록 식별 검증 count(*) 작동
        int cnt = adminMenuMapper.checkMenuExists(menuParam);

        // 게시판 매핑 체크박스가 해제되어 넘어온 경우, DB 유실 방지를 위해 brd_id를 명시적 null 처리
        if (menuParam.get("brdId") == null || String.valueOf(menuParam.get("brdId")).trim().isEmpty()) {
            menuParam.put("brdId", null);
        }

        // 라우팅 경로/컴포넌트 경로는 CORE만 직접 지정 가능 - 업체 관리자는 게시판 매핑을 통해서만 URL이 정해짐(자동계산), 클라이언트가 보낸 임의 값은 무시
        if (!"CORE".equals(sysId)) {
            Object brdId = menuParam.get("brdId");
            if (brdId != null) {
                String prefix = "MG".equals(menuParam.get("sysSectCd")) ? "/admin/board/view/" : "/user/board/view/";
                menuParam.put("menuUrl", prefix + brdId);
            } else {
                menuParam.put("menuUrl", null);
            }
            menuParam.put("compPath", null);
        }

        // 민감 화면 여부는 진짜 최고관리자(SUPR)만 지정/변경 가능 - 기존 값이 이미 Y였거나, 새로 Y로 설정하려는 경우 모두 차단
        Object rawSensitive = menuParam.get("sensitiveYn");
        String requestedSensitiveYn = (rawSensitive == null || String.valueOf(rawSensitive).trim().isEmpty()) ? "N" : String.valueOf(rawSensitive);
        if (!callerIsTrueSuper) {
            String existingSensitiveYn = cnt > 0 ? adminMenuMapper.selectMenuSensitiveYn(sysId, menuId) : "N";
            if ("Y".equals(existingSensitiveYn) || "Y".equals(requestedSensitiveYn)) {
                throw new IllegalArgumentException("민감 화면은 최고관리자만 등록/수정할 수 있습니다.");
            }
        }
        menuParam.put("sensitiveYn", requestedSensitiveYn);

        if (cnt > 0) {
            adminMenuMapper.updateMenu(menuParam);
        } else {
            adminMenuMapper.insertMenu(menuParam);
        }

        // [권한 부여 자동화] 최소한 메뉴를 저장한 관리자는 해당 메뉴를 볼 수 있도록 자동 매핑 처리
        String role = "ROLE_ADMIN"; // fallback 기본값
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && !auth.getAuthorities().isEmpty()) {
            role = auth.getAuthorities().iterator().next().getAuthority();
        }
        menuParam.put("role", role);
        adminMenuMapper.upsertMenuAuthority(menuParam);
    }

    @Override
    @Transactional
    public void deleteMenu(String sysId, String menuId) {
        // [개편] 자식 및 자신 메뉴를 완전히 살려둔 채 삭제 상태(del_yn='Y')만 연쇄 업데이트 마킹 처리
        adminMenuMapper.logicalDeleteChildMenus(sysId, menuId);
        adminMenuMapper.logicalDeleteMenu(sysId, menuId);
    }

    // ServiceImpl 구현체에 추가
    // [보정 완료] 서비스 구현체에서 매퍼 인터페이스로 권한 코드를 최종 토스합니다.
    @Override
    public List<Map<String, Object>> getSidebarMenuList(String sysId, String sysSectCd, String athrtyCd) {
        return adminMenuMapper.selectSidebarMenuList(sysId, sysSectCd, athrtyCd);
    }

    @Override
    @Transactional
    public void saveMenuSortOrder(String sysId, List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            String menuId = (String) item.get("menuId");
            int sortOrd = ((Number) item.get("sortOrd")).intValue();
            adminMenuMapper.updateMenuSortOrder(sysId, menuId, sortOrd);
        }
    }
}