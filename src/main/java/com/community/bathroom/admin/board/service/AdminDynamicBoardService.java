package com.community.bathroom.admin.board.service;

import java.util.Map;

public interface AdminDynamicBoardService {
    Map<String, Object> getDynamicBoardList(Map<String, Object> param);
    Map<String, Object> getDynamicBoardDetail(Map<String, Object> param);
    Map<String, Object> getBoardMasterInfo(String sysId, String brdId);
}
