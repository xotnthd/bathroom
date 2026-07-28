package com.community.bathroom.comn.file.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommonFileMapper {
    void insertCommonFile(Map<String, Object> fileParam);
    List<Map<String, Object>> selectCommonFileList(@Param("sysId") String sysId, @Param("fileGrpId") String fileGrpId);
    Map<String, Object> selectFileBySn(@Param("fileSn") Long fileSn);
    void logicalDeleteFile(@Param("fileSn") Long fileSn);
}