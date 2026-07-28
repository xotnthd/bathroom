package com.community.bathroom.admin.prdsup.service.impl;

import com.community.bathroom.admin.prdsup.mapper.AdminPrdSupMapper;
import com.community.bathroom.admin.prdsup.service.AdminPrdSupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminPrdSupServiceImpl implements AdminPrdSupService {

    @Autowired
    private AdminPrdSupMapper adminPrdSupMapper;

    @Override
    public List<Map<String, Object>> getSupplierList(String sysId) {
        return adminPrdSupMapper.selectSupplierList(sysId);
    }

    @Override
    public Map<String, Object> getSupplier(String sysId, Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("idx", idx);
        return adminPrdSupMapper.selectSupplierByIdx(param);
    }

    @Override
    @Transactional
    public void saveSupplier(Map<String, Object> param) {
        if (param.get("idx") != null && !String.valueOf(param.get("idx")).isEmpty()) {
            adminPrdSupMapper.updateSupplier(param);
        } else {
            adminPrdSupMapper.insertSupplier(param);
        }
    }

    @Override
    @Transactional
    public void deleteSupplier(String sysId, Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("idx", idx);
        adminPrdSupMapper.logicalDeleteSupplier(param);
    }
}
