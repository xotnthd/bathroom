package com.community.bathroom.admin.auth.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface AdminLoginMapper {
    // 관리자 정보 단건 조회
    Map<String, Object> selectAdminUserInfo(String userId);
}