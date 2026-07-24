import React from 'react';
import { useNavigate } from 'react-router-dom';

const SurveyMasterInfo = ({ survey }) => {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2c3e50', paddingBottom: '10px', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>{survey.survNm}</h2>
                <button onClick={() => navigate('/admin/survey/result/list')} style={{ padding: '8px 15px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>목록으로</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '14px' }}>
                <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>설문 ID</div>
                <div>{survey.survId}</div>
                <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>설문 기간</div>
                <div>{survey.startDt?.substring(0, 10)} ~ {survey.endDt?.substring(0, 10)}</div>
                <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>설문 설명</div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{survey.survExpl || '-'}</div>
            </div>
        </div>
    );
};

export default SurveyMasterInfo;
