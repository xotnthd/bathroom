package com.community.bathroom.admin.corp.service.impl;

import com.community.bathroom.admin.corp.mapper.AdminCorpMapper;
import com.community.bathroom.admin.corp.service.AdminCorpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminCorpServiceImpl implements AdminCorpService {

    @Autowired
    private AdminCorpMapper adminCorpMapper;

    @Override
    public List<Map<String, Object>> getCorpList(Map<String, Object> param) {
        return adminCorpMapper.selectCorpList(param);
    }

    @Override
    public Map<String, Object> getCorpDetail(Long idx) {
        Map<String, Object> detail = adminCorpMapper.selectCorpDetail(idx);
        return detail != null ? detail : new HashMap<>();
    }

    @Override
    @Transactional
    public void saveCorp(Map<String, Object> param) {
        Object idx = param.get("idx");
        if (idx == null || String.valueOf(idx).isEmpty()) {
            adminCorpMapper.insertCorp(param);
        } else {
            adminCorpMapper.updateCorp(param);
        }
    }

    @Override
    public void deleteCorp(Long idx) {
        adminCorpMapper.logicalDeleteCorp(idx);
    }
}
