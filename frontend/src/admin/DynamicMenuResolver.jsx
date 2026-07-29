import React, { Suspense } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import MenuGate from './MenuGate';
import { resolveDynamicComponent } from './dynamicComponents';

/**
 * App.js의 "admin" 하위 라우트 목록 맨 끝에 있는 catch-all(path="*") 라우트가 렌더링하는 컴포넌트.
 * 화면마다 App.js에 <Route>를 한 줄씩 손으로 추가하던 방식 대신, 여기서 현재 경로(location.pathname)와
 * 정확히 일치하는 menu_url을 가진 메뉴를 menuAuths(사이드바 API 응답, AdminLayout이 Outlet context로 내려줌)에서
 * 찾아 그 메뉴의 comp_path로 화면을 동적으로 렌더링한다.
 *
 * 주의: 여기서의 menu_url 비교는 "어떤 화면 컴포넌트를 그릴지" 결정하는 용도일 뿐이고, 조회 권한 체크는
 * 전적으로 MenuGate(menuId 기반)가 담당한다 - menu_url 문자열에 권한을 실어 보내지 않는다
 * (2026-07-28 투표결과 화면 사고 이후 확립된 원칙, backend_architecture.md 참고).
 *
 * write/detail처럼 메뉴로 직접 등록되지 않은 화면, 동적 게시판(brdId별)처럼 이미 자체 라우트가 있는 화면은
 * App.js에 더 구체적인 <Route>가 그대로 남아있어서 이 catch-all보다 먼저 매칭되므로 여기까지 오지 않는다.
 */
const DynamicMenuResolver = () => {
    const location = useLocation();
    const { menuAuths } = useOutletContext() || { menuAuths: [] };

    const matched = (menuAuths || []).find(m => m.menuUrl === location.pathname);

    if (!matched || !matched.compPath) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
                요청한 화면을 찾을 수 없습니다.
            </div>
        );
    }

    const LazyScreen = resolveDynamicComponent(matched.compPath);

    if (!LazyScreen) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
                화면 컴포넌트를 불러올 수 없습니다. (comp_path: {matched.compPath})
            </div>
        );
    }

    return (
        <MenuGate menuId={matched.menuId}>
            <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>불러오는 중...</div>}>
                <LazyScreen />
            </Suspense>
        </MenuGate>
    );
};

export default DynamicMenuResolver;
