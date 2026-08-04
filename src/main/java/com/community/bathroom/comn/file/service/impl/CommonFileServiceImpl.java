package com.community.bathroom.comn.file.service.impl;

import com.community.bathroom.comn.file.mapper.CommonFileMapper;
import com.community.bathroom.comn.file.service.CommonFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class CommonFileServiceImpl implements CommonFileService {

    @Autowired
    private CommonFileMapper commonFileMapper;

    @Value("${app.file.upload-dir}")
    private String uploadRootPath; // YAML에서 읽어옴

    // 이미지 전용 필드(로고/배너/프로필 사진 등) - 문서/압축파일 등이 잘못 올라가는 것을 막는다.
    // 게시판/팝업/댓글 첨부파일처럼 임의 파일 첨부가 정상 용도인 모듈은 여기 포함하지 않는다.
    private static final Set<String> IMAGE_ONLY_MODULES = Set.of("SYS_LOGO", "SYS_BANNER", "USER");
    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp", "bmp");

    @Override
    @Transactional
    public String uploadFiles(MultipartFile[] files, String sysId, String fileGrpId, String moduleName, String userId) {
        if (files == null || files.length == 0) return fileGrpId;

        // 1. 그룹 ID가 없으면 발급
        if (fileGrpId == null || fileGrpId.trim().isEmpty()) {
            fileGrpId = UUID.randomUUID().toString();
        }

        // 2. 동적 경로 생성 로직 (예: /BOARD/2026/07/11)
        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String relativeDirPath = moduleName + "/" + datePath;
        String absoluteDirPath = uploadRootPath + "/" + relativeDirPath;

        File dir = new File(absoluteDirPath);
        if (!dir.exists()) {
            dir.mkdirs(); // 하위 폴더 자동 생성
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String originalName = file.getOriginalFilename();
            String extension = originalName.substring(originalName.lastIndexOf(".") + 1);

            if (IMAGE_ONLY_MODULES.contains(moduleName)) {
                boolean extOk = ALLOWED_IMAGE_EXTENSIONS.contains(extension.toLowerCase());
                boolean contentTypeOk = file.getContentType() != null && file.getContentType().startsWith("image/");
                if (!extOk || !contentTypeOk) {
                    throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다. (jpg, png, gif, webp, bmp)");
                }
            }

            String savedFileName = UUID.randomUUID().toString() + "." + extension; // 확장자 포함 저장

            // 3. 물리적 파일 저장 (0kb 원인 해결: 확장자 포함하여 저장)
            try {
                file.transferTo(new File(absoluteDirPath, savedFileName));
            } catch (Exception e) {
                throw new RuntimeException("파일 저장 중 오류 발생", e);
            }

            // 4. DB 정보 맵핑
            Map<String, Object> fileParam = new HashMap<>();
            fileParam.put("sysId", sysId);
            fileParam.put("fileGrpId", fileGrpId);
            fileParam.put("fileOrgnlNm", originalName);
            fileParam.put("fileStreNm", savedFileName);
            fileParam.put("filePath", relativeDirPath + "/" + savedFileName); // 상대경로 보관
            fileParam.put("fileSize", file.getSize());
            fileParam.put("fileExtsn", extension);
            fileParam.put("userId", userId);

            commonFileMapper.insertCommonFile(fileParam);
        }
        return fileGrpId;
    }

    @Override
    public List<Map<String, Object>> getFileList(String sysId, String fileGrpId) {
        return commonFileMapper.selectCommonFileList(sysId, fileGrpId);
    }

    @Override
    public boolean downloadFile(Long fileSn, HttpServletResponse response) {
        Map<String, Object> fileInfo = commonFileMapper.selectFileBySn(fileSn);
        if (fileInfo == null) return false;

        // DB에 저장된 상대경로와 루트경로 조합
        File file = new File(uploadRootPath + "/" + fileInfo.get("filePath"));
        if (!file.exists()) {
            // DB 레코드는 있지만 물리 파일이 없는 경우 (서버 이전/복원 시 파일 미이관 등) - 500으로 터뜨리지 않고
            // "없음"으로 취급해 컨트롤러가 404를 내려주게 한다. 이미지 태그는 자연스럽게 깨진 아이콘으로 표시됨.
            return false;
        }

        try {
            String originalName = (String) fileInfo.get("fileOrgnlNm");
            String encodedName = java.net.URLEncoder.encode(originalName, "UTF-8").replaceAll("\\+", "%20");

            response.reset();
            response.setContentType("application/octet-stream; charset=UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedName + "\"");
            response.setHeader("Content-Length", String.valueOf(file.length()));

            try (java.io.FileInputStream fis = new java.io.FileInputStream(file);
                 java.io.OutputStream os = response.getOutputStream()) {
                org.springframework.util.FileCopyUtils.copy(fis, os);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public void deleteFile(Long fileSn) {
        commonFileMapper.logicalDeleteFile(fileSn);
    }
}