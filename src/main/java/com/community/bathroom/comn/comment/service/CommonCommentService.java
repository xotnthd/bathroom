package com.community.bathroom.comn.comment.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

public interface CommonCommentService {
    List<Map<String, Object>> getCommentList(Map<String, Object> param);
    void saveComment(Map<String, Object> param, MultipartFile[] files);
    void deleteComment(Long cmtIdx);
}
