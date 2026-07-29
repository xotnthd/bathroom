import React from 'react';
import { useMenuAuth } from './hooks/useMenuAuth';

/**
 * "화면 진입 자체를 막아야 하는" 조회 권한 체크를 공통으로 처리하는 게이트.
 * DynamicMenuResolver가 DB로 등록된 화면을 렌더링할 때 자동으로 이걸로 감싸주므로,
 * 새로 등록되는 화면은 컴포넌트 안에서 따로 useMenuAuth(menuId)를 호출해 조회 권한을 체크하지 않아도 된다.
 *
 * 등록/수정/삭제 버튼 노출 여부처럼 화면 내부의 세부 권한(rgstYn/mdfcnYn/delYn)은 이 게이트가 다루지 않는다 -
 * 그건 화면이 필요할 때 직접 useMenuAuth(menuId)를 호출해서 판단한다 (menuId는 admin/menuIds.js 상수 사용 권장).
 */
const MenuGate = ({ menuId, children }) => {
    const { inqireYn } = useMenuAuth(menuId);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    return children;
};

export default MenuGate;
