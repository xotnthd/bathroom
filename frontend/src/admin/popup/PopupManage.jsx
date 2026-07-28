import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonCodePicker from '../../components/CommonCodePicker';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { usePopupManage } from './hooks/usePopupManage';

const PopupManage = () => {
    const navigate = useNavigate();
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn } = useMenuAuth();

    const {
        searchForm, setSearchForm, initialSearch,
        popupList, fetchPopupList
    } = usePopupManage(defaultSysId);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchPopupList(initialSearch);
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchPopupList(searchForm);
    };

    const handleSearchReset = () => {
        setSearchForm(initialSearch);
        fetchPopupList(initialSearch);
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            {/* 상단 검색 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                    <span className="admin-card-title">팝업 관리</span>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', rowGap: '10px', margin: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>시스템 구분:</span>
                            <CommonCodePicker
                                grpCd="SYS_SE_CD"
                                type="radio"
                                name="searchSysSeCd"
                                value={searchForm.searchSysSeCd}
                                onChange={(e) => {
                                    const newForm = { ...searchForm, searchSysSeCd: e.target.value };
                                    setSearchForm(newForm);
                                    fetchPopupList(newForm);
                                }}
                            />
                        </div>
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 8px', flexShrink: 0 }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>노출 기간:</span>
                            <input type="date" className="admin-input" style={{ padding: '4px 8px', width: '150px' }} value={searchForm.searchStDate} onChange={(e) => setSearchForm({ ...searchForm, searchStDate: e.target.value })} />
                            <span style={{ color: 'var(--text-secondary)' }}>~</span>
                            <input type="date" className="admin-input" style={{ padding: '4px 8px', width: '150px' }} value={searchForm.searchEdDate} onChange={(e) => setSearchForm({ ...searchForm, searchEdDate: e.target.value })} />
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button type="submit" className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                            <button type="button" onClick={handleSearchReset} className="admin-btn admin-btn-secondary">초기화</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="admin-card" style={{ flex: 1 }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">팝업 목록 (총 {popupList.length}건)</span>
                    {rgstYn === 'Y' && <button onClick={() => navigate('/admin/popup/write')} className="admin-btn admin-btn-primary">+ 팝업 등록</button>}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        <thead>
                            <tr style={{ background: 'var(--table-header-bg)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px', width: '5%', textAlign: 'center' }}>ID</th>
                                <th style={{ padding: '10px', width: '8%', textAlign: 'center' }}>구분</th>
                                <th style={{ padding: '10px', width: '30%', textAlign: 'center' }}>팝업 제목</th>
                                <th style={{ padding: '10px', width: '12%', textAlign: 'center' }}>노출 기간</th>
                                <th style={{ padding: '10px', width: '15%', textAlign: 'center' }}>매핑된 설문</th>
                                <th style={{ padding: '10px', width: '6%', textAlign: 'center' }}>첨부파일</th>
                                <th style={{ padding: '10px', width: '6%', textAlign: 'center' }}>사용 여부</th>
                                <th style={{ padding: '10px', width: '8%', textAlign: 'center' }}>등록자</th>
                                <th style={{ padding: '10px', width: '10%', textAlign: 'center' }}>등록일자</th>
                            </tr>
                        </thead>
                        <tbody>
                        {popupList.map(item => (
                            <tr
                                key={item.popIdx}
                                onClick={() => navigate(`/admin/popup/write?popIdx=${item.popIdx}`)}
                                style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', height: '48px' }}
                                className="admin-table-row-hover"
                            >
                                <td style={{ padding: '4px 10px' }}>{item.popIdx}</td>
                                <td style={{ padding: '4px 10px' }}>
                                    <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                        {item.sysSeCd === 'US' ? '사용자' : '관리자'}
                                    </span>
                                </td>
                                <td style={{ padding: '4px 10px', textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-all' }}>
                                    <div style={{ color: 'var(--text-primary)' }} title={item.popTitl}>{truncateText(item.popTitl, 23)}</div>
                                </td>
                                <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{item.bgngYmd} ~ {item.endYmd}</td>
                                <td style={{ padding: '4px 10px', textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-all', lineHeight: '1.4' }}>
                                    {item.survNm ? (
                                        <div style={{ color: 'var(--text-primary)' }} title={item.survNm}>
                                            {truncateText(item.survNm, 23)}<br/>
                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>[{item.survId}]</span>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--text-secondary)' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '4px 10px' }}>{item.fileGrpId ? 'O' : '-'}</td>
                                <td style={{ padding: '4px 10px' }}>
                                    <span style={{
                                        padding: '4px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                                        background: item.useYn === 'Y' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                        color: item.useYn === 'Y' ? '#2ecc71' : '#e74c3c'
                                    }}>
                                        {item.useYn === 'Y' ? '사용' : '미사용'}
                                    </span>
                                </td>
                                <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{item.frstRgstrId || '-'}</td>
                                <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{item.frstRegDt ? item.frstRegDt.substring(0, 10) : '-'}</td>
                            </tr>
                        ))}
                        {popupList.length === 0 && (
                            <tr><td colSpan="9" style={{ padding: '40px', color: 'var(--text-secondary)' }}>등록된 팝업이 없습니다.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PopupManage;
