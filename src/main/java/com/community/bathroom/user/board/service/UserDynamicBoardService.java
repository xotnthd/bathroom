package com.community.bathroom.user.board.service;

import java.util.Map;

public interface UserDynamicBoardService {
    Map<String, Object> getDynamicBoardList(Map<String, Object> param);
    Map<String, Object> getDynamicBoardDetail(Map<String, Object> param);
    Map<String, Object> getBoardMasterInfo(String sysId, String brdId);
}
