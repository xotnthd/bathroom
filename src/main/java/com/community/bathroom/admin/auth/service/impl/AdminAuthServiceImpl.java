package com.community.bathroom.admin.auth.service.impl;

import com.community.bathroom.admin.auth.mapper.AdminAuthMapper;
import com.community.bathroom.admin.auth.service.AdminAuthService;
import com.community.bathroom.comn.security.config.DynamicAdminAuthorizationManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminAuthServiceImpl implements AdminAuthService {
    @Autowired private AdminAuthMapper adminAuthMapper;
    
    // 권한 관리가 변경될 때 캐시를 초기화하기 위해 의존성 주입
    @Autowired private DynamicAdminAuthorizationManager dynamicAdminAuthorizationManager;

    @Override
    public List<Map<String, Object>> getRoleList(String sysId, String sysSeCd, boolean callerIsTrueSuper, int currentUserLevel) {
        Map<String, Object> param = new HashMap<>();
        param.put("sysId", sysId);
        param.put("sysSeCd", sysSeCd);
        param.put("callerIsTrueSuper", callerIsTrueSuper);
        param.put("currentUserLevel", currentUserLevel);
        return adminAuthMapper.selectRoleList(param);
    }

    @Override @Transactional public void saveRole(Map<String, Object> param) {
        String oldAthrtyComCd = (String) param.get("oldAthrtyComCd");
        String newAthrtyComCd = (String) param.get("athrtyComCd");
        String sysId = (String) param.get("sysId");
        boolean isTrueSuperAdmin = Boolean.TRUE.equals(param.get("isTrueSuperAdmin"));
        int currentUserLevel = param.get("currentUserLevel") != null ? Integer.parseInt(param.get("currentUserLevel").toString()) : 99;

        // S로 시작하는 권한코드(플랫폼 최고관리자 계열)는 CORE에서만, 그리고 SUPR 자체는 진짜 최고관리자만 다룰 수 있다
        if (newAthrtyComCd != null && newAthrtyComCd.startsWith("S") && !"CORE".equals(sysId)) {
            throw new IllegalArgumentException("S로 시작하는 권한코드는 CORE에서만 생성할 수 있습니다.");
        }
        if ("SUPR".equals(newAthrtyComCd) && !isTrueSuperAdmin) {
            throw new IllegalArgumentException("사용할 수 없는 권한코드입니다.");
        }

        if (oldAthrtyComCd != null && !oldAthrtyComCd.trim().isEmpty()) {
            // 기존 역할 수정/이름변경 - 대상 역할이 자신보다 이미 더 강하면 손댈 수 없음(레벨 자체는 이 경로에서 건드리지 않음)
            Integer existingLevel = adminAuthMapper.selectRoleLevel(sysId, oldAthrtyComCd);
            if (existingLevel != null && existingLevel < currentUserLevel && !isTrueSuperAdmin) {
                throw new IllegalArgumentException("자신보다 높은 권한을 가진 역할은 수정할 수 없습니다.");
            }

            if (!oldAthrtyComCd.equals(newAthrtyComCd)) {
                // RENAME
                if (adminAuthMapper.checkRoleExists(param) > 0) {
                    throw new IllegalArgumentException("이미 사용 중인 권한 코드입니다.");
                }
                adminAuthMapper.updateRoleCodeCascadeM001(param);
                adminAuthMapper.updateRoleCodeCascadeUser(param);
                adminAuthMapper.updateRoleCodeCascadeA001(param);
                param.put("chgType", "RENAME");
                adminAuthMapper.insertAuthHistory(param);
            } else {
                // UPDATE (이름/설명/사용여부만 - 레벨은 /role/level/save 전용 엔드포인트에서만 변경)
                adminAuthMapper.updateRole(param);
                param.put("chgType", "UPDATE");
                adminAuthMapper.insertAuthHistory(param);
            }
        } else {
            // CREATE - 신규 등록은 항상 최저 등급(99)으로 생성, 클라이언트가 보낸 레벨 값은 무시
            if (adminAuthMapper.checkRoleExists(param) > 0) throw new IllegalArgumentException("이미 존재하는 권한코드입니다.");
            param.put("athrtyLevel", 99);
            adminAuthMapper.insertRole(param);
            param.put("oldAthrtyComCd", param.get("athrtyComCd"));
            param.put("chgType", "CREATE");
            adminAuthMapper.insertAuthHistory(param);
        }

        // 권한 정보가 변경되었으므로 인메모리 캐시 초기화
        dynamicAdminAuthorizationManager.clearCache();
    }

    @Override @Transactional public void deleteRole(String sysId, String athrtyComCd, int currentUserLevel, boolean isTrueSuperAdmin) {
        if ("S001".equals(athrtyComCd) && !isTrueSuperAdmin) {
            throw new IllegalArgumentException("최고 관리자(S001)는 삭제할 수 없습니다.");
        }
        if ("SUPR".equals(athrtyComCd) && !isTrueSuperAdmin) {
            throw new IllegalArgumentException("삭제할 수 없는 권한입니다.");
        }
        Integer targetLevel = adminAuthMapper.selectRoleLevel(sysId, athrtyComCd);
        if (targetLevel != null && targetLevel < currentUserLevel && !isTrueSuperAdmin) {
            throw new IllegalArgumentException("자신보다 높은 권한을 가진 역할은 삭제할 수 없습니다.");
        }

        adminAuthMapper.logicalDeleteRole(sysId, athrtyComCd);
        adminAuthMapper.deleteAuthMenuMappingByRole(sysId, athrtyComCd);

        Map<String, Object> param = new java.util.HashMap<>();
        param.put("sysId", sysId);
        param.put("athrtyComCd", "");
        param.put("oldAthrtyComCd", athrtyComCd);
        param.put("oldAthrtyNm", "");
        param.put("athrtyNm", "");
        param.put("chgType", "DELETE");
        param.put("userId", "admin"); // TODO: 추후 세션 연동
        adminAuthMapper.insertAuthHistory(param);

        // 권한이 삭제되었으므로 인메모리 캐시 초기화
        dynamicAdminAuthorizationManager.clearCache();
    }

    @Override
    @Transactional
    public void saveRoleLevels(List<Map<String, Object>> items, int currentUserLevel, boolean isTrueSuperAdmin, String userId) {
        for (Map<String, Object> item : items) {
            String sysId = (String) item.get("sysId");
            String athrtyComCd = (String) item.get("athrtyComCd");
            int newLevel = Integer.parseInt(String.valueOf(item.get("athrtyLevel")));

            if ("SUPR".equals(athrtyComCd) && !isTrueSuperAdmin) {
                throw new IllegalArgumentException("수정할 수 없는 권한입니다.");
            }
            if (!isTrueSuperAdmin && newLevel <= currentUserLevel) {
                throw new IllegalArgumentException("자신의 권한 레벨(" + currentUserLevel + ")과 같거나 더 높은(더 작은 숫자) 레벨은 부여할 수 없습니다.");
            }
            Integer existingLevel = adminAuthMapper.selectRoleLevel(sysId, athrtyComCd);
            if (existingLevel != null && existingLevel < currentUserLevel && !isTrueSuperAdmin) {
                throw new IllegalArgumentException("자신보다 높은 권한을 가진 역할의 레벨은 변경할 수 없습니다.");
            }

            Map<String, Object> updateParam = new HashMap<>();
            updateParam.put("sysId", sysId);
            updateParam.put("athrtyComCd", athrtyComCd);
            updateParam.put("athrtyLevel", newLevel);
            updateParam.put("userId", userId);
            adminAuthMapper.updateRoleLevel(updateParam);
        }
        dynamicAdminAuthorizationManager.clearCache();
    }

    @Override public List<Map<String, Object>> getAuthMenuMatrix(String sysId, String athrtyComCd) {
        return adminAuthMapper.selectAuthMenuMatrix(sysId, athrtyComCd);
    }

    @Override @Transactional public void saveAuthMenuMatrix(List<Map<String, Object>> paramList) {
        for (Map<String, Object> param : paramList) {
            param.put("userId", "admin");
            // 로직: 메뉴 노출이 'N'이면 모든 CRUD 강제 'N' 처리
            if ("N".equals(param.get("menuShowYn"))) {
                param.put("inqireYn", "N"); param.put("rgstYn", "N");
                param.put("mdfcnYn", "N"); param.put("delYn", "N");
            }
            if (adminAuthMapper.checkAuthMenuMappingExists(param) > 0) { adminAuthMapper.updateAuthMenuMapping(param); }
            else { adminAuthMapper.insertAuthMenuMapping(param); }
        }
    }

    // CORE 관리 전용 메뉴(core_only_yn='Y')는 CORE의 SUPR/S001 계정에게만 부여될 수 있다.
    @Override
    public boolean touchesCoreOnlyMenuForNonCoreRole(List<Map<String, Object>> paramList) {
        List<String> menuIds = paramList.stream()
                .filter(p -> !"SUPR".equals(p.get("athrtyComCd")) && !"S001".equals(p.get("athrtyComCd")))
                .map(p -> (String) p.get("menuId"))
                .distinct()
                .collect(java.util.stream.Collectors.toList());
        if (menuIds.isEmpty()) return false;
        return adminAuthMapper.countCoreOnlyMenus(menuIds) > 0;
    }
}