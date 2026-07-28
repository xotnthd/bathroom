package com.community.bathroom.admin.product.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminProductMapper {
    List<Map<String, Object>> selectProductList(Map<String, Object> param);
    int selectProductCount(Map<String, Object> param);
    Map<String, Object> selectProductByIdx(Map<String, Object> param);
    int checkProductCdExists(Map<String, Object> param);
    void insertProduct(Map<String, Object> param);
    void updateProduct(Map<String, Object> param);
    void logicalDeleteProduct(Map<String, Object> param);

    List<Map<String, Object>> selectProductOptGroups(Map<String, Object> param);
    void deleteProductOptGroups(Map<String, Object> param);
    void insertProductOptGroup(Map<String, Object> param);

    List<Map<String, Object>> selectSkuList(Map<String, Object> param);
    List<Map<String, Object>> selectSkuOptValueNames(Map<String, Object> param);
    int checkSkuCdExists(Map<String, Object> param);
    void insertSku(Map<String, Object> param);
    void updateSku(Map<String, Object> param);
    void deleteSkuOptMap(Map<String, Object> param);
    void insertSkuOptMap(Map<String, Object> param);

    List<Map<String, Object>> selectStockByProduct(Map<String, Object> param);
    List<Map<String, Object>> selectStockSummaryByProduct(Map<String, Object> param);
    void upsertStockMaster(Map<String, Object> param);
    void insertStockHistory(Map<String, Object> param);
    List<Map<String, Object>> selectStockHistory(Map<String, Object> param);
}
