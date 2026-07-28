package com.community.bathroom.admin.prdcte.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminPrdCteMapper {
    List<Map<String, Object>> selectChildList(Map<String, Object> param);
    void insertCategory(Map<String, Object> param);
    void updateCategory(Map<String, Object> param);
    void logicalDeleteCategory(Map<String, Object> param);
    void logicalDeleteChildCategories(Map<String, Object> param);
    void updateSortOrder(Map<String, Object> param);
    List<Map<String, Object>> selectLeafCategoryList(Map<String, Object> param);
}
