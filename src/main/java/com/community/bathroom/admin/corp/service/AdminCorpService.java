package com.community.bathroom.admin.corp.service;

import java.util.Map;

public interface AdminCorpService {

    Map<String, Object> getCorpDetail(String sysId);

    void saveCorpDetail(Map<String, Object> param);
}
