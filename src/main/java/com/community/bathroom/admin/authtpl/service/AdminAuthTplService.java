package com.community.bathroom.admin.authtpl.service;

import java.util.List;
import java.util.Map;

public interface AdminAuthTplService {
    List<Map<String, Object>> getTplList();
    void saveTpl(Map<String, Object> param);
    void deleteTpl(String tplCd);

    List<Map<String, Object>> getDeptList(Long tplIdx);
    void saveDept(Map<String, Object> param);
    void deleteDept(Long deptIdx);

    List<Map<String, Object>> getRoleList(Long deptIdx);
    void saveRole(Map<String, Object> param);
    void deleteRole(Long athrtyIdx);

    List<Map<String, Object>> getMenuMap(Long athrtyIdx, String sysSectCd);
    void saveMenuMap(List<Map<String, Object>> items);
    boolean touchesCoreOnlyMenu(List<Map<String, Object>> items);
}
