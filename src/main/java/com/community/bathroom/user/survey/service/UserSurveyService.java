package com.community.bathroom.user.survey.service;

import com.community.bathroom.user.survey.mapper.UserSurveyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserSurveyService {

    @Autowired
    private UserSurveyMapper userSurveyMapper;

    @Transactional(rollbackFor = Exception.class)
    public void submitSurvey(Map<String, Object> param) {
        String respId = "RESP_" + UUID.randomUUID().toString().replace("-", "").substring(0, 15).toUpperCase();
        param.put("respId", respId);
        
        userSurveyMapper.insertSurveyResponseMaster(param);

        List<Map<String, Object>> answers = (List<Map<String, Object>>) param.get("answers");
        if (answers != null) {
            for (Map<String, Object> ans : answers) {
                String qstnType = (String) ans.get("qstnType");
                
                if ("S".equals(qstnType)) {
                    ans.put("sysId", param.get("sysId"));
                    ans.put("survId", param.get("survId"));
                    ans.put("respId", respId);
                    ans.put("ansSn", 1);
                    userSurveyMapper.insertSurveyResponseDetail(ans);
                } else if ("M".equals(qstnType) || "C".equals(qstnType)) {
                    List<Integer> optSns = (List<Integer>) ans.get("optSns");
                    if (optSns != null) {
                        for (int i = 0; i < optSns.size(); i++) {
                            Map<String, Object> detail = new java.util.HashMap<>();
                            detail.put("sysId", param.get("sysId"));
                            detail.put("survId", param.get("survId"));
                            detail.put("respId", respId);
                            detail.put("qstnSn", ans.get("qstnSn"));
                            detail.put("ansSn", i + 1);
                            detail.put("optSn", optSns.get(i));
                            
                            // 혼합형에서 기타 입력 (ansTxt) 저장 
                            if ("C".equals(qstnType) && ans.get("ansTxt") != null && optSns.size() > 0 && i == optSns.size() - 1) {
                                // 마지막 옵션에 텍스트 저장 (간단한 규칙: 마지막 선택지가 기타라고 가정)
                                detail.put("ansTxt", ans.get("ansTxt"));
                            }
                            userSurveyMapper.insertSurveyResponseDetail(detail);
                        }
                    }
                } else if ("T".equals(qstnType) || "L".equals(qstnType)) {
                    ans.put("sysId", param.get("sysId"));
                    ans.put("survId", param.get("survId"));
                    ans.put("respId", respId);
                    ans.put("ansSn", 1);
                    ans.put("optSn", null);
                    userSurveyMapper.insertSurveyResponseDetail(ans);
                }
            }
        }
    }
}
