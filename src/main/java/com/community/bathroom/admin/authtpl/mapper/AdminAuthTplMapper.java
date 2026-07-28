package com.community.bathroom.admin.authtpl.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminAuthTplMapper {

    // --- 권한 템플릿 (Tpl) ---
    List<Map<String, Object>> selectTplList();
    int checkTplExists(Map<String, Object> param);
    void insertTpl(Map<String, Object> param);
    void updateTpl(Map<String, Object> param);
    void deleteTplRow(@Param("tplCd") String tplCd);
    void deleteDeptByTplCd(@Param("tplCd") String tplCd);
    void deleteRoleByTplCd(@Param("tplCd") String tplCd);
    void deleteMenuMapByTplCd(@Param("tplCd") String tplCd);

    // --- 부서 템플릿 (Dept) ---
    List<Map<String, Object>> selectDeptList(@Param("tplIdx") Long tplIdx);
    int checkDeptExists(Map<String, Object> param);
    void insertDept(Map<String, Object> param);
    void updateDept(Map<String, Object> param);
    void deleteDeptRow(@Param("deptIdx") Long deptIdx);
    void deleteRoleByDeptIdx(@Param("deptIdx") Long deptIdx);
    void deleteMenuMapByDeptIdx(@Param("deptIdx") Long deptIdx);

    // --- 역할 템플릿 (Role) ---
    List<Map<String, Object>> selectRoleList(@Param("deptIdx") Long deptIdx);
    int checkRoleExists(Map<String, Object> param);
    int checkRoleCodeExistsInTpl(@Param("deptIdx") Long deptIdx, @Param("athrtyTplCd") String athrtyTplCd);
    Integer selectMaxRoleLevelInDept(@Param("deptIdx") Long deptIdx);
    void insertRole(Map<String, Object> param);
    void updateRole(Map<String, Object> param);
    void deleteRoleRow(@Param("athrtyIdx") Long athrtyIdx);
    void deleteMenuMapByAthrtyIdx(@Param("athrtyIdx") Long athrtyIdx);
    void copyMenuMapFromCoreRole(@Param("athrtyIdx") Long athrtyIdx, @Param("athrtyTplCd") String athrtyTplCd, @Param("userId") String userId);

    // --- 역할별 메뉴 CRUD 매핑 ---
    List<Map<String, Object>> selectMenuMap(@Param("athrtyIdx") Long athrtyIdx, @Param("sysSectCd") String sysSectCd);
    void upsertMenuMap(Map<String, Object> param);
    int countCoreOnlyMenus(@Param("menuIds") List<String> menuIds);
}
