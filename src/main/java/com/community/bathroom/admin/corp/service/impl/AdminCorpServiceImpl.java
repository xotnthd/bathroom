package com.community.bathroom.admin.corp.service.impl;

import com.community.bathroom.admin.corp.mapper.AdminCorpMapper;
import com.community.bathroom.admin.corp.service.AdminCorpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminCorpServiceImpl implements AdminCorpService {

    @Autowired
    private AdminCorpMapper adminCorpMapper;

    @Override
    public Map<String, Object> getCorpDetail(String sysId) {
        Map<String, Object> detail = adminCorpMapper.selectCorpDetail(sysId);
        return detail != null ? detail : new HashMap<>();
    }

    @Override
    public void saveCorpDetail(Map<String, Object> param) {
        adminCorpMapper.upsertCorpDetail(param);
    }
}
