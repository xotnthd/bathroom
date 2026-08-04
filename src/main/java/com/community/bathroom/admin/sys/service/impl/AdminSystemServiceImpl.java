package com.community.bathroom.admin.sys.service.impl;

import com.community.bathroom.admin.pay.mapper.AdminPayMapper;
import com.community.bathroom.admin.pay.service.AdminPayService;
import com.community.bathroom.admin.prdloc.mapper.AdminPrdLocMapper;
import com.community.bathroom.admin.sys.mapper.AdminSystemMapper;
import com.community.bathroom.admin.sys.service.AdminSystemService;
import com.community.bathroom.admin.user.mapper.AdminUserMapper;
import com.community.bathroom.comn.file.service.CommonFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class AdminSystemServiceImpl implements AdminSystemService {

    @Autowired
    private AdminSystemMapper adminSystemMapper;

    @Autowired
    private AdminUserMapper adminUserMapper;

    @Autowired
    private CommonFileService commonFileService;

    @Autowired
    private AdminPayMapper adminPayMapper;

    @Autowired
    private AdminPayService adminPayService;

    @Autowired
    private AdminPrdLocMapper adminPrdLocMapper;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public List<Map<String, Object>> getSystemList(Map<String, Object> param) {
        return adminSystemMapper.selectSystemList(param);
    }

    @Override
    public Map<String, Object> getSystemById(String sysId) {
        Map<String, Object> detail = adminSystemMapper.selectSystemById(sysId);
        if (detail != null) {
            List<String> menuIds = adminSystemMapper.selectSystemMenuIds(sysId);
            detail.put("menuIds", menuIds);
        }
        return detail;
    }

    @Override
    @Transactional
    public void saveSystemConfig(Map<String, Object> param, MultipartFile[] logoFiles, MultipartFile[] bannerFiles) {
        String sysId = (String) param.get("sysId");
        String userId = "admin"; // In a real scenario, fetch from SecurityContextHolder

        String atchFileGrpId = (String) param.get("logoFileGrpId");
        String bannerAtchFileGrpId = (String) param.get("bannerFileGrpId");

        // 업체 매핑 해제 시 프론트가 빈 문자열을 보낼 수 있어 NULL로 정규화 (corp_idx는 nullable FK)
        Object corpIdx = param.get("corpIdx");
        if (corpIdx == null || String.valueOf(corpIdx).trim().isEmpty()) {
            param.put("corpIdx", null);
        }

        if (logoFiles != null && logoFiles.length > 0) {
            // "SYS_LOGO" is the file category
            String newGrpId = commonFileService.uploadFiles(logoFiles, sysId, atchFileGrpId, "SYS_LOGO", userId);
            param.put("logoFileGrpId", newGrpId);
        }

        if (bannerFiles != null && bannerFiles.length > 0) {
            String newBannerGrpId = commonFileService.uploadFiles(bannerFiles, sysId, bannerAtchFileGrpId, "SYS_BANNER", userId);
            param.put("bannerFileGrpId", newBannerGrpId);
        }

        param.put("userId", userId);
        adminSystemMapper.updateSystemConfig(param);

        // Update Master User Password (if provided)
        String masterPw = (String) param.get("masterPw");
        if (masterPw != null && !masterPw.trim().isEmpty()) {
            param.put("masterPw", passwordEncoder.encode(masterPw));
            adminSystemMapper.updateMasterUser(param);
        }
        
        // Update Master User Name and Email
        adminSystemMapper.updateMasterUserDetail(param);

        // 참고: 메뉴 권한은 이제 권한코드 템플릿에서 생성 시점에 복제되고, 이후 조정은
        // 해당 테넌트의 "권한 매트릭스 관리"(AuthManage) 화면에서 직접 하므로 여기서는 건드리지 않는다.
    }

    @Override
    public boolean checkUserIdExists(String sysId, String userId) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("userId", userId);
        return adminUserMapper.checkUserExists(param) > 0;
    }

    @Override
    @Transactional
    public void createSystem(Map<String, Object> param, MultipartFile[] logoFiles, MultipartFile[] bannerFiles) throws Exception {
        String sysId = (String) param.get("sysId");
        String creatorId = "admin"; // Fetch from SecurityContext in reality

        // 1. Insert System Master
        param.put("creatorId", creatorId);
        adminSystemMapper.insertSystem(param);

        // Upload logo/banner if any
        boolean needsUpdate = false;
        if (logoFiles != null && logoFiles.length > 0) {
            String newGrpId = commonFileService.uploadFiles(logoFiles, sysId, null, "SYS_LOGO", creatorId);
            param.put("logoFileGrpId", newGrpId);
            needsUpdate = true;
        }
        if (bannerFiles != null && bannerFiles.length > 0) {
            String newBannerGrpId = commonFileService.uploadFiles(bannerFiles, sysId, null, "SYS_BANNER", creatorId);
            param.put("bannerFileGrpId", newBannerGrpId);
            needsUpdate = true;
        }
        if (needsUpdate) {
            adminSystemMapper.updateSystemConfig(param);
        }

        // 2. Data Copy (공통코드는 업체별로 복제하지 않음 - 항상 CORE 코드를 참조)
        adminSystemMapper.copyBoards(sysId);
        adminSystemMapper.copyBoardDetails(sysId);
        adminSystemMapper.copyAdminMenus(sysId);

        // 2-1. 제품 재고 관리용 기본 지점("본사") 자동 생성 - 다지점 없는 업체는 이 개념을 신경 쓸 필요가 없게
        adminPrdLocMapper.insertDefaultLocation(sysId);

        // 3. 선택된 요금제가 가리키는 권한 템플릿(부서×역할×메뉴매핑) 전체 복제 - 마스터(A001) 권한이 여기서 자동으로 결정됨
        Long payIdx = param.get("payPlanIdx") != null ? ((Number) param.get("payPlanIdx")).longValue() : null;
        if (payIdx == null) {
            throw new IllegalArgumentException("요금제를 선택해야 합니다.");
        }
        Map<String, Object> payInfo = adminPayMapper.selectPayForProvision(payIdx);
        String tplCd = payInfo != null ? (String) payInfo.get("tplCd") : null;
        if (tplCd != null) {
            adminSystemMapper.copyAuthorityGroups(sysId, tplCd);
            adminSystemMapper.copyAuthorityMenuMappings(sysId, tplCd);
        }

        // 4. Create Master User
        String masterId = (String) param.get("masterId");
        String pswd = (String) param.get("masterPw");
        String encodedPw = passwordEncoder.encode(pswd);

        param.put("encodedPw", encodedPw);
        adminSystemMapper.insertMasterUser(param);
        adminSystemMapper.insertMasterUserDetail(param);

        // 5. 요금제 적용 이력 기록 + TN_SYS_M001.current_pay_idx 세팅
        adminPayService.assignPay(sysId, payIdx, "시스템 생성", creatorId);
    }
}
