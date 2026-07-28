package com.community.bathroom.admin.code.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminCodeMapper {
    // 그룹 코드 핸들링 매퍼 선언
    List<Map<String, Object>> selectGroupCodeList(String sysId);
    int checkGroupCodeExists(Map<String, Object> param);
    void insertGroupCode(Map<String, Object> param);
    void updateGroupCode(Map<String, Object> param);
    void deleteGroupCode(@Param("sysId") String sysId, @Param("comCd") String comCd);

    // 계층형 상세 코드 핸들링 매퍼 선언
    List<Map<String, Object>> selectDetailCodeList(@Param("sysId") String sysId, @Param("grpCd") String grpCd, @Param("uprComCd") String uprComCd);
    int checkDetailCodeExists(Map<String, Object> param);
    void insertDetailCode(Map<String, Object> param);
    void updateDetailCode(Map<String, Object> param);
    void deleteDetailCode(@Param("sysId") String sysId, @Param("grpCd") String grpCd, @Param("uprComCd") String uprComCd, @Param("comCd") String comCd);

    void deleteDetailCodeByGroup(@Param("sysId") String sysId, @Param("grpCd") String grpCd);
    void deleteDetailCodeByParent(@Param("sysId") String sysId, @Param("grpCd") String grpCd, @Param("comCd") String comCd);
}