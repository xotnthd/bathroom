package com.community.bathroom.admin.prdloc.service;

import java.util.List;
import java.util.Map;

public interface AdminPrdLocService {
    List<Map<String, Object>> getLocationList(String sysId);
    Map<String, Object> getLocation(String sysId, Long idx);
    void saveLocation(Map<String, Object> param);
    void deleteLocation(String sysId, Long idx);
}
