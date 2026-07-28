package com.community.bathroom.comn.code.service;

import java.util.List;
import java.util.Map;

public interface CommonCodeService {
    List<Map<String, Object>> getCommonCodeList(String sysId, String grpCd, String uprComCd);
}