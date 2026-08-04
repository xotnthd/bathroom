package com.community.bathroom.comn.file.controller;


import com.community.bathroom.comn.file.service.CommonFileService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/comn/file")
public class CommonFileController {

    @Autowired
    private CommonFileService commonFileService;

    // 1. 파일 목록 조회
    @GetMapping("/list/{fileGrpId}")
    public ResponseEntity<List<Map<String, Object>>> getFileList(
            @RequestParam(defaultValue = "CORE") String sysId,
            @PathVariable String fileGrpId) {
        return ResponseEntity.ok(commonFileService.getFileList(sysId, fileGrpId));
    }

    // 2. 파일 다운로드 (0kb 버그 완벽 해결)
    @GetMapping("/download/{fileSn}")
    public void downloadFile(@PathVariable Long fileSn, HttpServletResponse response) throws java.io.IOException {
        if (!commonFileService.downloadFile(fileSn, response)) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "파일을 찾을 수 없습니다.");
        }
    }

    // 3. 파일 논리 삭제
    @DeleteMapping("/delete/{fileSn}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileSn) {
        commonFileService.deleteFile(fileSn);
        return ResponseEntity.ok().build();
    }
}