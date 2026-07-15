import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';

const TemplateSearchModal = ({ onClose, onSelect }) => {
    const [templateList, setTemplateList] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        const res = await apiClient('/admin/api/survey/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 1, limit: 1000, templateYn: 'Y' })
        });
        if (res.ok) {
            const data = await res.json();
            setTemplateList(data.list);
        }
    };

    const handleSearch = () => {
        // 등�라등�언확인�이확인�터�?(간단삭제
    };

    const filteredList = templateList.filter(t => t.survNm.includes(searchKeyword));

    const handleApply = async () => {
        if (!selectedTemplate) return alert("등�플릿을 등�택등�세삭제");
        
        // 등�세 등�이삭제불러등�기 (문항 등�함)
        const res = await apiClient('/admin/api/survey/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ survId: selectedTemplate })
        });
        
        if (res.ok) {
            const data = await res.json();
            
            const questions = (data.questions || []).map(q => {
                q.options = (data.options || []).filter(o => o.qstnSn === q.qstnSn);
                return q;
            });
            data.questions = questions;

            onSelect(data);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', width: '600px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
                <div style={{ padding: '15px 20px', background: '#2c3e50', color: '#fff', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>템플릿 가져오기</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
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
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>등�플�등ID</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>등�플�삭제�목</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map(t => (
                                <tr key={t.survId} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setSelectedTemplate(t.survId)}>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <input type="radio" name="selectedTemplate" checked={selectedTemplate === t.survId} readOnly />
                                    </td>
                                    <td style={{ padding: '10px' }}>{t.survId}</td>
                                    <td style={{ padding: '10px' }}>{t.survNm}</td>
                                </tr>
                            ))}
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>검등�된 등�플릿이 등�습등�다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                    <button onClick={handleApply} style={{ padding: '8px 16px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>가등�오�등</button>
                </div>
            </div>
        </div>
    );
};

export default TemplateSearchModal;
