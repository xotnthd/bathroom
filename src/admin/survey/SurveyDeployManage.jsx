import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';
import DataTable from '../../components/common/DataTable';
import SearchForm from '../../components/common/SearchForm';
import CommonCodePicker from '../../components/CommonCodePicker';

const SurveyDeployManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const navigate = useNavigate();
    const { inqireYn, rgstYn, delYn } = useMenuAuth();
    
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchForm, setSearchForm] = useState({
        survIdSearch: '',
        survNm: '',
        startDt: '',
        endDt: ''
    });

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [page, inqireYn]);

    const fetchList = async () => {
        const payload = { ...searchForm, sysId: defaultSysId, page, limit: 10, templateYn: 'N' };
        const res = await apiClient('/admin/api/survey/list', {
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
            survIdSearch: '',
            survNm: '',
            startDt: '',
            endDt: ''
        });
        setPage(1);
    };

    const handleDelete = async (survId) => {
        if (delYn !== 'Y') { alert('삭제 권한이 없습니다.'); return; }
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/survey/delete/${survId}?sysId=${defaultSysId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("삭제되었습니다.");
            fetchList();
        }
    };

    const handleRowClick = (item) => {
        navigate(`/admin/survey/deploy/write?survId=${item.survId}`);
    };

    const columns = [
        { label: '구분', key: 'type', width: '80px', render: () => <span style={{ background: '#2ecc71', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>배포설문</span> },
        { label: '설문 ID', key: 'survId', width: '150px' },
        { label: '제목', key: 'survNm', align: 'left', render: (row) => <span style={{ color: '#2980b9', fontWeight: 'bold' }}>{row.survNm}</span> },
        { label: '사용여부', key: 'useYn', width: '80px', render: (row) => <span style={{ color: row.useYn === 'Y' ? 'green' : 'red' }}>{row.useYn === 'Y' ? '사용' : '미사용'}</span> },
        { label: '기간', key: 'period', width: '220px', render: (row) => `${row.startDt ? row.startDt.substring(0, 10) : '상시'} ~ ${row.endDt ? row.endDt.substring(0, 10) : '상시'}` },
        { label: '관리', key: 'manage', width: '80px', render: (row) => (
            delYn === 'Y' && (
                <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(row.survId); }} 
                    style={{ padding: '4px 8px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    삭제
                </button>
            )
        )}
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                
                <SearchForm 
                    title="배포 설문 관리"
                    searchData={searchForm} 
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit} 
                    onReset={handleSearchReset}
                >
                    <input type="text" name="survIdSearch" placeholder="설문 ID" value={searchForm.survIdSearch} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', width: '150px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <input type="text" name="survNm" placeholder="설문 제목" value={searchForm.survNm} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input type="date" name="startDt" value={searchForm.startDt} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <span>~</span>
                        <input type="date" name="endDt" value={searchForm.endDt} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                </SearchForm>

                <div style={{ flex: 1, background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '14px', color: '#555' }}>
                            전체 설문: <b>{total}</b>건
                        </span>
                        {rgstYn === 'Y' && (
                            <button onClick={() => navigate('/admin/survey/deploy/write')} style={{ padding: '6px 12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                                + 신규 배포 설문 등록
                            </button>
                        )}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <DataTable 
                            columns={columns} 
                            data={list} 
                            onRowClick={handleRowClick}
                            emptyMessage="등록된 설문이 없습니다."
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

export default SurveyDeployManage;
