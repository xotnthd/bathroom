package com.community.bathroom.admin.corp.service;

import java.util.List;
import java.util.Map;

public interface AdminCorpService {

    List<Map<String, Object>> getCorpList(Map<String, Object> param);

    Map<String, Object> getCorpDetail(Long idx);

    void saveCorp(Map<String, Object> param);

    void deleteCorp(Long idx);
}
