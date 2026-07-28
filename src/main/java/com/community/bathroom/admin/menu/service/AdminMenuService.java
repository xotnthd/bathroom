package com.community.bathroom.admin.menu.service;

import java.util.List;
import java.util.Map;

public interface AdminMenuService {
    // 섹션코드 및 부모메뉴 ID 조건에 따른 계층형 메뉴 리스트 조회
    List<Map<String, Object>> getHierarchicalMenuList(String sysId, String sysSectCd, String uprMenuId, boolean callerIsTrueSuper);

    // 메뉴 정보 신규 등록 및 수정 (Upsert) - callerIsTrueSuper가 아니면 민감(sensitive_yn) 메뉴를 만들거나 건드릴 수 없음
    void saveMenu(Map<String, Object> menuParam, boolean callerIsTrueSuper);

    // 메뉴 단건 및 하위 자식 노드 일괄 논리 삭제 (del_yn = 'Y')
    void deleteMenu(String sysId, String menuId);

    // 같은 부모 아래 형제 메뉴들의 노출 순서 일괄 재지정
    void saveMenuSortOrder(String sysId, List<Map<String, Object>> items);

    // Service 인터페이스에 추가
    List<Map<String, Object>> getSidebarMenuList(String sysId, String sysSectCd, String athrtyCd);
}