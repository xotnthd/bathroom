package com.community.bathroom.admin.prdopt.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminPrdOptMapper {
    List<Map<String, Object>> selectGroupList(String sysId);
    void insertGroup(Map<String, Object> param);
    void updateGroup(Map<String, Object> param);
    void logicalDeleteGroup(Map<String, Object> param);

    List<Map<String, Object>> selectValueList(Map<String, Object> param);
    void insertValue(Map<String, Object> param);
    void updateValue(Map<String, Object> param);
    void deleteValue(Map<String, Object> param);
}
