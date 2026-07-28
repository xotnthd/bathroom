package com.community.bathroom.admin.user.service.impl;

import com.community.bathroom.admin.user.mapper.AdminUserMapper;
import com.community.bathroom.admin.user.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private AdminUserMapper adminUserMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public List<Map<String, Object>> getSearchUserList(Map<String, Object> searchParam) {
        return adminUserMapper.selectSearchUserList(searchParam);
    }

    @Override
    public Map<String, Object> getUserDetail(String sysId, String userId, boolean callerIsTrueSuper) {
        Map<String, Object> param = new java.util.HashMap<>();
        param.put("sysId", sysId);
        param.put("userId", userId);
        param.put("callerIsTrueSuper", callerIsTrueSuper);
        return adminUserMapper.selectUserDetail(param);
    }

    @Override
    @Transactional
    public void saveUser(Map<String, Object> param) {
        int currentAthrtyLevel = param.containsKey("currentAthrtyLevel") ? (Integer) param.get("currentAthrtyLevel") : 99;
        
        // 1. 방어 로직: 자신보다 높은 권한을 부여하려고 하는지 검증
        String targetAthrtyCd = (String) param.get("athrtyCd");
        if (targetAthrtyCd != null) {
            Map<String, Object> athrtyInfo = adminUserMapper.selectAuthorityLevelByCd((String) param.get("sysId"), targetAthrtyCd);
            if (athrtyInfo != null && athrtyInfo.get("athrtyLevel") != null) {
                int targetLevel = ((Number) athrtyInfo.get("athrtyLevel")).intValue();
                if (targetLevel < currentAthrtyLevel) {
                    throw new RuntimeException("자신보다 높은 등급의 권한을 부여할 수 없습니다.");
                }
            }
        }
        
        // 2. 방어 로직: 기존 계정 수정 시, 타겟 계정이 자신보다 높은 권한인지 검증
        int cnt = adminUserMapper.checkUserExists(param);
        long excludeUserIdx = 0L;
        if (cnt > 0) {
            Map<String, Object> existingUser = adminUserMapper.selectUserById((String)param.get("sysId"), (String)param.get("userId"));
            if (existingUser != null && existingUser.get("athrtyLevel") != null) {
                int existingLevel = ((Number) existingUser.get("athrtyLevel")).intValue();
                if (existingLevel < currentAthrtyLevel) {
                    throw new RuntimeException("자신보다 높은 권한을 가진 계정을 수정할 수 없습니다.");
                }
            }
            if (existingUser != null && existingUser.get("idx") != null) {
                excludeUserIdx = ((Number) existingUser.get("idx")).longValue();
            }
        }

        // 3. 신규 등록이고 사번이 비어있으면 {sysId}-100000001 부터 시작하는 시퀀스로 자동 채번
        if (cnt == 0) {
            String givenEmpNo = (String) param.get("empNo");
            if (givenEmpNo == null || givenEmpNo.trim().isEmpty()) {
                String sysId = (String) param.get("sysId");
                Long maxSeq = adminUserMapper.selectMaxEmpNoSeq(sysId);
                long nextSeq = (maxSeq == null ? 100000000L : maxSeq) + 1;
                param.put("empNo", sysId + "-" + nextSeq);
            }
        }

        // 4. 방어 로직: 사번(empNo) 중복 검증 (다른 계정과 겹치지 않게)
        String empNo = (String) param.get("empNo");
        if (empNo != null && !empNo.trim().isEmpty()) {
            Map<String, Object> empNoCheckParam = new java.util.HashMap<>();
            empNoCheckParam.put("sysId", param.get("sysId"));
            empNoCheckParam.put("empNo", empNo);
            empNoCheckParam.put("excludeUserIdx", excludeUserIdx);
            if (adminUserMapper.checkEmpNoExists(empNoCheckParam) > 0) {
                throw new RuntimeException("이미 사용 중인 사번입니다.");
            }
        }

        String rawPswd = (String) param.get("pswd");
        if (rawPswd != null && !rawPswd.trim().isEmpty()) {
            param.put("pswd", passwordEncoder.encode(rawPswd));
        }

        if (cnt > 0) {
            adminUserMapper.updateUserMaster(param);
            adminUserMapper.updateUserDetail(param);
        } else {
            adminUserMapper.insertUserMaster(param);
            param.put("userIdx", param.get("idx"));
            adminUserMapper.insertUserDetail(param);
        }
    }

    @Autowired
    private com.community.bathroom.comn.file.service.CommonFileService commonFileService;

    @Override
    @Transactional
    public void saveUserWithFiles(Map<String, Object> param, org.springframework.web.multipart.MultipartFile[] files) {
        if (files != null && files.length > 0) {
            String sysId = (String) param.getOrDefault("sysId", "CORE");
            String userId = (String) param.get("registerId");
            // Upload file to get fileGrpId
            String grpId = commonFileService.uploadFiles(files, sysId, null, "USER", userId);
            
            // Get the first file's fileSn from the uploaded group
            List<Map<String, Object>> fileList = commonFileService.getFileList(sysId, grpId);
            if (fileList != null && !fileList.isEmpty()) {
                param.put("imgFileSn", fileList.get(0).get("fileSn"));
            }
        }
        
        // null string handling for rmrk
        if (param.get("rmrk") != null && param.get("rmrk").toString().trim().isEmpty()) {
            param.put("rmrk", null);
        }
        
        saveUser(param);
    }

    @Override
    @Transactional
    public void deleteUser(String sysId, String userId, int currentAthrtyLevel) {
        Map<String, Object> user = adminUserMapper.selectUserById(sysId, userId);
        if (user != null) {
            if (user.get("athrtyLevel") != null) {
                int targetLevel = ((Number) user.get("athrtyLevel")).intValue();
                if (targetLevel < currentAthrtyLevel) {
                    throw new RuntimeException("자신보다 높은 권한을 가진 계정을 삭제할 수 없습니다.");
                }
            }
            Long userIdx = Long.parseLong(String.valueOf(user.get("idx")));
            adminUserMapper.deleteUserDetail(userIdx);
            adminUserMapper.deleteUserMaster(sysId, userId);
        }
    }
}