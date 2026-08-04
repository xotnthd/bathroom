package com.community.bathroom.comn.file.service;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CommonFileService {
    String uploadFiles(MultipartFile[] files, String sysId, String fileGrpId, String moduleName, String userId);
    List<Map<String, Object>> getFileList(String sysId, String fileGrpId);
    /** @return 실제로 파일을 응답에 써서 내려줬으면 true, DB 레코드가 없거나 물리 파일이 없으면 false */
    boolean downloadFile(Long fileSn, HttpServletResponse response);
    void deleteFile(Long fileSn);
}