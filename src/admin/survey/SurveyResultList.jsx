import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import DataTable from '../../components/common/DataTable';
import SearchForm from '../../components/common/SearchForm';
import CommonCodePicker from '../../components/CommonCodePicker';

const SurveyResultList = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
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
    }, [page]);

    const fetchList = async () => {
        const payload = { ...searchForm, page, limit: 10 };
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

    const handleSearchChange = (name, value) => {
        setSearchForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchList();
    };

    const handleSearchReset = () => {
        setSearchForm({
            sysSeCd: '',
            survNm: '',
            survIdSearch: '',
            useYn: '',
            startDt: '',
            endDt: ''
        });
        setPage(1);
    };

    const handleRowClick = (item) => {
        navigate(`/admin/survey/result/${item.survId}`);
    };

    const columns = [
        { label: 'No', key: 'no', width: '60px', render: (_, idx) => (page - 1) * 10 + idx + 1 },
        { label: '시스템 구분', key: 'sysSeCd', width: '120px', render: (row) => row.sysSeCd === 'MG' ? '관리자(MG)' : row.sysSeCd === 'US' ? '사용자(US)' : row.sysSeCd },
        { label: '설문 ID', key: 'survId', width: '150px' },
        { label: '설문 제목', key: 'survNm', align: 'left' },
        { label: '제출 기간', key: 'period', width: '220px', render: (row) => `${(row.startDt || '').substring(0, 10)} ~ ${(row.endDt || '').substring(0, 10)}` },
        { label: '사용여부', key: 'useYn', width: '80px', render: (row) => row.useYn === 'Y' ? '사용' : '미사용' },
        { label: '응답수', key: 'respCnt', width: '100px', render: (row) => <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{row.respCnt}건</span> },
        { label: '작성자', key: 'frstRgstrId', width: '120px' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                
                <SearchForm 
                    title="배포 설문 결과"
                    searchData={searchForm} 
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit} 
                    onReset={handleSearchReset}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CommonCodePicker 
                            grpCd="SYS_SE_CD" 
                            type="select" 
                            name="sysSeCd" 
                            value={searchForm.sysSeCd} 
                            onChange={(e) => handleSearchChange(e.target.name, e.target.value)} 
                            defaultOption="전체 시스템" 
                        />
                    </div>
                    <input type="text" name="survIdSearch" placeholder="설문 ID" value={searchForm.survIdSearch} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', width: '150px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <input type="text" name="survNm" placeholder="설문 제목" value={searchForm.survNm} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CommonCodePicker 
                            grpCd="USE_YN" 
                            type="select" 
                            name="useYn" 
                            value={searchForm.useYn} 
                            onChange={(e) => handleSearchChange(e.target.name, e.target.value)} 
                            defaultOption="사용여부 전체" 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input type="date" name="startDt" value={searchForm.startDt} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <span>~</span>
                        <input type="date" name="endDt" value={searchForm.endDt} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                </SearchForm>

                <div style={{ flex: 1, background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '14px', color: '#555' }}>
                            전체 결과: <b>{total}</b>건
                        </span>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <DataTable 
                            columns={columns} 
                            data={list} 
                            onRowClick={handleRowClick}
                            emptyMessage="검색결과가 없습니다."
                        />
                    </div>

                    {total > 10 && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                            {Array.from({ length: Math.ceil(total / 10) }, (_, i) => i + 1).map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => setPage(p)} 
                                    style={{ 
                                        padding: '5px 12px', 
                                        border: '1px solid #ddd', 
                                        background: page === p ? '#3498db' : '#fff', 
                                        color: page === p ? '#fff' : '#333', 
                                        cursor: 'pointer', 
                                        borderRadius: '4px' 
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SurveyResultList;
