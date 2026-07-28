package com.community.bathroom.admin.code.service;

import java.util.List;
import java.util.Map;

public interface AdminCodeService {
    List<Map<String, Object>> getGroupCodeList(String sysId);
    void saveGroupCode(Map<String, Object> param);
    void deleteGroupCode(String sysId, String comCd);

    List<Map<String, Object>> getDetailCodeList(String sysId, String grpCd, String uprComCd);
    void saveDetailCode(Map<String, Object> param);
    void deleteDetailCode(String sysId, String grpCd, String uprComCd, String comCd);
}