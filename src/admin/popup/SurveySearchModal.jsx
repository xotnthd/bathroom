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
            // 등�업확인�스확인�역�삭제�치등�는 배포 등�문�삭제�터�등            setSurveyList(data.list.filter(s => s.useYn === 'Y' && s.sysSeCd === sysSeCd));
        }
    };

    const filteredList = surveyList.filter(t => t.survNm.includes(searchKeyword));

    const handleApply = () => {
        if (!selectedSurvey) return alert("등�문확인�택등�세삭제");
        const survey = surveyList.find(s => s.survId === selectedSurvey);
        onSelect(survey);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', width: '600px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
                <div style={{ padding: '15px 20px', background: '#2c3e50', color: '#fff', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>등�문조사 매핑 (배포삭제</h3>
                    <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
                </div>
                
                <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="텍스트" value={searchKeyword} 
                            onChange={e => setSearchKeyword(e.target.value)}
                            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#ecf0f1' }}>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', width: '50px' }}>등�택</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center', width: '100px' }}>구분</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>등�문 등�목</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map(t => (
                                <tr key={t.survId} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setSelectedSurvey(t.survId)}>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <input type="radio" name="selectedSurvey" checked={selectedSurvey === t.survId} readOnly />
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>{t.sysSeCd === 'US' ? '옵션1' : '관리자'}</td>
                                    <td style={{ padding: '10px' }}>{t.survNm}</td>
                                </tr>
                            ))}
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>검등�된 등�문확인�습등�다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={onClose} style={{ padding: '8px 16px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                    <button type="button" onClick={handleApply} style={{ padding: '8px 16px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>등�택등�료</button>
                </div>
            </div>
        </div>
    );
};

export default SurveySearchModal;
