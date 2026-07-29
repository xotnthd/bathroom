import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

/**
 * 하위 페이지 컴포넌트에서 동적으로 CRUD 권한을 가져오고,
 * 화면 진입 가능 여부(show_yn)를 판단하여 리다이렉트 처리하는 커스텀 훅
 *
 * @param {string} [menuId] - TN_MNU_M001.menu_id. 넘기면 정확히 그 메뉴로 조회한다 (권장 - admin/menuIds.js 상수 사용).
 *   생략하면 현재 경로(location.pathname)와 menuAuths의 menuUrl을 prefix 매칭해서 추측한다 - 이 방식은
 *   동적 게시판처럼 화면 하나가 여러 menu_id를 오갈 수 있는 특수 케이스에서만 남겨둔 레거시 경로다.
 *   새 화면은 반드시 menuId를 명시할 것 (URL 모양에 권한 체크가 얽히면 2026-07-28 투표결과 화면 사고가 재발한다).
 */
export const useMenuAuth = (menuId) => {
    const { menuAuths } = useOutletContext() || { menuAuths: [] };
    const location = useLocation();
    const navigate = useNavigate();

    const currentAuth = useMemo(() => {
        if (!menuAuths || menuAuths.length === 0) return null;

        if (menuId) {
            return menuAuths.find(m => m.menuId === menuId) || null;
        }

        // 레거시 경로 (menuId 미지정 - 동적 게시판 등 화면 하나에 menu_id가 여러 개 대응되는 경우 전용):
        // 현재 경로와 정확히 일치하거나, 상위 경로로 시작하는 메뉴 찾기 (가장 긴 경로 우선)
        const matchedMenus = menuAuths
            .filter(m => m.menuUrl && location.pathname.startsWith(m.menuUrl))
            .sort((a, b) => b.menuUrl.length - a.menuUrl.length);

        return matchedMenus.length > 0 ? matchedMenus[0] : null;
    }, [menuAuths, location.pathname, menuId]);

    // 메뉴 접근 권한 체크 로직
    useEffect(() => {
        // 데이터 로드 전이면 대기
        if (!menuAuths || menuAuths.length === 0) return;

        // 매칭되는 메뉴가 없거나(비정상 접근) 보여주기 권한이 없는 경우
        // 단, /admin/dashboard 등 예외 라우트일 경우 통과시키려면 여기를 수정해야 할 수 있음.
        if (!currentAuth || currentAuth.menuShowYn !== 'Y') {
            alert("접근 권한이 없습니다.");
            navigate('/admin/dashboard', { replace: true });
        }
    }, [currentAuth, menuAuths, navigate]);

    // 반환 객체 (기본값 제공)
    if (!currentAuth) {
        return {
            inqireYn: 'N',
            rgstYn: 'N',
            mdfcnYn: 'N',
            delYn: 'N'
        };
    }

    return {
        inqireYn: currentAuth.inqireYn || 'N',
        rgstYn: currentAuth.rgstYn || 'N',
        mdfcnYn: currentAuth.mdfcnYn || 'N',
        delYn: currentAuth.delYn || 'N',
        menuNm: currentAuth.menuNm || ''
    };
};
