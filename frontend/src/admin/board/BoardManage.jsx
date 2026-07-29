import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useBoardManage } from './hooks/useBoardManage';

const BoardManage = () => {
    const navigate = useNavigate();
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, delYn } = useMenuAuth(MENU_IDS.BOARD);

    const {
        managingList,
        boardTypeList,
        searchParams,
        setSearchParams,
        handleSearch,
        handleResetSearch,
        deleteBoard
    } = useBoardManage(defaultSysId, inqireYn);

    const handleMasterDelete = async (brdId) => {
        if (delYn !== 'Y') { alert('권한이 없습니다.'); return; }
        await deleteBoard(brdId);
    };

    const getBrdTypeName = (brdTypeCd) => {
        const found = boardTypeList.find(t => t.comCd === brdTypeCd);
        return found ? found.cdNm : brdTypeCd;
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다. 관리자에게 문의하세요.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            {/* 상단 검색 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '10px 24px' }}>
                    <span className="admin-card-title">게시판 관리</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>게시판 구분:</span>
                        <select
                            className="admin-input"
                            style={{ padding: '4px 8px', width: '150px' }}
                            value={searchParams.brdType}
                            onChange={e => setSearchParams({ ...searchParams, brdType: e.target.value })}
                        >
                            <option value="">전체</option>
                            {boardTypeList.map(t => (
                                <option key={t.comCd} value={t.comCd}>{t.cdNm}</option>
                            ))}
                        </select>

                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 8px' }}></div>

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>게시판 명칭:</span>
                        <input
                            type="text"
                            className="admin-input"
                            style={{ padding: '4px 8px', width: '200px' }}
                            placeholder="게시판 명칭 검색"
                            value={searchParams.brdNm}
                            onChange={e => setSearchParams({ ...searchParams, brdNm: e.target.value })}
                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        />

                        <button type="button" onClick={handleSearch} className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleResetSearch} className="admin-btn admin-btn-secondary">초기화</button>
                    </div>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title">게시판 목록 (총 {managingList.length}건)</span>
                    {rgstYn === 'Y' && <button onClick={() => navigate('/admin/board/write')} className="admin-btn admin-btn-primary" style={{ padding: '6px 16px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 게시판 등록</button>}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>게시판 ID</th>
                                <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>게시판 명칭</th>
                                <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>게시판 구분</th>
                                <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>등록자</th>
                                <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>등록일시</th>
                                <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>상태</th>
                                {delYn === 'Y' && <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)', width: '80px' }}>관리</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {managingList.map(b => (
                                <tr key={b.brdId} onClick={() => navigate(`/admin/board/write?brdId=${b.brdId}`)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }} className="admin-table-row-hover">
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{b.brdId}</td>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>{b.brdNm}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ background: '#eef2f3', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#2c3e50', fontWeight: '500' }}>
                                            {getBrdTypeName(b.brdType)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{b.frstRgstrId || '-'}</td>
                                    <td style={{ padding: '10px' }}>{b.frstRegDt ? new Date(b.frstRegDt).toLocaleString() : '-'}</td>
                                    <td style={{ padding: '10px', color: b.delYn === 'Y' ? '#e74c3c' : (b.useYn === 'Y' ? '#27ae60' : '#7f8c8d'), fontWeight: 'bold' }}>
                                        {b.delYn === 'Y' ? '삭제됨' : (b.useYn === 'Y' ? '정상' : '사용중지')}
                                    </td>
                                    {delYn === 'Y' && (
                                        <td style={{ padding: '6px' }}>
                                            <button onClick={(e) => { e.stopPropagation(); handleMasterDelete(b.brdId); }} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }}>삭제</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {managingList.length === 0 && <tr><td colSpan={delYn === 'Y' ? 7 : 6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>게시판 목록이 없습니다.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BoardManage;
