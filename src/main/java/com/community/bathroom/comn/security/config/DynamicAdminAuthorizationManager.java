package com.community.bathroom.comn.security.config;

import com.community.bathroom.comn.security.mapper.SecurityMapper;
import com.community.bathroom.comn.security.model.AdminPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

@Component
public class DynamicAdminAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    @Autowired
    private SecurityMapper securityMapper;

    // 인메모리 권한 캐시 (Role -> 관리자 메뉴 접근 가능 여부)
    // 매 요청마다 DB를 조회하는 것을 방지하기 위해 권한결과를 메모리에 임시 저장합니다.
    private final Map<String, Boolean> adminAccessCache = new ConcurrentHashMap<>();

    /**
     * 권한 매트릭스 설정이 변경되거나 권한이 추가/삭제될 때 호출되어 캐시를 비워줍니다.
     * 캐시가 비워지면 다음 요청 시 최신 DB 상태를 다시 읽어옵니다.
     */
    public void clearCache() {
        adminAccessCache.clear();
    }

    @Override
    public AuthorizationDecision authorize(Supplier<? extends Authentication> authenticationSupplier, RequestAuthorizationContext context) {
        return authorizeCheck(authenticationSupplier.get());
    }

    private AuthorizationDecision authorizeCheck(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return new AuthorizationDecision(false);
        }

        // S001/SUPR은 TN_ATH_M001에 매핑된 메뉴가 하나도 없어도(신규 부트스트랩 직후 등) 전체 관리자 API 접근이 허용되어야 한다.
        // TenantGuardAspect의 바이패스와 동일한 판단 기준 - 실제 화면별 세부 권한은 그쪽에서 다시 한 번 걸러진다.
        if (auth.getPrincipal() instanceof AdminPrincipal principal && (principal.isSuperAdmin() || principal.isTrueSuperAdmin())) {
            return new AuthorizationDecision(true);
        }

        // 유저가 가진 모든 권한 코드를 순회하며 해당 권한이 관리자(MG) 메뉴에 매핑된 권한인지 검사
        for (GrantedAuthority authority : auth.getAuthorities()) {
            String role = authority.getAuthority();
            
            // 1. 캐시에서 해당 권한(role)의 접근 가능 여부를 먼저 확인하고, 
            // 2. 캐시에 값이 없다면 DB(securityMapper.countAdminMenuByRole)를 조회하여 결과를 캐시에 저장(computeIfAbsent)합니다.
            Boolean hasAdminAccess = adminAccessCache.computeIfAbsent(role, r -> {
                int adminMenuCount = securityMapper.countAdminMenuByRole(r);
                return adminMenuCount > 0;
            });

            if (hasAdminAccess) {
                return new AuthorizationDecision(true); // 통과
            }
        }

        return new AuthorizationDecision(false); // 관리자 메뉴 매핑이 전혀 없으면 차단
    }
}
