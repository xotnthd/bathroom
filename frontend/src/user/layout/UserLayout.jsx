import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import PopupModal from '../../admin/popup/PopupModal';
import { apiClient } from '../../utils/apiClient';

const UserLayout = () => {
    const [sysConfig, setSysConfig] = useState(null);

    useEffect(() => {
        const fetchSysConfig = async () => {
            try {
                const res = await apiClient('/admin/api/sys/detail/CORE');
                if (res.ok) {
                    const data = await res.json();
                    setSysConfig(data);
                    document.body.className = `theme-${(data.userThemeCd || 'MODERN').toLowerCase()}`;
                }
            } catch (err) {
                console.error("Failed to load sys config", err);
            }
        };
        fetchSysConfig();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <PopupModal sysSeCd="US" />
            <header style={{ background: 'var(--primary-color, #3498db)', color: 'var(--sidebar-color, #fff)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {sysConfig?.logoFileSn ? (
                        <img src={`/admin/api/comn/file/download/${sysConfig.logoFileSn}`} alt="logo" style={{ height: '35px' }} />
                    ) : (
                        <h2 style={{ margin: 0, color: 'var(--sidebar-color, #fff)' }}>Core User Portal</h2>
                    )}
                </div>
                <nav>
                    {/* 사용자용 메뉴 트리나 GNB가 들어갈 자리 */}
                    <Link to="/user/board/view/NOTICE_01" style={{ color: '#fff', textDecoration: 'none', marginLeft: '15px', fontWeight: 'bold' }}>공지사항</Link>
                    <Link to="/user/board/view/GALLERY_01" style={{ color: '#fff', textDecoration: 'none', marginLeft: '15px', fontWeight: 'bold' }}>갤러리</Link>
                    <Link to="/user/board/view/FAQ_01" style={{ color: '#fff', textDecoration: 'none', marginLeft: '15px', fontWeight: 'bold' }}>FAQ</Link>
                    <Link to="/admin" style={{ color: '#ecf0f1', textDecoration: 'underline', marginLeft: '30px', fontSize: '13px' }}>관리자 모드 이동</Link>
                </nav>
            </header>
            
            <main style={{ flex: 1, padding: '20px', background: 'var(--bg-color, #f8f9fa)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'var(--content-bg, #fff)', padding: '20px', borderRadius: 'var(--border-radius, 8px)', boxShadow: 'var(--box-shadow, 0 2px 8px rgba(0,0,0,0.05))', color: 'var(--text-primary)' }}>
                    <Outlet />
                </div>
            </main>
            
            <footer style={{ background: 'var(--sidebar-bg, #2c3e50)', color: 'var(--sidebar-color, #bdc3c7)', padding: '20px', textAlign: 'center', fontSize: 'var(--font-size-base, 13px)' }}>
                <p>{sysConfig?.sysNm || 'Core Framework Solution'} | © 2026 User Architecture.</p>
            </footer>
        </div>
    );
};

export default UserLayout;
