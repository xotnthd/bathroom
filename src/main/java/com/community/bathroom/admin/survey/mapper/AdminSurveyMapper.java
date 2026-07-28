package com.community.bathroom.admin.survey.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminSurveyMapper {
    List<Map<String, Object>> selectSurveyList(Map<String, Object> param);
    int selectSurveyCount(Map<String, Object> param);
    Map<String, Object> selectSurveyMaster(Map<String, Object> param);
    List<Map<String, Object>> selectSurveyQuestions(Map<String, Object> param);
    List<Map<String, Object>> selectSurveyOptions(Map<String, Object> param);
    
    int insertSurveyMaster(Map<String, Object> param);
    int updateSurveyMaster(Map<String, Object> param);
    int logicalDeleteSurveyMaster(Map<String, Object> param);
    
    int insertSurveyQuestion(Map<String, Object> param);
    int deleteSurveyQuestions(Map<String, Object> param);
    
    int insertSurveyOption(Map<String, Object> param);
    int deleteSurveyOptions(Map<String, Object> param);

    // Survey Results
    List<Map<String, Object>> selectSurveyResultList(Map<String, Object> param);
    int selectSurveyResultCount(Map<String, Object> param);
    List<Map<String, Object>> selectSurveyRespondents(Map<String, Object> param);
    List<Map<String, Object>> selectSurveyRespondentAnswers(Map<String, Object> param);
    List<Map<String, Object>> selectSurveyStatistics(Map<String, Object> param);
}
