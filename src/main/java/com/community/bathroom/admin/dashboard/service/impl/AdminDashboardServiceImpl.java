package com.community.bathroom.admin.dashboard.service.impl;

import com.community.bathroom.admin.dashboard.mapper.AdminDashboardMapper;
import com.community.bathroom.admin.dashboard.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Autowired
    private AdminDashboardMapper adminDashboardMapper;

    @Override
    public Map<String, Object> getDashboardSummary(String sysId) {
        Map<String, Object> result = new HashMap<>();
        result.put("stats", adminDashboardMapper.selectDashboardStats(sysId));
        result.put("activeVotes", adminDashboardMapper.selectActiveVotes(sysId));
        result.put("activeSurveys", adminDashboardMapper.selectActiveSurveys(sysId));
        result.put("recentLogs", adminDashboardMapper.selectRecentLogs(sysId));
        return result;
    }
}
