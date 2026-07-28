package com.community.bathroom.admin.prdopt.service;

import java.util.List;
import java.util.Map;

public interface AdminPrdOptService {
    List<Map<String, Object>> getGroupList(String sysId);
    void saveGroup(Map<String, Object> param);
    void deleteGroup(String sysId, Long idx);

    List<Map<String, Object>> getValueList(Long optGrpIdx);
    void saveValue(Map<String, Object> param);
    void deleteValue(Long idx);
}
