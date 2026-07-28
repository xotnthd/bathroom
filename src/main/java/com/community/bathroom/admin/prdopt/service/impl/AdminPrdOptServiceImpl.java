package com.community.bathroom.admin.prdopt.service.impl;

import com.community.bathroom.admin.prdopt.mapper.AdminPrdOptMapper;
import com.community.bathroom.admin.prdopt.service.AdminPrdOptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminPrdOptServiceImpl implements AdminPrdOptService {

    @Autowired
    private AdminPrdOptMapper adminPrdOptMapper;

    @Override
    public List<Map<String, Object>> getGroupList(String sysId) {
        return adminPrdOptMapper.selectGroupList(sysId);
    }

    @Override
    @Transactional
    public void saveGroup(Map<String, Object> param) {
        if (param.get("idx") != null && !String.valueOf(param.get("idx")).isEmpty()) {
            adminPrdOptMapper.updateGroup(param);
        } else {
            adminPrdOptMapper.insertGroup(param);
        }
    }

    @Override
    @Transactional
    public void deleteGroup(String sysId, Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("idx", idx);
        adminPrdOptMapper.logicalDeleteGroup(param);
    }

    @Override
    public List<Map<String, Object>> getValueList(Long optGrpIdx) {
        Map<String, Object> param = new HashMap<>();
        param.put("optGrpIdx", optGrpIdx);
        return adminPrdOptMapper.selectValueList(param);
    }

    @Override
    @Transactional
    public void saveValue(Map<String, Object> param) {
        if (param.get("idx") != null && !String.valueOf(param.get("idx")).isEmpty()) {
            adminPrdOptMapper.updateValue(param);
        } else {
            adminPrdOptMapper.insertValue(param);
        }
    }

    @Override
    @Transactional
    public void deleteValue(Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("idx", idx);
        adminPrdOptMapper.deleteValue(param);
    }
}
