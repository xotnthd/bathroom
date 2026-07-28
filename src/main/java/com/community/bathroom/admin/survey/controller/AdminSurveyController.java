package com.community.bathroom.admin.survey.controller;

import com.community.bathroom.admin.survey.service.AdminSurveyService;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/survey")
public class AdminSurveyController {

    @Autowired
    private AdminSurveyService adminSurveyService;

    // 참고: 템플릿 관리(/admin/survey/template)와 배포 관리(/admin/survey/deploy) 화면이 이 엔드포인트를 공유해서
    // 단일 menuUrl로 앵커링할 수 없어 sysId 검증만 적용한다.
    @TenantGuard(action = TenantGuard.Action.READ)
    @PostMapping("/list")
    public ResponseEntity<?> getSurveyList(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        int page = (int) param.getOrDefault("page", 1);
        int limit = (int) param.getOrDefault("limit", 10);
        param.put("offset", (page - 1) * limit);
        param.put("limit", limit);

        List<Map<String, Object>> list = adminSurveyService.getSurveyList(param);
        int total = adminSurveyService.getSurveyCount(param);

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", total);
        result.put("page", page);
        return ResponseEntity.ok(result);
    }

    // 참고: SecurityConfig에서 permitAll (로그인 없이 설문 링크로 들어와 응답하는 흐름, UserSurvey.jsx가 직접 호출) -
    // 인증 안 된 요청도 통과해야 하므로 TenantGuard를 붙이면 안 된다.
    @PostMapping("/detail")
    public ResponseEntity<?> getSurveyDetail(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        Map<String, Object> detail = adminSurveyService.getSurveyDetail(param);
        if (detail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detail);
    }

    // 참고: 템플릿/배포 화면 공유 엔드포인트라 sysId 검증만 적용 (위 /list와 동일 이유)
    @TenantGuard(action = TenantGuard.Action.WRITE)
    @PostMapping("/save")
    public ResponseEntity<?> saveSurvey(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        param.putIfAbsent("userId", "admin"); // 임시, 실제론 세션/토큰에서 가져와야 함
        String survId = adminSurveyService.saveSurvey(param);
        Map<String, Object> result = new HashMap<>();
        result.put("survId", survId);
        result.put("success", true);
        return ResponseEntity.ok(result);
    }

    // 참고: 템플릿/배포 화면 공유 엔드포인트라 sysId 검증만 적용 (위 /list와 동일 이유)
    @TenantGuard(action = TenantGuard.Action.DELETE)
    @DeleteMapping("/delete/{survId}")
    public ResponseEntity<?> deleteSurvey(@PathVariable String survId, @RequestParam(required = false) String sysId) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId != null ? sysId : "CORE");
        param.put("survId", survId);
        param.put("userId", "admin");
        adminSurveyService.deleteSurvey(param);
        return ResponseEntity.ok().build();
    }

    // --- Survey Results Endpoints ---

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/survey/result/list")
    @PostMapping("/result/list")
    public ResponseEntity<?> getSurveyResultList(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        int page = (int) param.getOrDefault("page", 1);
        int limit = (int) param.getOrDefault("limit", 10);
        param.put("offset", (page - 1) * limit);
        param.put("limit", limit);

        Map<String, Object> result = adminSurveyService.getSurveyResultList(param);
        return ResponseEntity.ok(result);
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/survey/result/list")
    @PostMapping("/result/respondents")
    public ResponseEntity<?> getSurveyRespondents(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        List<Map<String, Object>> result = adminSurveyService.getSurveyRespondents(param);
        return ResponseEntity.ok(result);
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/survey/result/list")
    @PostMapping("/result/answers")
    public ResponseEntity<?> getSurveyRespondentAnswers(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        List<Map<String, Object>> result = adminSurveyService.getSurveyRespondentAnswers(param);
        return ResponseEntity.ok(result);
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuUrl = "/admin/survey/result/list")
    @PostMapping("/result/statistics")
    public ResponseEntity<?> getSurveyStatistics(@RequestBody Map<String, Object> param) {
        param.putIfAbsent("sysId", "CORE");
        List<Map<String, Object>> result = adminSurveyService.getSurveyStatistics(param);
        return ResponseEntity.ok(result);
    }
}
