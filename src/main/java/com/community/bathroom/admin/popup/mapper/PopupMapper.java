package com.community.bathroom.admin.popup.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PopupMapper {
    List<Map<String, Object>> selectPopupList(Map<String, Object> param);
    Map<String, Object> selectPopupByIdx(Map<String, Object> param);
    List<Map<String, Object>> selectActivePopups(@Param("sysId") String sysId, @Param("sysSeCd") String sysSeCd);
    void insertPopup(Map<String, Object> param);
    void updatePopup(Map<String, Object> param);
    void deletePopup(Long popIdx);
}