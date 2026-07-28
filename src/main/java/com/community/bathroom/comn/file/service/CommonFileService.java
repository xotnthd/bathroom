package com.community.bathroom.comn.file.service;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CommonFileService {
    String uploadFiles(MultipartFile[] files, String sysId, String fileGrpId, String moduleName, String userId);
    List<Map<String, Object>> getFileList(String sysId, String fileGrpId);
    void downloadFile(Long fileSn, HttpServletResponse response);
    void deleteFile(Long fileSn);
}