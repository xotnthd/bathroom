package com.community.bathroom.comn.code.service.impl;

import com.community.bathroom.comn.code.mapper.CommonCodeMapper;
import com.community.bathroom.comn.code.service.CommonCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CommonCodeServiceImpl implements CommonCodeService {

    @Autowired
    private CommonCodeMapper commonCodeMapper;

    @Override
    public List<Map<String, Object>> getCommonCodeList(String sysId, String grpCd, String uprComCd) {
        return commonCodeMapper.selectCommonCodeList(sysId, grpCd, uprComCd);
    }
}