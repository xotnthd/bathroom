package com.community.bathroom.admin.auth.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminAuthMapper {
    List<Map<String, Object>> selectRoleList(Map<String, Object> param);
    int checkRoleExists(Map<String, Object> param);
    Integer selectRoleLevel(@Param("sysId") String sysId, @Param("athrtyComCd") String athrtyComCd);
    void insertRole(Map<String, Object> param);
    void updateRole(Map<String, Object> param);
    void updateRoleLevel(Map<String, Object> param);
    void updateRoleCodeCascadeA001(Map<String, Object> param);
    void updateRoleCodeCascadeM001(Map<String, Object> param);
    void updateRoleCodeCascadeUser(Map<String, Object> param);
    void logicalDeleteRole(@Param("sysId") String sysId, @Param("athrtyComCd") String athrtyComCd);
    
    void insertAuthHistory(Map<String, Object> param);

    List<Map<String, Object>> selectAuthMenuMatrix(@Param("sysId") String sysId, @Param("athrtyComCd") String athrtyComCd);
    int countCoreOnlyMenus(@Param("menuIds") List<String> menuIds);
    int checkAuthMenuMappingExists(Map<String, Object> param);
    void insertAuthMenuMapping(Map<String, Object> param);
    void updateAuthMenuMapping(Map<String, Object> param);
    void deleteAuthMenuMappingByRole(@Param("sysId") String sysId, @Param("athrtyComCd") String athrtyComCd);
}