package com.community.bathroom.admin.user.service;

import java.util.List;
import java.util.Map;

public interface AdminUserService {
    // 동적 검색 조건이 반영된 유저 리스트 조회 인터페이스
    List<Map<String, Object>> getSearchUserList(Map<String, Object> searchParam);
    Map<String, Object> getUserDetail(String sysId, String userId, boolean callerIsTrueSuper);
    void saveUser(Map<String, Object> param);
    void saveUserWithFiles(Map<String, Object> param, org.springframework.web.multipart.MultipartFile[] files);
    void deleteUser(String sysId, String userId, int currentAthrtyLevel);
}