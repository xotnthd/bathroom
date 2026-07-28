package com.community.bathroom.admin.board.service.impl;

import com.community.bathroom.admin.board.mapper.AdminBoardMapper;
import com.community.bathroom.admin.board.service.AdminBoardService;
import com.community.bathroom.comn.file.service.CommonFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class AdminBoardServiceImpl implements AdminBoardService {

    @Autowired
    private AdminBoardMapper adminBoardMapper;

    @Autowired
    private CommonFileService commonFileService; // 공통 파일 서비스 주입

    @Override
    public List<Map<String, Object>> getBoardManagingList(Map<String, Object> searchParam) {
        return adminBoardMapper.selectBoardManagingList(searchParam);
    }

    @Override
    public Map<String, Object> getBoardManagingDetail(String sysId, String brdId) {
        Map<String, Object> param = new java.util.HashMap<>();
        param.put("sysId", sysId);
        param.put("brdId", brdId);
        return adminBoardMapper.selectBoardManagingDetail(param);
    }

    @Override
    public List<Map<String, Object>> getCommonCodeList(String sysId, String grpCd, String uprComCd) {
        return adminBoardMapper.selectCommonCodeList(sysId, grpCd, uprComCd);
    }

    @Override
    @Transactional
    public void saveBoardManaging(Map<String, Object> param) {
        int cnt = adminBoardMapper.checkBoardManagingExists(param);
        if (cnt > 0) {
            adminBoardMapper.updateBoardManaging(param);
            adminBoardMapper.updateBoardManagingConfig(param);
        } else {
            adminBoardMapper.insertBoardManaging(param);
            adminBoardMapper.insertBoardManagingConfig(param);
        }
    }

    @Override
    @Transactional
    public void deleteBoardManaging(String sysId, String brdId) {
        adminBoardMapper.deletePostsByBrdId(sysId, brdId);
        adminBoardMapper.deleteBoardManaging(sysId, brdId);
    }

    @Override
    public List<Map<String, Object>> getMonitorPostList(String sysId, String brdId) {
        return adminBoardMapper.selectMonitorPostList(sysId, brdId);
    }

    @Override
    public List<Map<String, Object>> getCommonFileList(String sysId, String fileGrpId) {
        return adminBoardMapper.selectCommonFileList(sysId, fileGrpId);
    }

    @Override
    @Transactional
    public void saveBoardPostWithFiles(Map<String, Object> param, MultipartFile[] files) {
        String sysId = (String) param.get("sysId");
        String userId = (String) param.get("userId");
        String atchFileGrpId = (String) param.get("atchFileGrpId");

        // [핵심] 공통 모듈 호출: BOARD 모듈명 지정하여 위임 (알아서 경로 생성 후 그룹ID 반환)
        String newGrpId = commonFileService.uploadFiles(files, sysId, atchFileGrpId, "BOARD", userId);
        param.put("atchFileGrpId", newGrpId);

        // 게시판 데이터 처리
        if (param.get("idx") != null && !String.valueOf(param.get("idx")).trim().isEmpty()) {
            adminBoardMapper.updateBoardPost(param);
        } else {
            param.put("wrtrIdx", 1L); // TODO: fetch actual user idx from DB if needed
            param.put("wrtrNm", userId != null && !userId.equals("system") ? userId : "최고관리자");
            adminBoardMapper.insertBoardPost(param);
        }
    }

    @Override
    @Transactional
    public void deleteBoardPost(Long idx) {
        adminBoardMapper.logicalDeleteBoardPost(idx);
    }

    @Override
    @Transactional
    public void deleteBoardPostBulk(List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            adminBoardMapper.updateBoardPostBulkDelete(ids);
        }
    }

    @Override
    @Transactional
    public void restoreBoardPost(Long idx) {
        adminBoardMapper.restoreBoardPost(idx);
    }

    @Override
    @Transactional
    public void restoreBoardPostBulk(List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            adminBoardMapper.updateBoardPostBulkRestore(ids);
        }
    }
}