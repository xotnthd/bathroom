package com.community.bathroom.user.survey.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.Map;

@Mapper
public interface UserSurveyMapper {
    int insertSurveyResponseMaster(Map<String, Object> param);
    int insertSurveyResponseDetail(Map<String, Object> param);
}
