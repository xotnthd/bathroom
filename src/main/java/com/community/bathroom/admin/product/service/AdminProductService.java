package com.community.bathroom.admin.product.service;

import java.util.List;
import java.util.Map;

public interface AdminProductService {
    Map<String, Object> getProductList(String sysId, String searchKeyword, Long cteIdx, Integer pageNum, Integer pageSize);
    Map<String, Object> getProduct(String sysId, Long idx);
    void saveProduct(Map<String, Object> param);
    void deleteProduct(String sysId, Long idx);

    List<Map<String, Object>> getProductOptGroups(Long prdIdx);
    List<Map<String, Object>> getSkuList(Long prdIdx);
    void saveSkuList(Long prdIdx, List<Map<String, Object>> skus, String userId);

    List<Map<String, Object>> getStockByProduct(String sysId, Long prdIdx);
    List<Map<String, Object>> getStockSummaryByProduct(Long prdIdx);
    void processStockMove(Map<String, Object> param);
    List<Map<String, Object>> getStockHistory(Long prdIdx);
}
