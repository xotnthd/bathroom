package com.community.bathroom.admin.prdcte.service;

import java.util.List;
import java.util.Map;

public interface AdminPrdCteService {
    List<Map<String, Object>> getChildList(String sysId, Long uprCteIdx);
    void saveCategory(Map<String, Object> param);
    void deleteCategory(String sysId, Long idx);
    void saveSortOrder(String sysId, List<Map<String, Object>> items);
    List<Map<String, Object>> getLeafCategoryList(String sysId);
}
