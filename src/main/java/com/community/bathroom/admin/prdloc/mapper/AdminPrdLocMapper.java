package com.community.bathroom.admin.prdloc.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminPrdLocMapper {
    List<Map<String, Object>> selectLocationList(String sysId);
    Map<String, Object> selectLocationByIdx(Map<String, Object> param);
    void insertLocation(Map<String, Object> param);
    void updateLocation(Map<String, Object> param);
    void logicalDeleteLocation(Map<String, Object> param);
    void insertDefaultLocation(String sysId);
}
