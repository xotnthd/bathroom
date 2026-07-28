package com.community.bathroom.admin.pay.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminPayMapper {

    // --- 요금제 마스터 ---
    List<Map<String, Object>> selectPayList();
    int checkPayExists(Map<String, Object> param);
    void insertPay(Map<String, Object> param);
    void updatePay(Map<String, Object> param);
    Map<String, Object> selectPayByCd(@Param("payPlanCd") String payPlanCd);
    Map<String, Object> selectPayDetailByCd(@Param("payPlanCd") String payPlanCd);
    void deletePayRow(@Param("payPlanCd") String payPlanCd);

    // 신규 시스템 생성 시 - 선택된 요금제가 가리키는 권한 템플릿 코드 조회
    Map<String, Object> selectPayForProvision(@Param("payIdx") Long payIdx);

    // --- 업체별 요금제 적용 이력 ---
    List<Map<String, Object>> selectPayHistory(@Param("sysId") String sysId);
    int checkPayHistoryExists(@Param("payIdx") Long payIdx);
    void closeActivePayHistory(@Param("sysId") String sysId);
    void insertPayHistory(Map<String, Object> param);
    void updateSystemCurrentPay(@Param("sysId") String sysId, @Param("payIdx") Long payIdx);
}
