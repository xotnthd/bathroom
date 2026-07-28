package com.community.bathroom.admin.code.service.impl;

import com.community.bathroom.admin.code.mapper.AdminCodeMapper;
import com.community.bathroom.admin.code.service.AdminCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AdminCodeServiceImpl implements AdminCodeService {

    @Autowired
    private AdminCodeMapper adminCodeMapper;

    @Override
    public List<Map<String, Object>> getGroupCodeList(String sysId) {
        return adminCodeMapper.selectGroupCodeList(sysId);
    }

    @Override
    @Transactional
    public void saveGroupCode(Map<String, Object> param) {
        // [누락 복구] 마스터 그룹 코드 존재 개수 count(*) 체크 검증 가동
        int cnt = adminCodeMapper.checkGroupCodeExists(param);
        if (cnt > 0) {
            adminCodeMapper.updateGroupCode(param);
        } else {
            adminCodeMapper.insertGroupCode(param);
        }
    }

    @Override
    @Transactional
    public void deleteGroupCode(String sysId, String comCd) {
        adminCodeMapper.deleteDetailCodeByGroup(sysId, comCd); // 하위 자식 계층 일괄 완전 삭제
        adminCodeMapper.deleteGroupCode(sysId, comCd);
    }

    @Override
    public List<Map<String, Object>> getDetailCodeList(String sysId, String grpCd, String uprComCd) {
        return adminCodeMapper.selectDetailCodeList(sysId, grpCd, uprComCd);
    }

    @Override
    @Transactional
    public void saveDetailCode(Map<String, Object> param) {
        // [누락 복구] 복합 유니크 키 기준 계층형 상세 데이터 존재 개수 count(*) 체크 검증 가동
        int cnt = adminCodeMapper.checkDetailCodeExists(param);
        if (cnt > 0) {
            adminCodeMapper.updateDetailCode(param);
        } else {
            adminCodeMapper.insertDetailCode(param);
        }
    }

    @Override
    @Transactional
    public void deleteDetailCode(String sysId, String grpCd, String uprComCd, String comCd) {
        // 내가 부모인 하위 자식 레벨(3단계)이 있을 수 있으므로 재귀 방어 삭제 작동
        adminCodeMapper.deleteDetailCodeByParent(sysId, grpCd, comCd);
        adminCodeMapper.deleteDetailCode(sysId, grpCd, uprComCd, comCd);
    }
}