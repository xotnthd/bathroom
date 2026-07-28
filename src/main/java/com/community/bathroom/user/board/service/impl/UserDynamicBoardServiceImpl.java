package com.community.bathroom.user.board.service.impl;

import com.community.bathroom.user.board.mapper.UserDynamicBoardMapper;
import com.community.bathroom.user.board.service.UserDynamicBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserDynamicBoardServiceImpl implements UserDynamicBoardService {

    @Autowired
    private UserDynamicBoardMapper userDynamicBoardMapper;

    @Override
    public Map<String, Object> getDynamicBoardList(Map<String, Object> param) {
        int page = param.containsKey("page") ? Integer.parseInt(param.get("page").toString()) : 1;
        int pageSize = param.containsKey("pageSize") ? Integer.parseInt(param.get("pageSize").toString()) : 20;
        int offset = (page - 1) * pageSize;

        param.put("limit", pageSize);
        param.put("offset", offset);

        List<Map<String, Object>> list = userDynamicBoardMapper.selectDynamicBoardList(param);
        int totalCount = userDynamicBoardMapper.selectDynamicBoardCount(param);

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("totalCount", totalCount);
        result.put("page", page);
        result.put("pageSize", pageSize);
        
        return result;
    }

    @Override
    public Map<String, Object> getDynamicBoardDetail(Map<String, Object> param) {
        Map<String, Object> detail = userDynamicBoardMapper.selectDynamicBoardDetail(param);
        
        if (detail != null) {
            userDynamicBoardMapper.updateBoardViewCount(param);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("detail", detail);
        return result;
    }

    @Override
    public Map<String, Object> getBoardMasterInfo(String sysId, String brdId) {
        return userDynamicBoardMapper.selectBoardMasterInfo(sysId, brdId);
    }
}
