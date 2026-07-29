import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useAdminCorpManage } from './hooks/useAdminCorpManage';

const AdminCorpManage = () => {
    const navigate = useNavigate();
    const { inqireYn, rgstYn, delYn } = useMenuAuth(MENU_IDS.CORP);
    const { corpList, fetchCorpList, deleteCorp } = useAdminCorpManage();

    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchCorpList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleSearch = () => fetchCorpList(searchKeyword);
    const handleReset = () => { setSearchKeyword(''); fetchCorpList(''); };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '10px 24px' }}>
                    <span className="admin-card-title">업체 관리</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>업체명:</span>
                        <input
                            type="text"
                            className="admin-input"
                            style={{ padding: '4px 8px', width: '220px' }}
                            placeholder="업체명 검색"
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button type="button" onClick={handleSearch} className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleReset} className="admin-btn admin-btn-secondary">초기화</button>
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title">업체 목록 (총 {corpList.length}건)</span>
                    {rgstYn === 'Y' && (
                        <button onClick={() => navigate('/admin/corp/write')} className="admin-btn admin-btn-primary" style={{ padding: '6px 16px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 업체 등록</button>
                    )}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left', paddingLeft: '20px' }}>업체명</th>
                                <th style={{ padding: '12px' }}>사업자등록번호</th>
                                <th style={{ padding: '12px' }}>대표자</th>
                                <th style={{ padding: '12px' }}>대표 전화번호</th>
                                <th style={{ padding: '12px' }}>사용</th>
                                {delYn === 'Y' && <th style={{ padding: '12px' }}>관리</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {corpList.map(c => (
                                <tr key={c.idx} onClick={() => navigate(`/admin/corp/write?idx=${c.idx}`)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color, #eee)' }} className="admin-table-row-hover">
                                    <td style={{ padding: '12px', paddingLeft: '20px', textAlign: 'left', color: '#2980b9', fontWeight: 500 }}>{c.corpNm}</td>
                                    <td style={{ padding: '12px' }}>{c.bizRegNo || '-'}</td>
                                    <td style={{ padding: '12px' }}>{c.ceoNm || '-'}</td>
                                    <td style={{ padding: '12px' }}>{c.corpTelno || '-'}</td>
                                    <td style={{ padding: '12px', color: c.useYn === 'Y' ? '#2ecc71' : '#95a5a6', fontWeight: 'bold' }}>{c.useYn}</td>
                                    {delYn === 'Y' && (
                                        <td style={{ padding: '12px' }}>
                                            <button className="admin-btn admin-btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); deleteCorp(c.idx); }}>삭제</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {corpList.length === 0 && (
                                <tr><td colSpan={delYn === 'Y' ? 6 : 5} style={{ padding: '40px', textAlign: 'center', color: '#95a5a6' }}>등록된 업체가 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCorpManage;
