import React, { Suspense } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import MenuGate from './MenuGate';
import { resolveDynamicComponent } from './dynamicComponents';

/**
 * App.js의 "admin" 하위 라우트 목록 맨 끝에 있는 catch-all(path="*") 라우트가 렌더링하는 컴포넌트.
 * 화면마다 App.js에 <Route>를 한 줄씩 손으로 추가하던 방식 대신, 여기서 현재 경로(location.pathname)와
 * 정확히 일치하는 menu_url(목록) 또는 detail_menu_url(상세/쓰기)을 가진 메뉴를 menuAuths(사이드바 API 응답,
 * AdminLayout이 Outlet context로 내려줌)에서 찾아 그 메뉴의 comp_path/detail_comp_path로 화면을 동적으로 렌더링한다.
 *
 * 주의: 여기서의 menu_url/detail_menu_url 비교는 "어떤 화면 컴포넌트를 그릴지" 결정하는 용도일 뿐이고,
 * 조회 권한 체크는 전적으로 MenuGate(menuId 기반)가 담당한다 - URL 문자열에 권한을 실어 보내지 않는다
 * (2026-07-28 투표결과 화면 사고 이후 확립된 원칙, backend_architecture.md 참고).
 *
 * 상세/쓰기 화면 중에서도 survey/result/:survId처럼 ID를 경로 파라미터로 받는 화면은 고정된 문자열로
 * 매칭할 수 없어 여전히 App.js에 하드코딩된 <Route>로 남아있다 - 그런 화면은 이 catch-all보다 먼저
 * 매칭되므로 여기까지 오지 않는다. 동적 게시판(brdId별)도 마찬가지.
 */
const DynamicMenuResolver = () => {
    const location = useLocation();
    const { menuAuths } = useOutletContext() || { menuAuths: [] };

    const list = menuAuths || [];
    const listMatch = list.find(m => m.menuUrl === location.pathname);
    const detailMatch = list.find(m => m.detailMenuUrl === location.pathname);
    const matched = listMatch || detailMatch;
    const targetCompPath = listMatch ? listMatch.compPath : (detailMatch ? detailMatch.detailCompPath : null);

    if (!matched || !targetCompPath) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
                요청한 화면을 찾을 수 없습니다.
            </div>
        );
    }

    const LazyScreen = resolveDynamicComponent(targetCompPath);

    if (!LazyScreen) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
                화면 컴포넌트를 불러올 수 없습니다. (comp_path: {targetCompPath})
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
