package com.community.bathroom.comn.security.service;

import com.community.bathroom.comn.security.mapper.SecurityMapper;
import com.community.bathroom.comn.security.model.AdminPrincipal;
import com.community.bathroom.comn.security.model.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CommonUserDetailsService implements UserDetailsService {

    @Autowired
    private SecurityMapper securityMapper;

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        // 1. 관리자 테이블에서 먼저 조회
        Map<String, Object> userData = securityMapper.selectAdminById(loginId);

        if (userData != null) {
            String role = (String) userData.get("role");
            if (role == null || role.isEmpty()) role = "ROLE_ADMIN"; // fallback
            String sysId = (String) userData.get("sysId");
            Object athrtyLevelObj = userData.get("athrtyLevel");
            int athrtyLevel = athrtyLevelObj instanceof Number ? ((Number) athrtyLevelObj).intValue() : 99;

            Object resignDtObj = userData.get("resignDt");
            java.time.LocalDate resignDt = null;
            if (resignDtObj instanceof java.sql.Date sqlDate) {
                resignDt = sqlDate.toLocalDate();
            } else if (resignDtObj instanceof java.time.LocalDate localDate) {
                resignDt = localDate;
            } else if (resignDtObj instanceof java.util.Date utilDate) {
                resignDt = utilDate.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
            }

            // sysId/athrtyLevel을 principal에 실어서, 이후 요청마다(TenantGuardAspect 등) 재조회 없이
            // "이 관리자의 실제 소속 테넌트가 어디인지"를 세션에서 바로 알 수 있게 한다.
            return new AdminPrincipal(
                    (String) userData.get("loginId"),
                    (String) userData.get("loginPw"),
                    sysId,
                    role,
                    athrtyLevel,
                    resignDt
            );
        }

        // 2. 관리자가 아니라면 일반 회원(공개 홈페이지, TN_USR_M001) 테이블에서 조회
        userData = securityMapper.selectUserById(loginId);
        if (userData == null) {
            throw new UsernameNotFoundException("계정을 찾을 수 없습니다: " + loginId);
        }

        Object sortOrdObj = userData.get("userGradeSortOrd");
        int userGradeSortOrd = sortOrdObj instanceof Number ? ((Number) sortOrdObj).intValue() : 0;

        return new UserPrincipal(
                (String) userData.get("loginId"),
                (String) userData.get("loginPw"),
                (String) userData.get("sysId"),
                (String) userData.get("userGradeCd"),
                userGradeSortOrd
        );
    }
}