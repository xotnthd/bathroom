package com.community.bathroom.admin.popup.controller;

import com.community.bathroom.admin.popup.service.PopupService;
import com.community.bathroom.comn.file.service.CommonFileService;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/popup")
public class PopupController {

    private static final Logger logger = LoggerFactory.getLogger(PopupController.class);

    @Autowired
    private PopupService popupService;

    @Autowired
    private CommonFileService commonFileService;

    // Get list with search conditions
    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_POP_01")
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getPopupList(@RequestParam Map<String, Object> param) {
        // param has sysId, searchSysSeCd, searchStDate, searchEdDate
        return ResponseEntity.ok(popupService.getPopupList(param));
    }

    // 참고: 로그인 없이 사용자/관리자 화면에 팝업을 띄우기 위한 의도적 공개 API (SecurityConfig에서 permitAll) - TenantGuard 적용 안 함
    @GetMapping("/active")
    public ResponseEntity<List<Map<String, Object>>> getActivePopups(
            @RequestParam(defaultValue = "CORE") String sysId,
            @RequestParam String sysSeCd) {
            
        logger.debug("--- [Popup] getActivePopups Request --- sysId: {}, sysSeCd: {}", sysId, sysSeCd);
        List<Map<String, Object>> list = popupService.getActivePopups(sysId, sysSeCd);
        logger.debug("--- [Popup] Fetched active popups count: {}", list.size());
        
        return ResponseEntity.ok(list);
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_POP_01")
    @GetMapping("/detail/{sysId}/{popIdx}")
    public ResponseEntity<Map<String, Object>> getPopup(@PathVariable String sysId, @PathVariable Long popIdx) {
        return ResponseEntity.ok(popupService.getPopup(sysId, popIdx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_POP_01")
    @PostMapping("/save")
    public ResponseEntity<?> savePopup(
            @RequestParam Map<String, Object> param,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {

        try {
            String sysId = (String) param.get("sysId");
            if (sysId == null || sysId.trim().isEmpty()) {
                sysId = "CORE";
                param.put("sysId", sysId);
            }
            String fileGrpId = (String) param.get("fileGrpId");
            String userId = "admin"; // TODO: Session ID

            // 1. Save files and get group ID
            fileGrpId = commonFileService.uploadFiles(files, sysId, fileGrpId, "POPUP", userId);

            param.put("fileGrpId", fileGrpId);
            param.put("userId", userId);

            logger.debug("--- [Popup] savePopup param: {}", param);
            
            // 2. Save popup
            popupService.savePopup(param);

            return ResponseEntity.ok(param);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 참고: popIdx만 받아서 sysId를 알 수 없음 - 소속 테넌트 소유권 검증은 서비스 레이어 후속 작업 필요 (알려진 갭)
    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_POP_01")
    @DeleteMapping("/delete/{popIdx}")
    public ResponseEntity<?> deletePopup(@PathVariable Long popIdx) {
        popupService.deletePopup(popIdx);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debugPopups() {
        // Just raw fetch all
        java.util.Map<String, Object> param = new java.util.HashMap<>();
        param.put("sysId", "CORE");
        return ResponseEntity.ok(popupService.getPopupList(param));
    }
}