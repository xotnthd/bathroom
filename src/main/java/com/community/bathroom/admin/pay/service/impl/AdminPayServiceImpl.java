package com.community.bathroom.admin.pay.service.impl;

import com.community.bathroom.admin.pay.mapper.AdminPayMapper;
import com.community.bathroom.admin.pay.service.AdminPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
public class AdminPayServiceImpl implements AdminPayService {

    @Autowired
    private AdminPayMapper adminPayMapper;

    private BigDecimal toBigDecimal(Object val) {
        if (val == null) return BigDecimal.ZERO;
        return new BigDecimal(String.valueOf(val));
    }

    @Override
    public List<Map<String, Object>> getPayList() {
        return adminPayMapper.selectPayList();
    }

    @Override
    public Map<String, Object> getPay(String payPlanCd) {
        return adminPayMapper.selectPayDetailByCd(payPlanCd);
    }

    @Override
    @Transactional
    public void savePay(Map<String, Object> param) {
        BigDecimal price = toBigDecimal(param.get("price"));
        BigDecimal discountRate = toBigDecimal(param.get("discountRate"));
        BigDecimal discountPrice = price
                .multiply(BigDecimal.ONE.subtract(discountRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)))
                .setScale(2, RoundingMode.HALF_UP);

        param.put("price", price);
        param.put("discountRate", discountRate);
        param.put("discountPrice", discountPrice);

        int cnt = adminPayMapper.checkPayExists(param);
        if (cnt > 0) {
            adminPayMapper.updatePay(param);
        } else {
            adminPayMapper.insertPay(param);
        }
    }

    @Override
    @Transactional
    public void deletePay(String payPlanCd) {
        Map<String, Object> pay = adminPayMapper.selectPayByCd(payPlanCd);
        if (pay == null) {
            throw new IllegalArgumentException("존재하지 않는 요금제입니다.");
        }
        Long payIdx = ((Number) pay.get("idx")).longValue();
        if (adminPayMapper.checkPayHistoryExists(payIdx) > 0) {
            throw new IllegalArgumentException("이미 적용 이력이 있는 요금제는 삭제할 수 없습니다. 사용 중지(사용여부=N) 처리해주세요.");
        }
        adminPayMapper.deletePayRow(payPlanCd);
    }

    @Override
    public List<Map<String, Object>> getHistory(String sysId) {
        return adminPayMapper.selectPayHistory(sysId);
    }

    @Override
    @Transactional
    public void assignPay(String sysId, Long payIdx, String chgRsn, String userId) {
        adminPayMapper.closeActivePayHistory(sysId);

        Map<String, Object> param = new java.util.HashMap<>();
        param.put("sysId", sysId);
        param.put("payIdx", payIdx);
        param.put("chgRsn", chgRsn);
        param.put("userId", userId);
        adminPayMapper.insertPayHistory(param);

        adminPayMapper.updateSystemCurrentPay(sysId, payIdx);
    }
}
