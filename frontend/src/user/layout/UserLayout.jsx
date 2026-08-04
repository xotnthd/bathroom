import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PopupModal from '../../admin/popup/PopupModal';
import { apiClient } from '../../utils/apiClient';
import { buildMenuTree, HeaderNav, SidebarNav } from './UserNav';

const UserLayout = () => {
    const [sysConfig, setSysConfig] = useState(null);
    const [menuTree, setMenuTree] = useState([]);

    useEffect(() => {
        const fetchSysConfig = async () => {
            try {
                const res = await apiClient('/user/api/site/config?sysId=CORE');
                if (res.ok) {
                    const data = await res.json();
                    setSysConfig(data);
                    document.body.className = `theme-${(data.userThemeCd || 'MODERN').toLowerCase()}`;
                }
            } catch (err) {
                console.error("Failed to load sys config", err);
            }
        };
        const fetchMenuTree = async () => {
            try {
                const res = await apiClient('/user/api/site/menu-tree?sysId=CORE');
                if (res.ok) {
                    const flatList = await res.json();
                    setMenuTree(buildMenuTree(flatList));
                }
            } catch (err) {
                console.error("Failed to load menu tree", err);
            }
        };
        fetchSysConfig();
        fetchMenuTree();
    }, []);

    const layoutCd = sysConfig?.userMenuLayoutCd || 'HEADER';

    const Banner = () => (
        sysConfig?.bannerFileSn ? (
            <img
                src={`/user/api/site/file/${sysConfig.bannerFileSn}?sysId=CORE`}
                alt="banner"
                style={{ width: '100%', display: 'block', maxHeight: '260px', objectFit: 'cover' }}
            />
        ) : (
            <div style={{ background: 'var(--primary-color, #3498db)', color: '#fff', padding: '30px 20px', textAlign: 'center' }}>
                <h2 style={{ margin: 0 }}>{sysConfig?.sysNm || '홍보 배너 영역'}</h2>
            </div>
        )
    );

    const Footer = () => (
        <footer style={{ background: 'var(--sidebar-bg, #2c3e50)', color: 'var(--sidebar-color, #bdc3c7)', padding: '20px', textAlign: 'center', fontSize: 'var(--font-size-base, 13px)' }}>
            <p>{sysConfig?.sysNm || 'Core Framework Solution'} | © 2026 User Architecture.</p>
        </footer>
    );

    const LogoOrTitle = () => (
        sysConfig?.logoFileSn ? (
            <img src={`/user/api/site/file/${sysConfig.logoFileSn}?sysId=CORE`} alt="logo" style={{ height: '35px' }} />
        ) : (
            <h2 style={{ margin: 0 }}>Core User Portal</h2>
        )
    );

    if (layoutCd === 'SIDEBAR') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
                <PopupModal sysSeCd="US" />
                <Banner />
                <div style={{ display: 'flex', flex: 1 }}>
                    <aside style={{ width: '220px', flexShrink: 0, background: 'var(--sidebar-bg, #2c3e50)', color: 'var(--sidebar-color, #fff)', padding: '20px 0' }}>
                        <div style={{ padding: '0 20px', marginBottom: '20px' }}><LogoOrTitle /></div>
                        <SidebarNav menuTree={menuTree} />
                    </aside>
                    <main style={{ flex: 1, padding: '20px', background: 'var(--bg-color, #f8f9fa)' }}>
                        <div style={{ background: 'var(--content-bg, #fff)', padding: '20px', borderRadius: 'var(--border-radius, 8px)', boxShadow: 'var(--box-shadow, 0 2px 8px rgba(0,0,0,0.05))', color: 'var(--text-primary)' }}>
                            <Outlet />
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }

    // 기본값: HEADER (상단메뉴형)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <PopupModal sysSeCd="US" />
            <Banner />
            <header style={{ background: 'var(--primary-color, #3498db)', color: 'var(--sidebar-color, #fff)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <LogoOrTitle />
                </div>
                <HeaderNav menuTree={menuTree} />
            </header>

            <main style={{ flex: 1, padding: '20px', background: 'var(--bg-color, #f8f9fa)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'var(--content-bg, #fff)', padding: '20px', borderRadius: 'var(--border-radius, 8px)', boxShadow: 'var(--box-shadow, 0 2px 8px rgba(0,0,0,0.05))', color: 'var(--text-primary)' }}>
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserLayout;
