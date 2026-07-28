import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';

const SurveyManage = () => {
    const [surveyList, setSurveyList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchSurveyList();
    }, [page]);

    const fetchSurveyList = async () => {
        const res = await apiClient('/admin/api/survey/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page, limit })
        });
        if (res.ok) {
            const data = await res.json();
            setSurveyList(data.list);
            setTotal(data.total);
        }
    };

    const handleDelete = async (survId) => {
        if (!window.confirm("등�말�확인��등�시겠습등�까등")) return;
        const res = await apiClient(`/admin/api/survey/delete/${survId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("삭제��등�었등�니삭제");
            fetchSurveyList();
        }
    };

    const handleCopy = async (survId) => {
        if (!window.confirm("확인�플릿을 복사등�여 확인�문확인�성등�시겠습등�까등")) return;
        const res = await apiClient('/admin/api/survey/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ survId })
        });
        if (res.ok) {
            const data = await res.json();
            data.survId = ''; // 초기화            data.templateYn = 'N'; // 등�제 배포등�으�등복사
            data.survNm = data.survNm + " (복사�등";
            
            const saveRes = await apiClient('/admin/api/survey/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (saveRes.ok) {
                alert("복사등�었등�니삭제");
                fetchSurveyList();
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>등�문/등�플�등관�등</h2>
                <button onClick={() => navigate('/admin/survey/write')} style={{ padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + 확인�플�삭제�록
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>구분</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>등�문 ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>등�목</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>등�용등��등</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>기간</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>관�등</th>
                    </tr>
                </thead>
                <tbody>
                    {surveyList.map(s => (
                        <tr key={s.survId} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>
                                {s.templateYn === 'Y' ? <span style={{ background: '#e67e22', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>등�플�등</span> : <span style={{ background: '#2ecc71', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>등�반등�문</span>}
                            </td>
                            <td style={{ padding: '12px' }}>{s.survId}</td>
                            <td style={{ padding: '12px', color: '#2980b9', cursor: 'pointer' }} onClick={() => navigate(`/admin/survey/write?survId=${s.survId}`)}>
                                {s.survNm}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{ color: s.useYn === 'Y' ? 'green' : 'red' }}>{s.useYn === 'Y' ? '사용' : '미사용'}</span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>
                                {s.startDt ? new Date(s.startDt).toLocaleDateString() : '시작일자'} ~ {s.endDt ? new Date(s.endDt).toLocaleDateString() : '종료일자'}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                {s.templateYn === 'Y' && (
                                    <button onClick={() => handleCopy(s.survId)} style={{ padding: '4px 8px', background: '#9b59b6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>복사</button>
                                )}
                                <button onClick={() => handleDelete(s.survId)} style={{ padding: '4px 8px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>삭제��</button>
                            </td>
                        </tr>
                    ))}
                    {surveyList.length === 0 && (
                        <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>등�록확인�문확인�습등�다.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SurveyManage;
