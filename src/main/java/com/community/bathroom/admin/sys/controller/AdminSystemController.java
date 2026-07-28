package com.community.bathroom.admin.sys.controller;

import com.community.bathroom.admin.sys.service.AdminSystemService;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/sys")
public class AdminSystemController {

    @Autowired
    private AdminSystemService adminSystemService;

    // 테넌트 전체를 열거하는 화면 - 교차 테넌트 가능자(S001, CORE의 A001)만.
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/list")
    public ResponseEntity<?> getSystemList(@RequestBody Map<String, Object> param) {
        List<Map<String, Object>> list = adminSystemService.getSystemList(param);
        return ResponseEntity.ok(list);
    }

    // 참고: AdminLayout.jsx가 모든 관리자 화면 진입 시 자기 테넌트의 테마/로고를 불러오려고 호출하는 부트스트랩 API라
    // SUPER_ADMIN_ONLY로 막으면 안 되고, sysId만 검증한다 (다른 테넌트 상세는 볼 수 없게).
    @TenantGuard(action = TenantGuard.Action.READ)
    @GetMapping("/detail/{sysId}")
    public ResponseEntity<?> getSystemDetail(@PathVariable String sysId) {
        Map<String, Object> detail = adminSystemService.getSystemById(sysId);
        return ResponseEntity.ok(detail != null ? detail : new HashMap<>());
    }

    // 테넌트 마스터 설정 저장 - 교차 테넌트 가능자만 (AdminSysForm.jsx는 CORE 전용 테넌트 관리 화면).
    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/save")
    public ResponseEntity<?> saveSystemConfig(
            @RequestParam(value = "logoFiles", required = false) MultipartFile[] logoFiles,
            @RequestParam("sysData") String sysDataJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> param = mapper.readValue(sysDataJson, new TypeReference<Map<String, Object>>() {});
            
            adminSystemService.saveSystemConfig(param, logoFiles);
            
            Map<String, Object> res = new HashMap<>();
            res.put("status", "SUCCESS");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("시스템 설정 저장 실패");
        }
    }

    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @GetMapping("/check-id")
    public ResponseEntity<?> checkMasterId(@RequestParam String sysId, @RequestParam String masterId) {
        boolean exists = adminSystemService.checkUserIdExists(sysId, masterId);
        Map<String, Object> res = new HashMap<>();
        res.put("isAvailable", !exists);
        return ResponseEntity.ok(res);
    }

    @TenantGuard(action = TenantGuard.Action.SUPER_ADMIN_ONLY)
    @PostMapping("/create")
    public ResponseEntity<?> createSystem(
            @RequestParam(value = "logoFiles", required = false) MultipartFile[] logoFiles,
            @RequestParam("sysData") String sysDataJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> param = mapper.readValue(sysDataJson, new TypeReference<Map<String, Object>>() {});
            
            adminSystemService.createSystem(param, logoFiles);
            
            Map<String, Object> res = new HashMap<>();
            res.put("status", "SUCCESS");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("시스템 생성 실패: " + e.getMessage());
        }
    }
}
