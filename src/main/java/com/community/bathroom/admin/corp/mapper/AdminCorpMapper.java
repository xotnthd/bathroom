package com.community.bathroom.admin.corp.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminCorpMapper {

    List<Map<String, Object>> selectCorpList(Map<String, Object> param);

    Map<String, Object> selectCorpDetail(@Param("idx") Long idx);

    void insertCorp(Map<String, Object> param);

    void updateCorp(Map<String, Object> param);

    void logicalDeleteCorp(@Param("idx") Long idx);
}
