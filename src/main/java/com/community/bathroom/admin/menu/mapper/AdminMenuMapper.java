package com.community.bathroom.admin.menu.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper // MyBatisConfig 전역 스캔 대상에 포함되어 XML과 동적 바인딩됩니다.
public interface AdminMenuMapper {
    // 계층형 메뉴 목록 조회
    List<Map<String, Object>> selectHierarchicalMenuList(@Param("sysId") String sysId, @Param("sysSectCd") String sysSectCd, @Param("uprMenuId") String uprMenuId, @Param("callerIsTrueSuper") boolean callerIsTrueSuper);

    // [검증] 중복 등록 방지를 위한 메뉴 존재 여부 카운트 체크
    int checkMenuExists(Map<String, Object> menuParam);

    // 민감 화면 여부 단건 조회 (저장 시 서버 재검증용)
    String selectMenuSensitiveYn(@Param("sysId") String sysId, @Param("menuId") String menuId);

    // 신규 메뉴 인프라 등록
    void insertMenu(Map<String, Object> menuParam);

    // 기존 메뉴 속성 수정
    void updateMenu(Map<String, Object> menuParam);

    // 노출 순서만 단건 변경 (드래그/위아래 재정렬 저장용)
    void updateMenuSortOrder(@Param("sysId") String sysId, @Param("menuId") String menuId, @Param("sortOrd") int sortOrd);

    // 메뉴 단건 논리 삭제 (del_yn = 'Y' 업데이트)
    void logicalDeleteMenu(@Param("sysId") String sysId, @Param("menuId") String menuId);

    // 하위 자식 메뉴 일괄 논리 삭제 (del_yn = 'Y' 업데이트)
    void logicalDeleteChildMenus(@Param("sysId") String sysId, @Param("menuId") String menuId);

    // [추가] 권한 맵핑 테이블(TN_ATH_M001) 자동 Insert/Update
    void upsertMenuAuthority(Map<String, Object> param);

    // [보정 완료] XML의 #{athrtyCd}와 정확히 일치하도록 @Param("athrtyCd") 명시
    List<Map<String, Object>> selectSidebarMenuList(
            @Param("sysId") String sysId,
            @Param("sysSectCd") String sysSectCd,
            @Param("athrtyCd") String athrtyCd
    );
}