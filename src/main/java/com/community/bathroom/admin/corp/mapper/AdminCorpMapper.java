package com.community.bathroom.admin.corp.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface AdminCorpMapper {

    Map<String, Object> selectCorpDetail(@Param("sysId") String sysId);

    void upsertCorpDetail(Map<String, Object> param);
}
