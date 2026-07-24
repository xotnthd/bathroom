import React from 'react';

const DeployQuestionList = ({ form, setForm }) => {

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
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#34495e' }}>질문 관리</h3>
                <button onClick={addQuestion} style={{ padding: '6px 12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>+ 질문 추가</button>
            </div>

            {form.questions.map((q, qIndex) => (
                <div key={qIndex} style={{ border: '1px solid #3498db', borderRadius: '8px', padding: '15px', marginBottom: '15px', background: '#f4f9fd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: '#2980b9' }}>Q{qIndex + 1}.</span>
                        <button onClick={() => removeQuestion(qIndex)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>X 삭제</button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select value={q.qstnType} onChange={e => updateQuestion(qIndex, 'qstnType', e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <option value="S">단일 선택 (Radio)</option>
                            <option value="M">복수 선택 (Checkbox)</option>
                            <option value="C">복합형(선택+기타입력)</option>
                            <option value="T">단답형(Text)</option>
                            <option value="L">장문형(Textarea)</option>
                        </select>
                        <input type="text" value={q.qstnTxt} onChange={e => updateQuestion(qIndex, 'qstnTxt', e.target.value)} placeholder="질문을 입력하세요" style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                            <input type="checkbox" checked={q.reqYn === 'Y'} onChange={e => updateQuestion(qIndex, 'reqYn', e.target.checked ? 'Y' : 'N')} /> 필수
                        </label>
                    </div>

                    {['S', 'M', 'C'].includes(q.qstnType) && (
                        <div style={{ paddingLeft: '20px', marginTop: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '5px' }}>선택지 (보기)</div>
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex} style={{ display: 'flex', gap: '10px', marginBottom: '5px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: '#999' }}>{oIndex + 1}.</span>
                                    <input type="text" value={opt.optTxt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} placeholder="보기 내용 입력" style={{ width: '300px', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                                    <button onClick={() => removeOption(qIndex, oIndex)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '16px' }}>×</button>
                                </div>
                            ))}
                            <button onClick={() => addOption(qIndex)} style={{ padding: '4px 8px', background: '#ecf0f1', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }}>+ 보기 추가</button>
                            {q.qstnType === 'C' && (
                                <div style={{ marginTop: '10px', fontSize: '12px', color: '#e67e22' }}>
                                    복합형은 사용자 화면에서 마지막 보기에 텍스트 입력창이 추가됩니다. (예: "기타" 보기)
                                </div>
                            )}
                        </div>
                    )}
                    {['T', 'L'].includes(q.qstnType) && (
                        <div style={{ paddingLeft: '20px', marginTop: '10px', fontSize: '13px', color: '#7f8c8d' }}>
                            사용자 화면에 텍스트 입력창이 노출됩니다.
                        </div>
                    )}
                </div>
            ))}
            
            {form.questions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#95a5a6' }}>
                    등록된 질문이 없습니다. + 질문 추가 버튼을 클릭하세요.
                </div>
            )}
        </div>
    );
};

export default DeployQuestionList;
