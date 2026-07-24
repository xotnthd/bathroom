import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';
import DataTable from '../../components/common/DataTable';
import SearchForm from '../../components/common/SearchForm';

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

    const handleSearchChange = (name, value) => {
        setSearchForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchSurveyList();
    };

    const handleSearchReset = () => {
        setSearchForm({ survIdSearch: '', survNm: '' });
        setPage(1);
        // 상태 변경 후 바로 조회를 위해 API 호출 시 파라미터 직접 전달
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

    // Columns
    const columns = [
        { key: 'templateYn', label: '구분', align: 'center', render: (row) => (
            row.templateYn === 'Y' ? 
            <span style={{ background: '#e67e22', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>템플릿</span> : 
            <span style={{ background: '#2ecc71', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>일반설문</span>
        )},
        { key: 'survId', label: '설문 ID', align: 'center' },
        { key: 'survNm', label: '제목', align: 'left', render: (row) => (
            <span style={{ color: '#2980b9', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate(`/admin/survey/template/write?survId=${row.survId}`)}>
                {row.survNm}
            </span>
        )},
        { key: 'useYn', label: '사용여부', align: 'center', render: (row) => (
            <span style={{ color: row.useYn === 'Y' ? 'green' : 'red' }}>{row.useYn === 'Y' ? '사용' : '미사용'}</span>
        )},
        { key: 'period', label: '기간', align: 'center', render: (row) => (
            <span style={{ fontSize: '13px' }}>
                {row.startDt ? new Date(row.startDt).toLocaleDateString() : '지정안됨'} ~ {row.endDt ? new Date(row.endDt).toLocaleDateString() : '지정안됨'}
            </span>
        )},
        { key: 'frstRgstrNm', label: '등록자', align: 'center', render: (row) => row.frstRgstrNm || row.frstRgstrId || '-' },
        { key: 'frstRegDt', label: '등록일자', align: 'center', render: (row) => (
            row.frstRegDt ? new Date(row.frstRegDt).toLocaleDateString() : '-'
        )},
    ];

    if (delYn === 'Y') {
        columns.push({
            key: 'action', label: '관리', align: 'center', render: (row) => (
                <button onClick={(e) => { e.stopPropagation(); handleDelete(row.survId); }} style={{ padding: '4px 8px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                    삭제
                </button>
            )
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                
                <SearchForm 
                    title="설문 템플릿 관리"
                    searchData={searchForm} 
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit} 
                    onReset={handleSearchReset}
                >
                    <input type="text" name="survIdSearch" placeholder="설문 ID" value={searchForm.survIdSearch} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <input type="text" name="survNm" placeholder="제목" value={searchForm.survNm} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }} />
                </SearchForm>

                <div style={{ flex: 1, background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0 }}>템플릿 목록 (총 {total}건)</h4>
                        {rgstYn === 'Y' && (
                            <button onClick={() => navigate('/admin/survey/template/write')} className="admin-btn admin-btn-primary">
                                + 신규 템플릿 등록
                            </button>
                        )}
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <DataTable 
                            columns={columns}
                            data={surveyList}
                            rowKey="survId"
                            emptyMessage="등록된 설문 템플릿이 없습니다."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyTemplateManage;
