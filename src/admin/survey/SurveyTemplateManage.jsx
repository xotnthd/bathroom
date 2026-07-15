import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';

const SurveyTemplateManage = () => {
    const [surveyList, setSurveyList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;
    const navigate = useNavigate();
    const { inqireYn, rgstYn, delYn } = useMenuAuth();

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchSurveyList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [page, inqireYn]);

    const fetchSurveyList = async () => {
        const res = await apiClient('/admin/api/survey/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page, limit, templateYn: 'Y' })
        });
        if (res.ok) {
            const data = await res.json();
            setSurveyList(data.list);
            setTotal(data.total);
        }
    };

    const handleDelete = async (survId) => {
        if (delYn !== 'Y') { alert('삭제 권한이 없습니다.'); return; }
        if (!window.confirm("정말 삭제하시겠습니까등")) return;
        const res = await apiClient(`/admin/api/survey/delete/${survId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("삭제되었습니다.");
            fetchSurveyList();
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>설문 템플릿 관리</h2>
                {rgstYn === 'Y' && (
                    <button onClick={() => navigate('/admin/survey/template/write')} style={{ padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        + 신규 템플릿 등록
                    </button>
                )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>구분</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>설문 ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>제목</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>사용여부</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>기간</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {surveyList.map(s => (
                        <tr key={s.survId} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>
                                {s.templateYn === 'Y' ? <span style={{ background: '#e67e22', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>템플릿</span> : <span style={{ background: '#2ecc71', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>일반설문</span>}
                            </td>
                            <td style={{ padding: '12px' }}>{s.survId}</td>
                            <td style={{ padding: '12px', color: '#2980b9', cursor: 'pointer' }} onClick={() => navigate(`/admin/survey/template/write?survId=${s.survId}`)}>
                                {s.survNm}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{ color: s.useYn === 'Y' ? 'green' : 'red' }}>{s.useYn === 'Y' ? '사용' : '미사용'}</span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>
                                {s.startDt ? new Date(s.startDt).toLocaleDateString() : '지정안됨'} ~ {s.endDt ? new Date(s.endDt).toLocaleDateString() : '지정안됨'}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                {delYn === 'Y' && (
                                    <button onClick={() => handleDelete(s.survId)} style={{ padding: '4px 8px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>삭제</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {surveyList.length === 0 && (
                        <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>등록된 설문이 없습니다.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SurveyTemplateManage;
