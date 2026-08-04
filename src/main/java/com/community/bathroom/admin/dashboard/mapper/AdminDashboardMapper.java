package com.community.bathroom.admin.dashboard.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminDashboardMapper {
    Map<String, Object> selectDashboardStats(@Param("sysId") String sysId);
    List<Map<String, Object>> selectActiveVotes(@Param("sysId") String sysId);
    List<Map<String, Object>> selectActiveSurveys(@Param("sysId") String sysId);
    List<Map<String, Object>> selectRecentLogs(@Param("sysId") String sysId);
}
