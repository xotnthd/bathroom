package com.community.bathroom.admin.prdsup.service;

import java.util.List;
import java.util.Map;

public interface AdminPrdSupService {
    List<Map<String, Object>> getSupplierList(String sysId);
    Map<String, Object> getSupplier(String sysId, Long idx);
    void saveSupplier(Map<String, Object> param);
    void deleteSupplier(String sysId, Long idx);
}
