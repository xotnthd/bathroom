package com.community.bathroom.user.site.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserSiteMapper {
    Map<String, Object> selectSiteConfig(String sysId);

    /** fileSn이 그 sysId의 로고/배너 파일그룹에 실제로 속하는지 확인 (공개 다운로드 엔드포인트 오남용 방지). */
    int countSiteFile(@Param("sysId") String sysId, @Param("fileSn") Long fileSn);

    /** 공개 홈페이지 GNB용 - 사용자(US) 섹션 메뉴 전체를 평면 목록으로 조회 (login/등급 게이팅 판단에 필요한 정보 포함). */
    List<Map<String, Object>> selectUsMenuList(@Param("sysId") String sysId);
}
