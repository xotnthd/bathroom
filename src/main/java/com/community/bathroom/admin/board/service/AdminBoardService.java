package com.community.bathroom.admin.board.service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

public interface AdminBoardService {
    List<Map<String, Object>> getBoardManagingList(Map<String, Object> searchParam);
    Map<String, Object> getBoardManagingDetail(String sysId, String brdId);
    List<Map<String, Object>> getCommonCodeList(String sysId, String grpCd, String uprComCd);
    void saveBoardManaging(Map<String, Object> param);
    void deleteBoardManaging(String sysId, String brdId);

    List<Map<String, Object>> getMonitorPostList(String sysId, String brdId);
    List<Map<String, Object>> getCommonFileList(String sysId, String fileGrpId);
    void saveBoardPostWithFiles(Map<String, Object> param, MultipartFile[] files);
    void deleteBoardPost(Long idx);
    void deleteBoardPostBulk(List<Long> ids);
    void restoreBoardPost(Long idx);
    void restoreBoardPostBulk(List<Long> ids);
}