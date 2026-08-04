package com.community.bathroom.admin.sys.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

public interface AdminSystemService {
    List<Map<String, Object>> getSystemList(Map<String, Object> param);
    Map<String, Object> getSystemById(String sysId);
    void saveSystemConfig(Map<String, Object> param, MultipartFile[] logoFiles, MultipartFile[] bannerFiles);
    boolean checkUserIdExists(String sysId, String userId);
    void createSystem(Map<String, Object> param, MultipartFile[] logoFiles, MultipartFile[] bannerFiles) throws Exception;
}
