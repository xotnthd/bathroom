package com.community.bathroom.admin.board.service.impl;

import com.community.bathroom.admin.board.mapper.AdminDynamicBoardMapper;
import com.community.bathroom.admin.board.service.AdminDynamicBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminDynamicBoardServiceImpl implements AdminDynamicBoardService {

    @Autowired
    private AdminDynamicBoardMapper adminDynamicBoardMapper;

    @Override
    public Map<String, Object> getDynamicBoardList(Map<String, Object> param) {
        int page = param.containsKey("page") ? Integer.parseInt(param.get("page").toString()) : 1;
        int pageSize = param.containsKey("pageSize") ? Integer.parseInt(param.get("pageSize").toString()) : 20;
        int offset = (page - 1) * pageSize;

        param.put("limit", pageSize);
        param.put("offset", offset);

        List<Map<String, Object>> list = adminDynamicBoardMapper.selectDynamicBoardList(param);
        int totalCount = adminDynamicBoardMapper.selectDynamicBoardCount(param);

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("totalCount", totalCount);
        result.put("page", page);
        result.put("pageSize", pageSize);
        
        return result;
    }

    @Override
    public Map<String, Object> getDynamicBoardDetail(Map<String, Object> param) {
        Map<String, Object> detail = adminDynamicBoardMapper.selectDynamicBoardDetail(param);
        
        // 관리자는 조회수 증가를 안할수도 있지만 일단 동일하게 처리하거나 스킵가능.
        
        Map<String, Object> result = new HashMap<>();
        result.put("detail", detail);
        return result;
    }

    @Override
    public Map<String, Object> getBoardMasterInfo(String sysId, String brdId) {
        return adminDynamicBoardMapper.selectBoardMasterInfo(sysId, brdId);
    }
}
