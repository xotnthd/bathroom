import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';

const UserSurvey = () => {
    const { survId } = useParams();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({}); // { qstnSn: [안 배열] }

    useEffect(() => {
        fetchSurveyDetail();
    }, [survId]);

    const fetchSurveyDetail = async () => {
        const res = await apiClient('/admin/api/survey/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ survId, sysId: 'CORE' })
        });
        if (res.ok) {
            const data = await res.json();
            const questions = (data.questions || []).map(q => {
                q.options = (data.options || []).filter(o => o.qstnSn === q.qstnSn);
                return q;
            });
            data.questions = questions;
            setSurvey(data);
        } else {
            alert("설문 정보를 불러올 수 없습니다.");
            window.close();
        }
    };

    const handleAnswer = (qstnSn, qstnType, val, checked) => {
        setAnswers(prev => {
            const current = prev[qstnSn] || {};
            if (qstnType === 'S' || qstnType === 'T' || qstnType === 'L') {
                return { ...prev, [qstnSn]: { ...current, val } };
            } else if (qstnType === 'M' || qstnType === 'C') {
                const arr = current.opts || [];
                let newArr;
                if (checked) {
                    newArr = [...arr, val];
                } else {
                    newArr = arr.filter(v => v !== val);
                }
                return { ...prev, [qstnSn]: { ...current, opts: newArr } };
            }
            return prev;
        });
    };

    const handleTextAnswer = (qstnSn, text) => {
        setAnswers(prev => {
            const current = prev[qstnSn] || {};
            return { ...prev, [qstnSn]: { ...current, text } };
        });
    };

    const handleSubmit = async () => {
        // Validation
        for (const q of survey.questions) {
            if (q.reqYn === 'Y') {
                const ans = answers[q.qstnSn];
                if (!ans) return alert(`Q${q.qstnSn} 문항은 필수입니다.`);
                
                if (q.qstnType === 'S') {
                    if (!ans.val) return alert(`Q${q.qstnSn} 문항은 필수입니다.`);
                } else if (q.qstnType === 'M' || q.qstnType === 'C') {
                    if (!ans.opts || ans.opts.length === 0) return alert(`Q${q.qstnSn} 문항은 필수입니다.`);
                    // 혼합형에서 마지막 '기타' 옵션 선택 시 텍스트 필수 확인
                    if (q.qstnType === 'C' && q.options.length > 0) {
                        const lastOptSn = q.options[q.options.length - 1].optSn;
                        if (ans.opts.includes(lastOptSn) && (!ans.text || ans.text.trim() === '')) {
                            return alert(`Q${q.qstnSn} 문항의 기타 의견을 입력해주세요.`);
                        }
                    }
                } else if (q.qstnType === 'T' || q.qstnType === 'L') {
                    if (!ans.text || ans.text.trim() === '') return alert(`Q${q.qstnSn} 문항은 필수입니다.`);
                }
            }
        }

        const payload = {
            survId,
            answers: survey.questions.map(q => {
                const ans = answers[q.qstnSn] || {};
                const res = { qstnSn: q.qstnSn, qstnType: q.qstnType };
                if (q.qstnType === 'S') res.optSn = ans.val;
                if (q.qstnType === 'M') res.optSns = ans.opts || [];
                if (q.qstnType === 'C') {
                    res.optSns = ans.opts || [];
                    res.ansTxt = ans.text;
                }
                if (q.qstnType === 'T' || q.qstnType === 'L') res.ansTxt = ans.text;
                return res;
            })
        };

        const res = await apiClient('/user/api/survey/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("설문 참여가 완료되었습니다. 감사합니다.");
            window.close();
        } else {
            alert("제출에 실패했습니다.");
        }
    };

    if (!survey) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ background: '#2c3e50', color: '#fff', padding: '30px', borderRadius: '8px 8px 0 0', textAlign: 'center' }}>
                <h1 style={{ margin: 0 }}>{survey.survNm}</h1>
                {survey.survExpl && <p style={{ marginTop: '10px', fontSize: '15px', opacity: 0.9, whiteSpace: 'pre-wrap' }}>{survey.survExpl}</p>}
            </div>
            
            <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '0 0 8px 8px', border: '1px solid #ddd', borderTop: 'none' }}>
                {survey.questions.map((q, i) => (
                    <div key={q.qstnSn} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div style={{ background: '#3498db', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                {i + 1}
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', paddingTop: '4px' }}>
                                {q.qstnTxt} {q.reqYn === 'Y' && <span style={{ color: '#e74c3c' }}>*</span>}
                            </div>
                        </div>

                        <div style={{ paddingLeft: '40px' }}>
                            {q.qstnType === 'S' && q.options.map(opt => (
                                <label key={opt.optSn} style={{ display: 'block', marginBottom: '10px', cursor: 'pointer', fontSize: '15px' }}>
                                    <input type="radio" name={`q_${q.qstnSn}`} value={opt.optSn} onChange={(e) => handleAnswer(q.qstnSn, q.qstnType, parseInt(e.target.value))} style={{ marginRight: '10px' }} />
                                    {opt.optTxt}
                                </label>
                            ))}

                            {q.qstnType === 'M' && q.options.map(opt => (
                                <label key={opt.optSn} style={{ display: 'block', marginBottom: '10px', cursor: 'pointer', fontSize: '15px' }}>
                                    <input type="checkbox" onChange={(e) => handleAnswer(q.qstnSn, q.qstnType, opt.optSn, e.target.checked)} style={{ marginRight: '10px' }} />
                                    {opt.optTxt}
                                </label>
                            ))}

                            {q.qstnType === 'C' && q.options.map((opt, idx) => {
                                const isLast = idx === q.options.length - 1;
                                const isChecked = (answers[q.qstnSn]?.opts || []).includes(opt.optSn);
                                return (
                                    <div key={opt.optSn} style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '15px' }}>
                                            <input type="checkbox" onChange={(e) => handleAnswer(q.qstnSn, q.qstnType, opt.optSn, e.target.checked)} style={{ marginRight: '10px' }} />
                                            {opt.optTxt}
                                        </label>
                                        {isLast && isChecked && (
                                            <div style={{ marginTop: '5px', paddingLeft: '25px' }}>
                                                <input type="text" placeholder="기타 내용을 입력해주세요" onChange={(e) => handleTextAnswer(q.qstnSn, e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            {q.qstnType === 'T' && (
                                <input type="text" placeholder="답변을 입력하세요" onChange={(e) => handleTextAnswer(q.qstnSn, e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '15px' }} />
                            )}

                            {q.qstnType === 'L' && (
                                <textarea rows="4" placeholder="답변을 상세히 입력하세요" onChange={(e) => handleTextAnswer(q.qstnSn, e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '15px', resize: 'vertical' }} />
                            )}
                        </div>
                    </div>
                ))}

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button onClick={handleSubmit} style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '15px 40px', fontSize: '16px', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(46, 204, 113, 0.3)' }}>
                        제출하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSurvey;
