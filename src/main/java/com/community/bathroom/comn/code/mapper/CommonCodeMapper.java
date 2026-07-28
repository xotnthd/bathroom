package com.community.bathroom.comn.code.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommonCodeMapper {
    List<Map<String, Object>> selectCommonCodeList(@Param("sysId") String sysId, @Param("grpCd") String grpCd, @Param("uprComCd") String uprComCd);
}