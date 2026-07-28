import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import CommonCodePicker from '../../components/CommonCodePicker';
import Pagination from '../../components/common/Pagination';

const SurveyResultList = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [searchForm, setSearchForm] = useState({
        sysSeCd: '',
        survNm: '',
        survIdSearch: '',
        useYn: '',
        startDt: '',
        endDt: ''
    });

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const fetchList = async () => {
        const payload = { ...searchForm, sysId: defaultSysId, page, limit: 10 };
        const res = await apiClient('/admin/api/survey/result/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const data = await res.json();
            setList(data.list || []);
            setTotal(data.total || 0);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchList();
    };

    const handleSearchReset = () => {
        setSearchForm({ sysSeCd: '', survNm: '', survIdSearch: '', useYn: '', startDt: '', endDt: '' });
        setPage(1);
    };

    const handleRowClick = (item) => {
        navigate(`/admin/survey/result/${item.survId}`);
    };

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            {/* 상단 검색 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', justifyContent: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
                    <span className="admin-card-title">설문 결과 조회</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>시스템 구분:</span>
                        <CommonCodePicker
                            grpCd="SYS_SE_CD"
                            type="select"
                            name="sysSeCd"
                            value={searchForm.sysSeCd}
                            onChange={(e) => setSearchForm({ ...searchForm, sysSeCd: e.target.value })}
                            defaultOption="전체 시스템"
                        />

                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 8px' }}></div>

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>설문 ID:</span>
                        <input type="text" className="admin-input" style={{ padding: '4px 8px', width: '150px' }} value={searchForm.survIdSearch} onChange={e => setSearchForm({ ...searchForm, survIdSearch: e.target.value })} onKeyPress={e => e.key === 'Enter' && handleSearch()} />

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>제목:</span>
                        <input type="text" className="admin-input" style={{ padding: '4px 8px', width: '200px' }} value={searchForm.survNm} onChange={e => setSearchForm({ ...searchForm, survNm: e.target.value })} onKeyPress={e => e.key === 'Enter' && handleSearch()} />

                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 8px' }}></div>

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>사용여부:</span>
                        <CommonCodePicker
                            grpCd="USE_YN"
                            type="select"
                            name="useYn"
                            value={searchForm.useYn}
                            onChange={(e) => setSearchForm({ ...searchForm, useYn: e.target.value })}
                            defaultOption="전체"
                        />

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>제출 기간:</span>
                        <input type="date" className="admin-input" style={{ padding: '4px 8px', width: '150px' }} value={searchForm.startDt} onChange={e => setSearchForm({ ...searchForm, startDt: e.target.value })} />
                        <span style={{ color: 'var(--text-secondary)' }}>~</span>
                        <input type="date" className="admin-input" style={{ padding: '4px 8px', width: '150px' }} value={searchForm.endDt} onChange={e => setSearchForm({ ...searchForm, endDt: e.target.value })} />

                        <button type="button" onClick={handleSearch} className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleSearchReset} className="admin-btn admin-btn-secondary">초기화</button>
                    </div>
                </div>
            </div>

            {/* 리스트 영역 (조회 전용 - 등록 버튼 없음) */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">설문 결과 목록 (총 {total}건)</span>
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px' }}>No</th>
                                <th style={{ padding: '12px' }}>시스템 구분</th>
                                <th style={{ padding: '12px' }}>설문 ID</th>
                                <th style={{ padding: '12px' }}>설문 제목</th>
                                <th style={{ padding: '12px' }}>제출 기간</th>
                                <th style={{ padding: '12px' }}>사용여부</th>
                                <th style={{ padding: '12px' }}>응답수</th>
                                <th style={{ padding: '12px' }}>작성자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((row, idx) => (
                                <tr key={row.survId} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color, #eee)' }} className="admin-table-row-hover">
                                    <td style={{ padding: '12px' }}>{(page - 1) * limit + idx + 1}</td>
                                    <td style={{ padding: '12px' }}>{row.sysSeCd === 'MG' ? '관리자(MG)' : row.sysSeCd === 'US' ? '사용자(US)' : row.sysSeCd}</td>
                                    <td style={{ padding: '12px' }}>{row.survId}</td>
                                    <td style={{ padding: '12px', textAlign: 'left', color: '#2980b9', fontWeight: 'bold' }}>{row.survNm}</td>
                                    <td style={{ padding: '12px', fontSize: '13px' }}>{(row.startDt || '').substring(0, 10)} ~ {(row.endDt || '').substring(0, 10)}</td>
                                    <td style={{ padding: '12px' }}>{row.useYn === 'Y' ? '사용' : '미사용'}</td>
                                    <td style={{ padding: '12px', color: '#e74c3c', fontWeight: 'bold' }}>{row.respCnt}건</td>
                                    <td style={{ padding: '12px' }}>{row.frstRgstrId}</td>
                                </tr>
                            ))}
                            {list.length === 0 && (
                                <tr><td colSpan="8" style={{ padding: '30px', textAlign: 'center', color: '#95a5a6' }}>검색결과가 없습니다.</td></tr>
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

export default SurveyResultList;
