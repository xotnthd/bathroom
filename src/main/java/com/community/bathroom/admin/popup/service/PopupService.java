package com.community.bathroom.admin.popup.service;

import java.util.List;
import java.util.Map;

public interface PopupService {
    List<Map<String, Object>> getPopupList(Map<String, Object> param);
    Map<String, Object> getPopup(String sysId, Long popIdx);
    List<Map<String, Object>> getActivePopups(String sysId, String sysSeCd);
    void savePopup(Map<String, Object> param);
    void deletePopup(Long popIdx);
}