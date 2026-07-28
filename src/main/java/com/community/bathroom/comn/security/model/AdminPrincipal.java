package com.community.bathroom.comn.security.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * 관리자 로그인 principal. 표준 Spring Security {@link org.springframework.security.core.userdetails.User}와 달리
 * 로그인 시점의 sysId/athrtyLevel을 세션 동안 그대로 들고 다닌다 (TenantGuardAspect가 매 요청마다 재조회하지 않도록).
 */
public class AdminPrincipal implements UserDetails {

    private final String loginId;
    private final String password;
    private final String sysId;
    private final String role;
    private final int athrtyLevel;
    private final java.time.LocalDate resignDt;

    public AdminPrincipal(String loginId, String password, String sysId, String role, int athrtyLevel) {
        this(loginId, password, sysId, role, athrtyLevel, null);
    }

    public AdminPrincipal(String loginId, String password, String sysId, String role, int athrtyLevel, java.time.LocalDate resignDt) {
        this.loginId = loginId;
        this.password = password;
        this.sysId = sysId;
        this.role = role;
        this.athrtyLevel = athrtyLevel;
        this.resignDt = resignDt;
    }

    public String getSysId() {
        return sysId;
    }

    public String getRole() {
        return role;
    }

    public int getAthrtyLevel() {
        return athrtyLevel;
    }

    /** 플랫폼 최고관리자 (S001) - sysId 검증과 메뉴/CRUD 매트릭스 검증을 전부 우회하는 진짜 root. */
    public boolean isSuperAdmin() {
        return "S001".equals(role);
    }

    /** S001보다 위, 존재 자체가 숨겨진 진짜 최고관리자(SUPR/spadmin) - 민감(sensitive_yn) 메뉴는 S001도 이 역할이 아니면 매트릭스를 그대로 탄다. */
    public boolean isTrueSuperAdmin() {
        return "SUPR".equals(role);
    }

    /** S001/SUPR이거나, CORE 소속 A001(코어사 자체 슈퍼관리자) - 교차 테넌트 전환이 허용된 사람. AdminLayout.jsx의 canSwitchSystem과 동일 조건. */
    public boolean isCrossTenantCapable() {
        return isSuperAdmin() || isTrueSuperAdmin() || ("CORE".equals(sysId) && "A001".equals(role));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return loginId;
    }

    // 재직 중이면(퇴사일 미설정) 문제 없음. 퇴사일이 지났으면 sysId 자체의 서비스 기한과 무관하게 로그인 자체를 차단.
    @Override
    public boolean isAccountNonExpired() {
        return resignDt == null || !resignDt.isBefore(java.time.LocalDate.now());
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
