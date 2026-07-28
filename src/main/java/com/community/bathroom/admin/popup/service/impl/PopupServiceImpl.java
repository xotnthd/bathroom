package com.community.bathroom.admin.popup.service.impl;

import com.community.bathroom.admin.popup.mapper.PopupMapper;
import com.community.bathroom.admin.popup.service.PopupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PopupServiceImpl implements PopupService {

    @Autowired
    private PopupMapper popupMapper;

    @Override
    public List<Map<String, Object>> getPopupList(Map<String, Object> param) {
        return popupMapper.selectPopupList(param);
    }

    @Override
    public Map<String, Object> getPopup(String sysId, Long popIdx) {
        Map<String, Object> param = new java.util.HashMap<>();
        param.put("sysId", sysId);
        param.put("popIdx", popIdx);
        return popupMapper.selectPopupByIdx(param);
    }

    @Override
    public List<Map<String, Object>> getActivePopups(String sysId, String sysSeCd) {
        return popupMapper.selectActivePopups(sysId, sysSeCd);
    }

    @Override
    public void savePopup(Map<String, Object> param) {
        // Check if new or update
        Object popIdxObj = param.get("popIdx");
        if (popIdxObj == null || String.valueOf(popIdxObj).trim().isEmpty()) {
            popupMapper.insertPopup(param);
        } else {
            popupMapper.updatePopup(param);
        }
    }

    @Override
    public void deletePopup(Long popIdx) {
        popupMapper.deletePopup(popIdx);
    }
}