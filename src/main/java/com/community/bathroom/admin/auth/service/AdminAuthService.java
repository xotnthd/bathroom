package com.community.bathroom.admin.auth.service;

import java.util.List;
import java.util.Map;

public interface AdminAuthService {
    List<Map<String, Object>> getRoleList(String sysId, String sysSeCd, boolean callerIsTrueSuper, int currentUserLevel);
    void saveRole(Map<String, Object> param);
    void deleteRole(String sysId, String athrtyComCd, int currentUserLevel, boolean isTrueSuperAdmin);
    void saveRoleLevels(List<Map<String, Object>> items, int currentUserLevel, boolean isTrueSuperAdmin, String userId);
    List<Map<String, Object>> getAuthMenuMatrix(String sysId, String athrtyComCd);
    void saveAuthMenuMatrix(List<Map<String, Object>> paramList);
    boolean touchesCoreOnlyMenuForNonCoreRole(List<Map<String, Object>> paramList);
}