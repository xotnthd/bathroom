package com.community.bathroom.comn.comment.service.impl;

import com.community.bathroom.comn.comment.mapper.CommonCommentMapper;
import com.community.bathroom.comn.comment.service.CommonCommentService;
import com.community.bathroom.comn.file.service.CommonFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class CommonCommentServiceImpl implements CommonCommentService {

    @Autowired
    private CommonCommentMapper commonCommentMapper;

    @Autowired
    private CommonFileService commonFileService;

    @Override
    public List<Map<String, Object>> getCommentList(Map<String, Object> param) {
        return commonCommentMapper.selectCommentList(param);
    }

    @Override
    @Transactional
    public void saveComment(Map<String, Object> param, MultipartFile[] files) {
        String sysId = (String) param.get("sysId");
        String userId = (String) param.get("userId");
        if (userId == null || userId.trim().isEmpty()) {
            userId = "system"; // 임시 기본값
            param.put("userId", userId);
        }
        String atchFileGrpId = (String) param.get("atchFileGrpId");

        if (files != null && files.length > 0) {
            String newGrpId = commonFileService.uploadFiles(files, sysId, atchFileGrpId, "COMMENT", userId);
            param.put("atchFileGrpId", newGrpId);
        }

        if (param.get("cmtIdx") != null && !String.valueOf(param.get("cmtIdx")).trim().isEmpty()) {
            commonCommentMapper.updateComment(param);
        } else {
            // 새 댓글
            param.put("wrtrIdx", 1L); // TODO: fetch actual user
            param.put("wrtrNm", userId != null && !userId.equals("system") ? userId : "사용자");

            // cmtDepth 와 cmtGrpIdx 결정
            Object parentIdxObj = param.get("parentCmtIdx");
            if (parentIdxObj != null && !String.valueOf(parentIdxObj).trim().isEmpty()) {
                Long parentIdx = Long.valueOf(String.valueOf(parentIdxObj));
                Map<String, Object> parent = commonCommentMapper.selectCommentById(parentIdx);
                if (parent != null) {
                    param.put("cmtGrpIdx", parent.get("cmtGrpIdx"));
                    int pDepth = Integer.parseInt(String.valueOf(parent.get("cmtDepth")));
                    param.put("cmtDepth", pDepth + 1);
                    param.put("sortOrd", System.currentTimeMillis() % 1000000); // 간단한 정렬 처리
                }
            } else {
                param.put("cmtDepth", 0);
                param.put("sortOrd", 0);
            }

            commonCommentMapper.insertComment(param);
            
            // 만약 cmtGrpIdx 가 0이면 방금 생성된 cmtIdx로 업데이트 (자신이 그룹의 루트)
            if (param.get("cmtGrpIdx") == null || "0".equals(String.valueOf(param.get("cmtGrpIdx")))) {
                param.put("cmtGrpIdx", param.get("cmtIdx"));
                commonCommentMapper.updateComment(param);
            }
        }
    }

    @Override
    @Transactional
    public void deleteComment(Long cmtIdx) {
        commonCommentMapper.logicalDeleteComment(cmtIdx);
    }
}
