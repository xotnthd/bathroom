package com.community.bathroom.comn.security.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * 일반 사용자(공개 홈페이지 회원, TN_USR_M001) 로그인 principal.
 * 관리자(AdminPrincipal)와 달리 메뉴별 CRUD 권한 매트릭스가 없다 - 화면 게이팅은 "로그인 여부"와
 * "등급(userGradeSortOrd)" 두 가지만으로 판단한다 (TN_MNU_M001.login_required_yn / required_grade_cd 참고).
 */
public class UserPrincipal implements UserDetails {

    private final String loginId;
    private final String password;
    private final String sysId;
    private final String userGradeCd;
    private final int userGradeSortOrd;

    public UserPrincipal(String loginId, String password, String sysId, String userGradeCd, int userGradeSortOrd) {
        this.loginId = loginId;
        this.password = password;
        this.sysId = sysId;
        this.userGradeCd = userGradeCd;
        this.userGradeSortOrd = userGradeSortOrd;
    }

    public String getSysId() {
        return sysId;
    }

    public String getUserGradeCd() {
        return userGradeCd;
    }

    /** 등급 비교용 정수 - 값이 클수록 상위 등급 (USR_GRADE_CD 공통코드의 sort_ord). */
    public int getUserGradeSortOrd() {
        return userGradeSortOrd;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return loginId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
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
