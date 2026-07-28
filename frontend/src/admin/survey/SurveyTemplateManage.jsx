import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';
import Pagination from '../../components/common/Pagination';

const SurveyTemplateManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const [surveyList, setSurveyList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;
    const navigate = useNavigate();
    const { inqireYn, rgstYn, delYn } = useMenuAuth();

    // 검색 상태
    const [searchForm, setSearchForm] = useState({ survIdSearch: '', survNm: '' });

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchSurveyList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, inqireYn]);

    const fetchSurveyList = async () => {
        const res = await apiClient('/admin/api/survey/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sysId: defaultSysId, page, limit, templateYn: 'Y',
                survIdSearch: searchForm.survIdSearch,
                survNm: searchForm.survNm
            })
        });
        if (res.ok) {
            const data = await res.json();
            setSurveyList(data.list);
            setTotal(data.total);
        }
    };

    const handleDelete = async (survId) => {
        if (delYn !== 'Y') { alert('삭제 권한이 없습니다.'); return; }
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/survey/delete/${survId}?sysId=${defaultSysId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("삭제되었습니다.");
            fetchSurveyList();
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchSurveyList();
    };

    const handleSearchReset = () => {
        setSearchForm({ survIdSearch: '', survNm: '' });
        setPage(1);
        apiClient('/admin/api/survey/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, page: 1, limit, templateYn: 'Y', survIdSearch: '', survNm: '' })
        }).then(async res => {
            if (res.ok) {
                const data = await res.json();
                setSurveyList(data.list);
                setTotal(data.total);
            }
        });
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            {/* 상단 검색 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '10px 24px' }}>
                    <span className="admin-card-title">설문지 관리</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>설문 ID:</span>
                        <input type="text" className="admin-input" style={{ padding: '4px 8px', width: '160px' }} value={searchForm.survIdSearch} onChange={e => setSearchForm({ ...searchForm, survIdSearch: e.target.value })} onKeyPress={e => e.key === 'Enter' && handleSearch()} />

                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 8px' }}></div>

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>제목:</span>
                        <input type="text" className="admin-input" style={{ padding: '4px 8px', width: '200px' }} value={searchForm.survNm} onChange={e => setSearchForm({ ...searchForm, survNm: e.target.value })} onKeyPress={e => e.key === 'Enter' && handleSearch()} />

                        <button type="button" onClick={handleSearch} className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleSearchReset} className="admin-btn admin-btn-secondary">초기화</button>
                    </div>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title">설문지 목록 (총 {total}건)</span>
                    {rgstYn === 'Y' && (
                        <button onClick={() => navigate('/admin/survey/template/write')} className="admin-btn admin-btn-primary" style={{ padding: '6px 16px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 설문지 등록</button>
                    )}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px' }}>구분</th>
                                <th style={{ padding: '12px' }}>설문 ID</th>
                                <th style={{ padding: '12px' }}>제목</th>
                                <th style={{ padding: '12px' }}>사용여부</th>
                                <th style={{ padding: '12px' }}>기간</th>
                                <th style={{ padding: '12px' }}>등록자</th>
                                <th style={{ padding: '12px' }}>등록일자</th>
                                {delYn === 'Y' && <th style={{ padding: '12px' }}>관리</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {surveyList.map(row => (
                                <tr key={row.survId} style={{ borderBottom: '1px solid var(--border-color, #eee)' }} className="admin-table-row-hover">
                                    <td style={{ padding: '12px' }}>
                                        {row.templateYn === 'Y'
                                            ? <span style={{ background: '#e67e22', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>템플릿</span>
                                            : <span style={{ background: '#2ecc71', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>일반설문</span>}
                                    </td>
                                    <td style={{ padding: '12px' }}>{row.survId}</td>
                                    <td style={{ padding: '12px', textAlign: 'left', color: '#2980b9', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate(`/admin/survey/template/write?survId=${row.survId}`)}>{row.survNm}</td>
                                    <td style={{ padding: '12px', color: row.useYn === 'Y' ? '#2ecc71' : '#e74c3c' }}>{row.useYn === 'Y' ? '사용' : '미사용'}</td>
                                    <td style={{ padding: '12px', fontSize: '13px' }}>
                                        {row.startDt ? new Date(row.startDt).toLocaleDateString() : '지정안됨'} ~ {row.endDt ? new Date(row.endDt).toLocaleDateString() : '지정안됨'}
                                    </td>
                                    <td style={{ padding: '12px' }}>{row.frstRgstrNm || row.frstRgstrId || '-'}</td>
                                    <td style={{ padding: '12px' }}>{row.frstRegDt ? new Date(row.frstRegDt).toLocaleDateString() : '-'}</td>
                                    {delYn === 'Y' && (
                                        <td style={{ padding: '12px' }}>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(row.survId); }} className="admin-btn admin-btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>삭제</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {surveyList.length === 0 && (
                                <tr><td colSpan={delYn === 'Y' ? 8 : 7} style={{ padding: '30px', textAlign: 'center', color: '#95a5a6' }}>등록된 설문지가 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SurveyTemplateManage;
