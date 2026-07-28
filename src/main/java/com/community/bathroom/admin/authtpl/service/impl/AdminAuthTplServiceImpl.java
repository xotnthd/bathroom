package com.community.bathroom.admin.authtpl.service.impl;

import com.community.bathroom.admin.authtpl.mapper.AdminAuthTplMapper;
import com.community.bathroom.admin.authtpl.service.AdminAuthTplService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AdminAuthTplServiceImpl implements AdminAuthTplService {

    @Autowired
    private AdminAuthTplMapper adminAuthTplMapper;

    @Override
    public List<Map<String, Object>> getTplList() {
        return adminAuthTplMapper.selectTplList();
    }

    @Override
    @Transactional
    public void saveTpl(Map<String, Object> param) {
        int cnt = adminAuthTplMapper.checkTplExists(param);
        if (cnt > 0) {
            adminAuthTplMapper.updateTpl(param);
        } else {
            adminAuthTplMapper.insertTpl(param);
        }
    }

    @Override
    @Transactional
    public void deleteTpl(String tplCd) {
        adminAuthTplMapper.deleteMenuMapByTplCd(tplCd);
        adminAuthTplMapper.deleteRoleByTplCd(tplCd);
        adminAuthTplMapper.deleteDeptByTplCd(tplCd);
        adminAuthTplMapper.deleteTplRow(tplCd);
    }

    @Override
    public List<Map<String, Object>> getDeptList(Long tplIdx) {
        return adminAuthTplMapper.selectDeptList(tplIdx);
    }

    @Override
    @Transactional
    public void saveDept(Map<String, Object> param) {
        int cnt = adminAuthTplMapper.checkDeptExists(param);
        if (cnt > 0) {
            adminAuthTplMapper.updateDept(param);
        } else {
            adminAuthTplMapper.insertDept(param);
        }
    }

    @Override
    @Transactional
    public void deleteDept(Long deptIdx) {
        adminAuthTplMapper.deleteMenuMapByDeptIdx(deptIdx);
        adminAuthTplMapper.deleteRoleByDeptIdx(deptIdx);
        adminAuthTplMapper.deleteDeptRow(deptIdx);
    }

    @Override
    public List<Map<String, Object>> getRoleList(Long deptIdx) {
        return adminAuthTplMapper.selectRoleList(deptIdx);
    }

    @Override
    @Transactional
    public void saveRole(Map<String, Object> param) {
        int cnt = adminAuthTplMapper.checkRoleExists(param);
        if (cnt > 0) {
            adminAuthTplMapper.updateRole(param);
        } else {
            String athrtyTplCd = (String) param.get("athrtyTplCd");
            // S001/SUPR은 CORE 자신만 쓰는 최상위 권한 - 테넌트에 복제될 템플릿으로 절대 등록될 수 없음
            if ("S001".equals(athrtyTplCd) || "SUPR".equals(athrtyTplCd)) {
                throw new IllegalArgumentException("S001/SUPR은 CORE 전용 권한이라 템플릿으로 등록할 수 없습니다.");
            }

            // 같은 템플릿(tpl_idx) 트리 안의 "다른" 부서에 이미 등록된 역할코드인지 검증 -
            // TN_ATH_TPL_A001 자체의 유니크 제약은 dept_idx 단위라 여기서 막지 않으면
            // 테넌트 생성 시 TN_ATH_A001(sys_id당 코드 유일)로 복제하는 단계에서 충돌난다.
            Long deptIdx = ((Number) param.get("deptIdx")).longValue();
            if (adminAuthTplMapper.checkRoleCodeExistsInTpl(deptIdx, athrtyTplCd) > 0) {
                throw new IllegalArgumentException("이미 등록된 역할입니다.");
            }
            // 레벨은 사람이 입력하지 않고 서버가 자동 배정 (같은 부서 내 기존 최대 레벨 + 1) - 휴먼에러 방지
            Integer maxLevel = adminAuthTplMapper.selectMaxRoleLevelInDept(deptIdx);
            param.put("athrtyLevel", (maxLevel == null ? 0 : maxLevel) + 1);
            adminAuthTplMapper.insertRole(param);

            // 신규 역할 템플릿의 메뉴 CRUD 권한을 맵핑된 CORE 실제 역할의 현재 권한으로 그대로 복사해서 초기 저장
            Long newAthrtyIdx = ((Number) param.get("idx")).longValue();
            adminAuthTplMapper.copyMenuMapFromCoreRole(newAthrtyIdx, athrtyTplCd, (String) param.get("userId"));
        }
    }

    @Override
    @Transactional
    public void deleteRole(Long athrtyIdx) {
        adminAuthTplMapper.deleteMenuMapByAthrtyIdx(athrtyIdx);
        adminAuthTplMapper.deleteRoleRow(athrtyIdx);
    }

    @Override
    public List<Map<String, Object>> getMenuMap(Long athrtyIdx, String sysSectCd) {
        return adminAuthTplMapper.selectMenuMap(athrtyIdx, sysSectCd);
    }

    @Override
    @Transactional
    public void saveMenuMap(List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            adminAuthTplMapper.upsertMenuMap(item);
        }
    }

    // 권한 템플릿은 신규 테넌트(비CORE) 생성 시 그대로 복제되므로 CORE 관리 전용 메뉴(core_only_yn='Y')는
    // 조건 없이 어떤 템플릿 역할에도 부여될 수 없다.
    @Override
    public boolean touchesCoreOnlyMenu(List<Map<String, Object>> items) {
        List<String> menuIds = items.stream()
                .map(p -> (String) p.get("menuId"))
                .distinct()
                .collect(java.util.stream.Collectors.toList());
        if (menuIds.isEmpty()) return false;
        return adminAuthTplMapper.countCoreOnlyMenus(menuIds) > 0;
    }
}
