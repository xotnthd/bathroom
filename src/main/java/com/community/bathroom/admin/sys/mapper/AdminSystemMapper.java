package com.community.bathroom.admin.sys.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminSystemMapper {
    List<Map<String, Object>> selectSystemList(Map<String, Object> param);
    Map<String, Object> selectSystemById(String sysId);
    List<String> selectSystemMenuIds(String sysId);
    
    void updateSystemConfig(Map<String, Object> param);
    void updateMasterUser(Map<String, Object> param);
    void updateMasterUserDetail(Map<String, Object> param);
    void deleteMenuAuthoritiesBySysId(String sysId);
    
    int checkUserIdExists(String userId);
    void insertSystem(Map<String, Object> param);
    void copyAdminMenus(String sysId);
    void copyBoards(String sysId);
    void copyBoardDetails(String sysId);

    void copyAuthorityGroups(@Param("sysId") String sysId, @Param("tplCd") String tplCd);
    void copyAuthorityMenuMappings(@Param("sysId") String sysId, @Param("tplCd") String tplCd);
    void insertMenuAuthorities(@org.apache.ibatis.annotations.Param("sysId") String sysId, @org.apache.ibatis.annotations.Param("menuIds") List<String> menuIds, @org.apache.ibatis.annotations.Param("userId") String userId);
    void insertMasterUser(Map<String, Object> param);
    void insertMasterUserDetail(Map<String, Object> param);
}
