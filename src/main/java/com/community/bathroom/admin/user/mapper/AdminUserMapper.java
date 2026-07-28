package com.community.bathroom.admin.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminUserMapper {
    // 동적 다중 조건 검색용 매퍼 메서드 선언
    List<Map<String, Object>> selectSearchUserList(Map<String, Object> searchParam);
    Map<String, Object> selectUserDetail(Map<String, Object> param);
    Map<String, Object> selectUserById(@Param("sysId") String sysId, @Param("userId") String userId);
    int checkUserExists(Map<String, Object> param);

    void insertUserMaster(Map<String, Object> param);
    void updateUserMaster(Map<String, Object> param);
    void deleteUserMaster(@Param("sysId") String sysId, @Param("userId") String userId);

    void insertUserDetail(Map<String, Object> param);
    void updateUserDetail(Map<String, Object> param);
    void deleteUserDetail(@Param("userIdx") Long userIdx);

    Map<String, Object> selectAuthorityLevelByCd(@Param("sysId") String sysId, @Param("athrtyCd") String athrtyCd);

    int checkEmpNoExists(Map<String, Object> param);
    Long selectMaxEmpNoSeq(@Param("sysId") String sysId);
}