import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';

const SurveySearchModal = ({ onClose, onSelect, sysSeCd }) => {
    const [surveyList, setSurveyList] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedSurvey, setSelectedSurvey] = useState(null);

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        const res = await apiClient('/admin/api/survey/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 1, limit: 1000, templateYn: 'N' })
        });
        if (res.ok) {
            const data = await res.json();
            // 팝업 매핑은 배포된 설문(useYn='Y')만 가능
            setSurveyList(data.list.filter(s => s.useYn === 'Y' && s.sysSeCd === sysSeCd));
        }
    };

    const filteredList = surveyList.filter(t => t.survNm.includes(searchKeyword));

    const handleApply = () => {
        if (!selectedSurvey) return alert("설문을 선택해주세요");
        const survey = surveyList.find(s => s.survId === selectedSurvey);
        onSelect(survey);
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content" style={{ width: '600px' }}>
                <div className="admin-modal-header">
                    <h3 style={{ margin: 0 }}>설문조사 매핑 검색</h3>
                    <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
                </div>
                
                <div className="admin-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="설문 제목 검색" value={searchKeyword} 
                            onChange={e => setSearchKeyword(e.target.value)}
                            style={{ flex: 1, padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--content-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: 'var(--table-header-bg)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px', width: '50px' }}>선택</th>
                                <th style={{ padding: '10px', textAlign: 'center', width: '100px' }}>구분</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>설문 제목</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map(t => (
                                <tr key={t.survId} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => setSelectedSurvey(t.survId)}>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <input type="radio" name="selectedSurvey" checked={selectedSurvey === t.survId} readOnly />
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                            {t.sysSeCd === 'US' ? '사용자' : '관리자'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{t.survNm}</td>
                                </tr>
                            ))}
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>검색된 설문이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="admin-modal-footer">
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    <button type="button" onClick={handleApply} className="admin-btn admin-btn-primary">선택 완료</button>
                </div>
            </div>
        </div>
    );
};

export default SurveySearchModal;
