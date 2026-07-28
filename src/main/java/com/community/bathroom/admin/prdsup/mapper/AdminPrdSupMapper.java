package com.community.bathroom.admin.prdsup.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminPrdSupMapper {
    List<Map<String, Object>> selectSupplierList(String sysId);
    Map<String, Object> selectSupplierByIdx(Map<String, Object> param);
    void insertSupplier(Map<String, Object> param);
    void updateSupplier(Map<String, Object> param);
    void logicalDeleteSupplier(Map<String, Object> param);
}
