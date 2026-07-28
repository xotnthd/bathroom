package com.community.bathroom.admin.product.service.impl;

import com.community.bathroom.admin.product.mapper.AdminProductMapper;
import com.community.bathroom.admin.product.service.AdminProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminProductServiceImpl implements AdminProductService {

    @Autowired
    private AdminProductMapper adminProductMapper;

    private BigDecimal toBigDecimal(Object val) {
        if (val == null) return BigDecimal.ZERO;
        return new BigDecimal(String.valueOf(val));
    }

    @Override
    public Map<String, Object> getProductList(String sysId, String searchKeyword, Long cteIdx, Integer pageNum, Integer pageSize) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("searchKeyword", searchKeyword);
        param.put("cteIdx", cteIdx);
        if (pageSize != null) {
            int safePageNum = (pageNum == null || pageNum < 1) ? 1 : pageNum;
            param.put("pageSize", pageSize);
            param.put("offset", (safePageNum - 1) * pageSize);
        }

        List<Map<String, Object>> list = adminProductMapper.selectProductList(param);
        int totalCount = adminProductMapper.selectProductCount(param);

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("totalCount", totalCount);
        return result;
    }

    @Override
    public Map<String, Object> getProduct(String sysId, Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("idx", idx);
        return adminProductMapper.selectProductByIdx(param);
    }

    @Override
    @Transactional
    public void saveProduct(Map<String, Object> param) {
        boolean isUpdate = param.get("idx") != null && !String.valueOf(param.get("idx")).isEmpty();
        if (isUpdate) {
            adminProductMapper.updateProduct(param);
        } else {
            int cnt = adminProductMapper.checkProductCdExists(param);
            if (cnt > 0) {
                throw new IllegalArgumentException("이미 등록된 제품 코드입니다.");
            }
            adminProductMapper.insertProduct(param);
        }
        Long prdIdx = ((Number) param.get("idx")).longValue();

        Map<String, Object> delParam = new HashMap<>();
        delParam.put("prdIdx", prdIdx);
        adminProductMapper.deleteProductOptGroups(delParam);
        @SuppressWarnings("unchecked")
        List<Object> optGrpIdxList = (List<Object>) param.get("optGrpIdxList");
        if (optGrpIdxList != null) {
            int sortOrd = 0;
            for (Object og : optGrpIdxList) {
                Map<String, Object> mapParam = new HashMap<>();
                mapParam.put("prdIdx", prdIdx);
                mapParam.put("optGrpIdx", ((Number) og).longValue());
                mapParam.put("sortOrd", sortOrd++);
                adminProductMapper.insertProductOptGroup(mapParam);
            }
        }
    }

    @Override
    @Transactional
    public void deleteProduct(String sysId, Long idx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("idx", idx);
        adminProductMapper.logicalDeleteProduct(param);
    }

    @Override
    public List<Map<String, Object>> getProductOptGroups(Long prdIdx) {
        Map<String, Object> param = new HashMap<>();
        param.put("prdIdx", prdIdx);
        return adminProductMapper.selectProductOptGroups(param);
    }

    @Override
    public List<Map<String, Object>> getSkuList(Long prdIdx) {
        Map<String, Object> param = new HashMap<>();
        param.put("prdIdx", prdIdx);
        List<Map<String, Object>> skus = adminProductMapper.selectSkuList(param);
        if (skus.isEmpty()) return skus;

        List<Object> skuIdxList = skus.stream().map(s -> s.get("idx")).collect(java.util.stream.Collectors.toList());
        Map<String, Object> optParam = new HashMap<>();
        optParam.put("skuIdxList", skuIdxList);
        List<Map<String, Object>> optRows = adminProductMapper.selectSkuOptValueNames(optParam);

        Map<Object, List<String>> labelsBySku = new HashMap<>();
        for (Map<String, Object> row : optRows) {
            labelsBySku.computeIfAbsent(row.get("skuIdx"), k -> new java.util.ArrayList<>())
                    .add(row.get("optGrpNm") + ":" + row.get("optValNm"));
        }
        for (Map<String, Object> sku : skus) {
            List<String> labels = labelsBySku.get(sku.get("idx"));
            sku.put("optLabel", labels != null ? String.join(", ", labels) : "옵션 없음");
        }
        return skus;
    }

    @Override
    @Transactional
    public void saveSkuList(Long prdIdx, List<Map<String, Object>> skus, String userId) {
        for (Map<String, Object> sku : skus) {
            BigDecimal price = toBigDecimal(sku.get("price"));
            BigDecimal discountRate = toBigDecimal(sku.get("discountRate"));
            BigDecimal discountPrice = price
                    .multiply(BigDecimal.ONE.subtract(discountRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)))
                    .setScale(2, RoundingMode.HALF_UP);

            sku.put("prdIdx", prdIdx);
            sku.put("price", price);
            sku.put("discountRate", discountRate);
            sku.put("discountPrice", discountPrice);
            sku.put("userId", userId);
            if (sku.get("useYn") == null) sku.put("useYn", "Y");

            boolean isUpdate = sku.get("idx") != null && !String.valueOf(sku.get("idx")).isEmpty();
            if (isUpdate) {
                adminProductMapper.updateSku(sku);
            } else {
                int cnt = adminProductMapper.checkSkuCdExists(sku);
                if (cnt > 0) {
                    throw new IllegalArgumentException("이미 존재하는 SKU 코드입니다: " + sku.get("skuCd"));
                }
                adminProductMapper.insertSku(sku);
            }
            Long skuIdx = ((Number) sku.get("idx")).longValue();

            Map<String, Object> delParam = new HashMap<>();
            delParam.put("skuIdx", skuIdx);
            adminProductMapper.deleteSkuOptMap(delParam);

            @SuppressWarnings("unchecked")
            List<Object> optValIdxList = (List<Object>) sku.get("optValIdxList");
            if (optValIdxList != null) {
                for (Object ov : optValIdxList) {
                    Map<String, Object> mapParam = new HashMap<>();
                    mapParam.put("skuIdx", skuIdx);
                    mapParam.put("optValIdx", ((Number) ov).longValue());
                    adminProductMapper.insertSkuOptMap(mapParam);
                }
            }
        }
    }

    @Override
    public List<Map<String, Object>> getStockByProduct(String sysId, Long prdIdx) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("prdIdx", prdIdx);
        return adminProductMapper.selectStockByProduct(param);
    }

    @Override
    public List<Map<String, Object>> getStockSummaryByProduct(Long prdIdx) {
        Map<String, Object> param = new HashMap<>();
        param.put("prdIdx", prdIdx);
        return adminProductMapper.selectStockSummaryByProduct(param);
    }

    @Override
    @Transactional
    public void processStockMove(Map<String, Object> param) {
        String moveType = (String) param.get("moveTypeCd");
        int rawQty = ((Number) param.get("qty")).intValue();
        int signedQty;
        if ("OUT".equals(moveType)) {
            signedQty = -Math.abs(rawQty);
        } else if ("IN".equals(moveType) || "RETURN".equals(moveType)) {
            signedQty = Math.abs(rawQty);
        } else {
            // ADJUST: 증감 둘 다 가능하므로 클라이언트가 보낸 부호를 그대로 사용
            signedQty = rawQty;
        }
        param.put("qty", signedQty);

        // 매입처/매입단가는 입고(IN)일 때만 의미가 있음 - 그 외엔 서버에서 무조건 무시
        if (!"IN".equals(moveType)) {
            param.put("supIdx", null);
            param.put("unitCost", null);
        }

        adminProductMapper.insertStockHistory(param);
        adminProductMapper.upsertStockMaster(param);
    }

    @Override
    public List<Map<String, Object>> getStockHistory(Long prdIdx) {
        Map<String, Object> param = new HashMap<>();
        param.put("prdIdx", prdIdx);
        return adminProductMapper.selectStockHistory(param);
    }
}
