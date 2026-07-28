package com.community.bathroom.user.survey.controller;

import com.community.bathroom.user.survey.service.UserSurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user/api/survey")
public class UserSurveyController {

    @Autowired
    private UserSurveyService userSurveyService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitSurvey(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        
        // TODO: 로그인된 사용자 정보 연동 (지금은 익명으로 처리)
        // String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        param.putIfAbsent("userId", "anonymous");

        userSurveyService.submitSurvey(param);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(result);
    }
}
