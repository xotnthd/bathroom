package com.community.bathroom.admin.prdcte.service.impl;

import com.community.bathroom.admin.prdcte.mapper.AdminPrdCteMapper;
import com.community.bathroom.admin.prdcte.service.AdminPrdCteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminPrdCteServiceImpl implements AdminPrdCteService {

    @Autowired
    private AdminPrdCteMapper adminPrdCteMapper;

    @Override
    public List<Map<String, Object>> getChildList(String sysId, Long uprCteIdx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("uprCteIdx", uprCteIdx);
        return adminPrdCteMapper.selectChildList(param);
    }

    @Override
    @Transactional
    public void saveCategory(Map<String, Object> param) {
        if (param.get("idx") != null && !String.valueOf(param.get("idx")).isEmpty()) {
            adminPrdCteMapper.updateCategory(param);
        } else {
            adminPrdCteMapper.insertCategory(param);
        }
    }

    @Override
    @Transactional
    public void deleteCategory(String sysId, Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("idx", idx);
        adminPrdCteMapper.logicalDeleteChildCategories(param);
        adminPrdCteMapper.logicalDeleteCategory(param);
    }

    @Override
    @Transactional
    public void saveSortOrder(String sysId, List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            Map<String, Object> param = new HashMap<>();
            param.put("sysId", sysId);
            param.put("idx", ((Number) item.get("idx")).longValue());
            param.put("sortOrd", ((Number) item.get("sortOrd")).intValue());
            adminPrdCteMapper.updateSortOrder(param);
        }
    }

    @Override
    public List<Map<String, Object>> getLeafCategoryList(String sysId) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        return adminPrdCteMapper.selectLeafCategoryList(param);
    }
}
