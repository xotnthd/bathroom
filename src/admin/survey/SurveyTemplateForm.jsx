import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';
import CommonCodePicker from '../../components/CommonCodePicker';

const SurveyTemplateForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const survId = queryParams.get('survId');
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth();

    const [form, setForm] = useState({
        survNm: '',
        survExpl: '',
        templateYn: 'Y',
        useYn: 'Y',
        startDt: '',
        endDt: '',
        sysSeCd: 'US',
        questions: []
    });

    useEffect(() => {
        if (inqireYn === 'Y') {
            if (survId) {
                fetchSurveyDetail();
            }
        } else if (inqireYn === 'N') {
            alert('조회 권한명삭제�습등�다. 관리자등�게 문의등�세삭제');
        }
    }, [survId, inqireYn]);

    const fetchSurveyDetail = async () => {
        const res = await apiClient('/admin/api/survey/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ survId })
        });
        if (res.ok) {
            const data = await res.json();
            // 계층변환
            const questions = (data.questions || []).map(q => {
                q.options = (data.options || []).filter(o => o.qstnSn === q.qstnSn);
                return q;
            });
            data.questions = questions;
            
            // Format dates for input type="datetime-local"
            if (data.startDt) data.startDt = new Date(data.startDt).toISOString().slice(0, 16);
            if (data.endDt) data.endDt = new Date(data.endDt).toISOString().slice(0, 16);

            setForm(data);
        }
    };

    const handleSave = async () => {
        if (survId ? (mdfcnYn !== 'Y') : (rgstYn !== 'Y')) {
            alert('등�삭제권한명삭제�습등�다.');
            return;
        }
        if (!form.survNm) return alert("등�목확인�력등�세삭제");
        
        const payload = { 
            ...form,
            templateYn: 'Y'
        };
        if (survId) payload.survId = survId;

        const res = await apiClient('/admin/api/survey/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            alert("등�등�되등�습등�다.");
            navigate('/admin/survey/template');
        }
    };

    const addQuestion = () => {
        setForm(prev => ({
            ...prev,
            questions: [...prev.questions, { qstnType: 'S', qstnTxt: '', reqYn: 'Y', options: [] }]
        }));
    };

    const removeQuestion = (qIndex) => {
        setForm(prev => {
            const newQ = [...prev.questions];
            newQ.splice(qIndex, 1);
            return { ...prev, questions: newQ };
        });
    };

    const updateQuestion = (qIndex, field, value) => {
        setForm(prev => {
            const newQ = [...prev.questions];
            newQ[qIndex][field] = value;
            return { ...prev, questions: newQ };
        });
    };

    const addOption = (qIndex) => {
        setForm(prev => {
            const newQ = [...prev.questions];
            newQ[qIndex].options.push({ optTxt: '' });
            return { ...prev, questions: newQ };
        });
    };

    const removeOption = (qIndex, oIndex) => {
        setForm(prev => {
            const newQ = [...prev.questions];
            newQ[qIndex].options.splice(oIndex, 1);
            return { ...prev, questions: newQ };
        });
    };

    const updateOption = (qIndex, oIndex, val) => {
        setForm(prev => {
            const newQ = [...prev.questions];
            newQ[qIndex].options[oIndex].optTxt = val;
            return { ...prev, questions: newQ };
        });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>{survId ? '등�문/등�플�삭제�정' : '확인�문/등�플�삭제�록'}</h2>
                <div>
                    <button onClick={() => navigate('/admin/survey/template')} style={{ padding: '8px 16px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>목록</button>
                    {((survId && mdfcnYn === 'Y') || (!survId && rgstYn === 'Y')) && (
                        <button onClick={handleSave} style={{ padding: '10px 20px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>등�삭제</button>
                    )}
                </div>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>기본 등�보</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', alignItems: 'center' }}>
                    <label style={{ fontWeight: 'bold' }}>등�문 등�목</label>
                    <input type="text" value={form.survNm} onChange={e => setForm({...form, survNm: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="설문명" />
                    <textarea value={form.survExpl || ''} onChange={e => setForm({...form, survExpl: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', height: '60px', resize: 'vertical' }} placeholder="설문안내" />

                    <label style={{ fontWeight: 'bold' }}>등�스확인�역</label>
                    <div style={{ flex: 1, display: 'flex', gap: '15px' }}>
                    </div>

                    <label style={{ fontWeight: 'bold' }}>등�용 등��등</label>
                    <select value={form.useYn} onChange={e => setForm({...form, useYn: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                        <option value="Y">등�용</option>
                        <option value="N">미사용</option>
                    </select>

                    <label style={{ fontWeight: 'bold' }}>기간 등�정</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input type="datetime-local" value={form.startDt || ''} onChange={e => setForm({...form, startDt: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <span>~</span>
                        <input type="datetime-local" value={form.endDt || ''} onChange={e => setForm({...form, endDt: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <span style={{ fontSize: '12px', color: '#888' }}>(비워등�면 등�시 등�출)</span>
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#34495e' }}>질문 관리��</h3>
                    <button onClick={addQuestion} style={{ padding: '6px 12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>+ 질문 추�등</button>
                </div>

                {form.questions.map((q, qIndex) => (
                    <div key={qIndex} style={{ border: '1px solid #3498db', borderRadius: '8px', padding: '15px', marginBottom: '15px', background: '#f4f9fd' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: '#2980b9' }}>Q{qIndex + 1}.</span>
                            <button onClick={() => removeQuestion(qIndex)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>삭제�� 삭제</button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <select value={q.qstnType} onChange={e => updateQuestion(qIndex, 'qstnType', e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                <option value="S">등�일 등�택 (Radio)</option>
                                <option value="M">복수 등�택 (Checkbox)</option>
                                <option value="C">등�합삭제(등�택+기�삭제�력)</option>
                                <option value="T">등�답삭제(Text)</option>
                                <option value="L">등�문삭제(Textarea)</option>
                            </select>
                            <input type="text" value={q.qstnTxt} onChange={e => updateQuestion(qIndex, 'qstnTxt', e.target.value)} placeholder="질문을 입력하세요" style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                                <input type="checkbox" checked={q.reqYn === 'Y'} onChange={e => updateQuestion(qIndex, 'reqYn', e.target.checked ? 'Y' : 'N')} /> 필수
                            </label>
                        </div>

                        {['S', 'M', 'C'].includes(q.qstnType) && (
                            <div style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                <div style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '5px' }}>등�택지 (보기)</div>
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} style={{ display: 'flex', gap: '10px', marginBottom: '5px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: '#999' }}>{oIndex + 1}.</span>
                                        <input type="text" value={opt.optTxt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} placeholder="보기 등�용 등�력" style={{ width: '300px', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                                        <button onClick={() => removeOption(qIndex, oIndex)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '16px' }}>×</button>
                                    </div>
                                ))}
                                <button onClick={() => addOption(qIndex)} style={{ padding: '4px 8px', background: '#ecf0f1', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }}>+ 보기 추�등</button>
                                {q.qstnType === 'C' && (
                                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#e67e22' }}>
                                        확인�합등��등 등�용확인�면등�서 마�등�정보기확인�스확인�력창이 추�삭제�니삭제 (삭제 "기�등" 보기)
                                    </div>
                                )}
                            </div>
                        )}
                        {['T', 'L'].includes(q.qstnType) && (
                            <div style={{ paddingLeft: '20px', marginTop: '10px', fontSize: '13px', color: '#7f8c8d' }}>
                                등�용등�에�삭제�스확인�력창이 등�출등�니삭제
                            </div>
                        )}
                    </div>
                ))}
                
                {form.questions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#95a5a6' }}>
                        질문 관리��확인�습등�다. + 질문 추�등 버튼확인�릭등�세삭제
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveyTemplateForm;
