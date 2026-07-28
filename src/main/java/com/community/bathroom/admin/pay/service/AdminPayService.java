package com.community.bathroom.admin.pay.service;

import java.util.List;
import java.util.Map;

public interface AdminPayService {
    List<Map<String, Object>> getPayList();
    Map<String, Object> getPay(String payPlanCd);
    void savePay(Map<String, Object> param);
    void deletePay(String payPlanCd);

    List<Map<String, Object>> getHistory(String sysId);

    /**
     * 업체(sysId)에 요금제(payIdx)를 배정/변경한다.
     * 기존 활성 이력을 마감하고 새 이력을 시작하며 TN_SYS_M001.current_pay_idx를 갱신한다.
     * 권한 데이터(TN_ATH_A001/M001) 재적용은 하지 않는다 - 순수 기록/추적 목적.
     */
    void assignPay(String sysId, Long payIdx, String chgRsn, String userId);
}
