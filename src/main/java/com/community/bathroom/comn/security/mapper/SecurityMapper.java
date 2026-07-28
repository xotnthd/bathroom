package com.community.bathroom.comn.security.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.Map;

@Mapper
public interface SecurityMapper {
    // 1. 관리자 계정 정보 조회
    Map<String, Object> selectAdminById(@Param("loginId") String loginId);

    // 2. 일반 유저 계정 정보 조회
    Map<String, Object> selectUserById(@Param("loginId") String loginId);

    int countAdminMenuByRole(String role);

    // 3. TenantGuardAspect용: sys_id + menu_id로 그 테넌트에 해당 메뉴가 실제로 존재/사용 중인지 + 민감여부 조회
    Map<String, Object> selectMenuBySysIdAndId(@Param("sysId") String sysId, @Param("menuId") String menuId);

    // 4. TenantGuardAspect용: sys_id + 권한코드 + menu_id로 CRUD 플래그 조회
    Map<String, Object> selectMenuPermission(@Param("sysId") String sysId, @Param("athrtyComCd") String athrtyComCd, @Param("menuId") String menuId);

    // 5. TenantGuardAspect용: sys_id의 서비스 종료일 조회 (만료 시 조회 외 기능 차단)
    java.time.LocalDate selectServiceEnddeBySysId(@Param("sysId") String sysId);
}