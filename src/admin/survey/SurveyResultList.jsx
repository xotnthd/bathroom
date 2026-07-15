import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';

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

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchList();
    };

    const handleRowClick = (survId) => {
        navigate(`/admin/survey/result/${survId}`);
    };

    const totalPages = Math.ceil(total / 10);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2 style={{ borderBottom: '2px solid #2c3e50', paddingBottom: '10px', color: '#2c3e50' }}>배포 등�문 결과</h2>

            {/* 검색삭제*/}
            <form onSubmit={handleSearch} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>등�스확인�역:</label>
                    <select value={searchForm.sysSeCd} onChange={e => setSearchForm({...searchForm, sysSeCd: e.target.value})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="">등�체</option>
                        <option value="MG">관리자등�면 (MG)</option>
                        <option value="US">등�용등�화�?(US)</option>
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>등�문 ID:</label>
                    <input type="text" value={searchForm.survIdSearch} onChange={e => setSearchForm({...searchForm, survIdSearch: e.target.value})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>등�목:</label>
                    <input type="text" value={searchForm.survNm} onChange={e => setSearchForm({...searchForm, survNm: e.target.value})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>등�용등��?:</label>
                    <select value={searchForm.useYn} onChange={e => setSearchForm({...searchForm, useYn: e.target.value})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="">등�체</option>
                        <option value="Y">등�용 (Y)</option>
                        <option value="N">미사용(N)</option>
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>등�록 기간:</label>
                    <input type="date" value={searchForm.startDt} onChange={e => setSearchForm({...searchForm, startDt: e.target.value})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <span>~</span>
                    <input type="date" value={searchForm.endDt} onChange={e => setSearchForm({...searchForm, endDt: e.target.value})} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <button type="submit" style={{ padding: '8px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>검색</button>
            </form>

            <div style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                등�체 결과: <b>{total}</b>�등            </div>

            {/* 그리삭제*/}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead style={{ background: '#2c3e50', color: '#fff' }}>
                    <tr>
                        <th style={{ padding: '12px' }}>No</th>
                        <th style={{ padding: '12px' }}>등�문 ID</th>
                        <th style={{ padding: '12px' }}>등�목</th>
                        <th style={{ padding: '12px' }}>등�스확인�역</th>
                        <th style={{ padding: '12px' }}>등�답등록</th>
                        <th style={{ padding: '12px' }}>등�출 기간</th>
                        <th style={{ padding: '12px' }}>등�용등��등</th>
                        <th style={{ padding: '12px' }}>등�성삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((item, idx) => (
                        <tr key={item.survId} onClick={() => handleRowClick(item.survId)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }} onMouseOver={e => e.currentTarget.style.background='#f1f2f6'} onMouseOut={e => e.currentTarget.style.background='#fff'}>
                            <td style={{ padding: '12px' }}>{(page - 1) * 10 + idx + 1}</td>
                            <td style={{ padding: '12px' }}>{item.survId}</td>
                            <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>{item.survNm}</td>
                            <td style={{ padding: '12px' }}>{item.sysSeCd}</td>
                            <td style={{ padding: '12px', color: '#e74c3c', fontWeight: 'bold' }}>{item.respCnt}�취소</td>
                            <td style={{ padding: '12px' }}>
                                {(item.startDt || '').substring(0, 10)} ~ {(item.endDt || '').substring(0, 10)}
                            </td>
                            <td style={{ padding: '12px' }}>{item.useYn === 'Y' ? '사용' : '미사용'}</td>
                            <td style={{ padding: '12px' }}>{item.frstRgstrId}</td>
                        </tr>
                    ))}
                    {list.length === 0 && (
                        <tr>
                            <td colSpan="8" style={{ padding: '50px', color: '#aaa' }}>검색결과가 등�습등�다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 등�이�등*/}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{ padding: '5px 12px', border: '1px solid #ddd', background: page === p ? '#3498db' : '#fff', color: page === p ? '#fff' : '#333', cursor: 'pointer', borderRadius: '4px' }}>
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SurveyResultList;
