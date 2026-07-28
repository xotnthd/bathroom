package com.community.bathroom.admin.prdloc.service.impl;

import com.community.bathroom.admin.prdloc.mapper.AdminPrdLocMapper;
import com.community.bathroom.admin.prdloc.service.AdminPrdLocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminPrdLocServiceImpl implements AdminPrdLocService {

    @Autowired
    private AdminPrdLocMapper adminPrdLocMapper;

    @Override
    public List<Map<String, Object>> getLocationList(String sysId) {
        return adminPrdLocMapper.selectLocationList(sysId);
    }

    @Override
    public Map<String, Object> getLocation(String sysId, Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("idx", idx);
        return adminPrdLocMapper.selectLocationByIdx(param);
    }

    @Override
    @Transactional
    public void saveLocation(Map<String, Object> param) {
        if (param.get("idx") != null && !String.valueOf(param.get("idx")).isEmpty()) {
            adminPrdLocMapper.updateLocation(param);
        } else {
            adminPrdLocMapper.insertLocation(param);
        }
    }

    @Override
    @Transactional
    public void deleteLocation(String sysId, Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("idx", idx);
        adminPrdLocMapper.logicalDeleteLocation(param);
    }
}
