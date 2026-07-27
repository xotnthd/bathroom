import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { apiClient } from '../utils/apiClient'; // 쿠키 통신용 모듈
import './css/AdminLayout.css';

// 1. 상단 PopupModal 컴포넌트 임포트
import PopupModal from './popup/PopupModal';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. 현재 세션의 sysId (기본은 CORE, 교차 관리시 변경됨)
    const [currentSysId, setCurrentSysId] = useState(sessionStorage.getItem('currentSysId') || 'CORE');

    const [menuTree, setMenuTree] = useState([]);
    const [menuAuths, setMenuAuths] = useState([]);
    const [sysConfig, setSysConfig] = useState(null);
    const [isTrueSuperAdmin, setIsTrueSuperAdmin] = useState(false);

    // 2. 교차 관리용 시스템 목록
    const [systemList, setSystemList] = useState([]);
    const [canSwitchSystem, setCanSwitchSystem] = useState(false);

    // Sidebar collapse state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // 사이드바 1/2단계 그룹 접힘 상태 - 펼쳐진 menuId 집합 (스크롤 과다 방지, 기본은 모두 접힘)
    const [expandedIds, setExpandedIds] = useState(new Set());

    // 세션 사용자 정보 상태
    const [loginId, setLoginId] = useState('');
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (window.location.pathname === '/admin/login') {
            setIsChecking(false);
            return;
        }

        const checkAuthAndInit = async () => {
            try {
                // Fetch sys config first
                const sysRes = await apiClient(`/admin/api/sys/detail/${currentSysId}`);
                if (sysRes.ok) {
                    const sysData = await sysRes.json();
                    setSysConfig(sysData);
                    document.body.className = `theme-${(sysData.adminThemeCd || 'MODERN').toLowerCase()}`;
                }

                const res = await apiClient('/api/auth/check', { method: 'GET' });

                if (res.ok) {
                    const data = await res.json();
                    setLoginId(data.loginId || '알수없음');

                    // S001/SUPR 최고관리자(CORE의 A001) 인 경우 시스템 전환 가능
                    if (data.role === 'S001' || data.role === 'SUPR' || (data.sysId === 'CORE' && data.role === 'A001')) {
                        setCanSwitchSystem(true);
                        fetchSystemListForSwitch();
                    }
                    setIsTrueSuperAdmin(data.role === 'SUPR');

                    // 백엔드에서 넘겨준 권한(role)의 변경에 따라 메뉴 호출 함수를 전달
                    const userRole = data.role;
                    await fnFetchSidebarMenus(userRole, currentSysId);

                    setIsChecking(false);
                } else {
                    alert("로그인이 필요합니다.");
                    window.location.href = '/admin/login';
                }
            } catch (error) {
                window.location.href = '/admin/login';
            }
        };

        checkAuthAndInit();
    }, [currentSysId]);

    const fetchSystemListForSwitch = async () => {
        const res = await apiClient('/admin/api/sys/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchKeyword: '' })
        });
        if (res.ok) setSystemList(await res.json());
    };

    // 매개변수로 athrtyCd를 받아서 URL 뒤에 붙여줍니다.
    const fnFetchSidebarMenus = async (athrtyCd, sysIdToFetch) => {
        try {
            const res = await apiClient(
                '/admin/api/menu/sidebar/list',
                { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sysId: sysIdToFetch, sysSectCd: 'MG', athrtyCd: athrtyCd })
                }
            );
            if (res.ok) {
                const flatData = await res.json();
                setMenuAuths(flatData); // 권한 정보 컨텍스트 전달용
                
                // 사이드바 처리는 menuShowYn === 'Y' 인 것만 구성
                const visibleData = flatData.filter(m => m.menuShowYn === 'Y');
                const treeData = buildMenuTree(visibleData);
                setMenuTree(treeData);
            }
        } catch (err) {
            console.error("사이드바 메뉴 동적 로드 실패:", err);
        }
    };

    const buildMenuTree = (flatList) => {
        const menuMap = {};
        const tree = [];

        flatList.forEach(menu => {
            menuMap[menu.menuId] = { ...menu, children: [] };
        });

        flatList.forEach(menu => {
            if (menu.uprMenuId === 'ROOT') {
                tree.push(menuMap[menu.menuId]);
            } else if (menuMap[menu.uprMenuId]) {
                menuMap[menu.uprMenuId].children.push(menuMap[menu.menuId]);
            }
        });

        return tree;
    };

    // 메뉴 트리가 (재)로드될 때, 현재 페이지가 속한 그룹만 자동으로 펼쳐두고 나머지는 접어서 스크롤을 줄임
    useEffect(() => {
        if (menuTree.length === 0) return;
        const activeAncestors = [];
        const findActiveAncestors = (nodes, ancestors) => {
            for (const node of nodes) {
                if (node.menuUrl && node.menuUrl === location.pathname) {
                    activeAncestors.push(...ancestors);
                    return true;
                }
                if (node.children && node.children.length > 0 && findActiveAncestors(node.children, [...ancestors, node.menuId])) {
                    return true;
                }
            }
            return false;
        };
        findActiveAncestors(menuTree, []);
        if (activeAncestors.length > 0) {
            setExpandedIds(new Set(activeAncestors));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuTree]);

    const toggleExpand = (menuId) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(menuId)) next.delete(menuId); else next.add(menuId);
            return next;
        });
    };

    // 상위(그룹) 메뉴 클릭 시: 자기 URL이 있으면 이동, 없으면(순수 그룹 헤더) 접힘/펼침만 토글
    const handleMenuClick = (menu) => {
        if (menu.menuUrl && menu.menuUrl.trim() !== '' && menu.menuUrl.trim() !== '#') {
            navigate(menu.menuUrl);
            return;
        }
        toggleExpand(menu.menuId);
    };

    // Security 6.x 정책에 맞춰 무조건 POST 통신으로 로그아웃 호출
    const handleLogout = async () => {
        if (!window.confirm("로그아웃 하시겠습니까?")) return;
        try {
            const res = await apiClient('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                window.location.href = '/admin/login';
            }
        } catch (error) {
            console.error("로그아웃 통신 에러", error);
        }
    };

    // 권한 체크 중일 때는 화면에 로딩창 호출
    if (isChecking) return null;

    return (
        <div className="admin-container">

            {/* 
                여기가 [핵심] 팝업 컴포넌트를 마운트합니다.
                div.admin-container의 바로 아래에 위치하여 화면 최상단 레이어로 띄웁니다.
                sysSeCd="MG" 속성을 주어 관리자용 팝업을 불러옵니다.
            */}
            <PopupModal sysSeCd="MG" />

            <header className="admin-header">
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'none', border: 'none', color: 'inherit', fontSize: '20px', cursor: 'pointer', padding: '0 10px' }}>☰</button>
                    {sysConfig?.logoFileSn ? (
                        <img src={`/admin/api/comn/file/download/${sysConfig.logoFileSn}`} alt="logo" style={{ height: '30px' }} />
                    ) : (
                        <h2>{sysConfig?.sysNm || 'Admin System'}</h2>
                    )}
                </div>
                <div className="header-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {canSwitchSystem && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f8f9fa', padding: '4px 10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>시스템 전환:</span>
                            <select 
                                value={currentSysId} 
                                onChange={(e) => {
                                    sessionStorage.setItem('currentSysId', e.target.value);
                                    window.location.reload();
                                }}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', color: '#2c3e50' }}
                            >
                                {systemList.map(sys => (
                                    <option key={sys.sysId} value={sys.sysId}>{sys.sysNm} ({sys.sysId})</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <a href="/user/board/view/NOTICE_01" target="_blank" rel="noreferrer" style={{ color: '#3498db', background: '#fff', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>사용자 화면 테스트</a>
                    <span>접속자 <strong>{loginId}</strong> 님</span>
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            </header>

            <div className="admin-main-wrapper">
                <aside className="admin-sidebar" style={{ width: sidebarCollapsed ? '60px' : '260px', transition: 'width 0.3s ease', background: 'var(--sidebar-bg, #2c3e50)', padding: '1rem', color: 'var(--sidebar-color, #fff)', overflowY: 'auto' }}>

                    {menuTree.map(mainMenu => {
                        const mainExpanded = expandedIds.has(mainMenu.menuId);
                        const mainHasOwnUrl = mainMenu.menuUrl && mainMenu.menuUrl.trim() !== '' && mainMenu.menuUrl.trim() !== '#';
                        return (
                        <div key={mainMenu.menuId} style={{ marginBottom: '1.5rem' }}>
                            <h3
                                onClick={() => handleMenuClick(mainMenu)}
                                style={{ fontSize: '15px', color: '#bdc3c7', borderBottom: '1px solid #34495e', paddingBottom: '8px', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#bdc3c7'}
                            >
                                <span>{mainMenu.menuNm}</span>
                                {!mainHasOwnUrl && <span style={{ fontSize: '11px', transition: 'transform 0.2s', transform: mainExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>}
                            </h3>

                            {mainExpanded && mainMenu.children.map(midMenu => {
                                const midExpanded = expandedIds.has(midMenu.menuId);
                                const midHasOwnUrl = midMenu.menuUrl && midMenu.menuUrl.trim() !== '' && midMenu.menuUrl.trim() !== '#';
                                return (
                                <div key={midMenu.menuId} style={{ marginBottom: '1rem' }}>
                                    <div
                                        onClick={() => handleMenuClick(midMenu)}
                                        style={{ fontSize: '13px', fontWeight: 'bold', color: '#ecf0f1', marginBottom: '5px', paddingLeft: '5px', cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                        onMouseOver={(e) => e.currentTarget.style.color = '#3498db'}
                                        onMouseOut={(e) => e.currentTarget.style.color = '#ecf0f1'}
                                    >
                                        <span>{midMenu.menuNm}</span>
                                        {!midHasOwnUrl && midMenu.children.length > 0 && <span style={{ fontSize: '10px', transition: 'transform 0.2s', transform: midExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>}
                                    </div>

                                    {midExpanded && (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {midMenu.children.map(subMenu => {
                                                const isActive = location.pathname === subMenu.menuUrl;
                                                return (
                                                    <li key={subMenu.menuId} style={{ marginBottom: '2px' }}>
                                                        <Link
                                                            to={subMenu.menuUrl || '#'}
                                                            style={{
                                                                display: 'block',
                                                                padding: '8px 10px 8px 15px',
                                                                fontSize: '13px',
                                                                color: isActive ? 'var(--primary-color, #fff)' : '#95a5a6',
                                                                textDecoration: 'none',
                                                                background: isActive ? 'rgba(0,0,0,0.2)' : 'transparent',
                                                                borderRadius: 'var(--border-radius, 4px)',
                                                                transition: 'all 0.2s ease',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {sidebarCollapsed ? '-' : subMenu.menuNm}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                        );
                    })}

                    {menuTree.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '13px', marginTop: '20px' }}>
                            초기화된 시스템 메뉴가 없습니다.
                        </div>
                    )}
                </aside>

                <main className="admin-body">
                    <Outlet key={currentSysId} context={{ menuAuths, sysConfig, isTrueSuperAdmin }} />
                </main>
            </div>

            <footer className="admin-footer">
                <p>Core Framework Solution | © 2026 Admin Architecture.</p>
            </footer>
        </div>
    );
};

export default AdminLayout;
