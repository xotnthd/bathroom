package com.community.bathroom.admin.survey.service;

import com.community.bathroom.admin.survey.mapper.AdminSurveyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminSurveyService {

    @Autowired
    private AdminSurveyMapper adminSurveyMapper;

    public List<Map<String, Object>> getSurveyList(Map<String, Object> param) {
        return adminSurveyMapper.selectSurveyList(param);
    }

    public int getSurveyCount(Map<String, Object> param) {
        return adminSurveyMapper.selectSurveyCount(param);
    }

    public Map<String, Object> getSurveyDetail(Map<String, Object> param) {
        Map<String, Object> master = adminSurveyMapper.selectSurveyMaster(param);
        if (master != null) {
            List<Map<String, Object>> questions = adminSurveyMapper.selectSurveyQuestions(param);
            List<Map<String, Object>> options = adminSurveyMapper.selectSurveyOptions(param);
            
            // 그룹화 로직은 프론트엔드에서 처리하거나 여기서 계층화 할 수 있음
            // 여기서는 단순 리스트로 내려주고 프론트에서 계층화 하도록 함
            master.put("questions", questions);
            master.put("options", options);
        }
        return master;
    }

    @Transactional(rollbackFor = Exception.class)
    public String saveSurvey(Map<String, Object> param) {
        String survId = (String) param.get("survId");
        boolean isNew = survId == null || survId.trim().isEmpty();
        
        if (isNew) {
            survId = "SURV_" + UUID.randomUUID().toString().replace("-", "").substring(0, 15).toUpperCase();
            param.put("survId", survId);
            adminSurveyMapper.insertSurveyMaster(param);
        } else {
            adminSurveyMapper.updateSurveyMaster(param);
            // 기존 질문, 보기 모두 삭제 후 재등록
            adminSurveyMapper.deleteSurveyOptions(param);
            adminSurveyMapper.deleteSurveyQuestions(param);
        }

        List<Map<String, Object>> questions = (List<Map<String, Object>>) param.get("questions");
        if (questions != null) {
            for (int i = 0; i < questions.size(); i++) {
                Map<String, Object> q = questions.get(i);
                q.put("sysId", param.get("sysId"));
                q.put("survId", survId);
                q.put("qstnSn", i + 1);
                q.put("ordNo", i + 1);
                if (!q.containsKey("reqYn")) q.put("reqYn", "Y");
                adminSurveyMapper.insertSurveyQuestion(q);
                
                List<Map<String, Object>> options = (List<Map<String, Object>>) q.get("options");
                if (options != null) {
                    for (int j = 0; j < options.size(); j++) {
                        Map<String, Object> o = options.get(j);
                        o.put("sysId", param.get("sysId"));
                        o.put("survId", survId);
                        o.put("qstnSn", i + 1);
                        o.put("optSn", j + 1);
                        o.put("ordNo", j + 1);
                        adminSurveyMapper.insertSurveyOption(o);
                    }
                }
            }
        }
        return survId;
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteSurvey(Map<String, Object> param) {
        adminSurveyMapper.logicalDeleteSurveyMaster(param);
    }

    // Survey Results
    public Map<String, Object> getSurveyResultList(Map<String, Object> param) {
        List<Map<String, Object>> list = adminSurveyMapper.selectSurveyResultList(param);
        int total = adminSurveyMapper.selectSurveyResultCount(param);
        
        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", total);
        result.put("page", param.getOrDefault("page", 1));
        return result;
    }

    public List<Map<String, Object>> getSurveyRespondents(Map<String, Object> param) {
        return adminSurveyMapper.selectSurveyRespondents(param);
    }

    public List<Map<String, Object>> getSurveyRespondentAnswers(Map<String, Object> param) {
        return adminSurveyMapper.selectSurveyRespondentAnswers(param);
    }

    public List<Map<String, Object>> getSurveyStatistics(Map<String, Object> param) {
        return adminSurveyMapper.selectSurveyStatistics(param);
    }
}
