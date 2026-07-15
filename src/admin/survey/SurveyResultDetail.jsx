import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';

const SurveyResultDetail = () => {
    const { survId } = useParams();
    const navigate = useNavigate();

    const [survey, setSurvey] = useState(null);
    const [respondents, setRespondents] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [selectedRespId, setSelectedRespId] = useState(null);

    useEffect(() => {
        fetchSurveyDetail();
        fetchRespondents();
        fetchStatistics();
    }, [survId]);

    useEffect(() => {
        if (selectedRespId) {
            fetchAnswers(selectedRespId);
        } else {
            setAnswers([]);
        }
    }, [selectedRespId]);

    const fetchSurveyDetail = async () => {
        const res = await apiClient('/admin/api/survey/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ survId })
        });
        if (res.ok) {
            const data = await res.json();
            setSurvey(data);
        } else {
            alert("등�문 등�보�등불러등록등�습등�다.");
            navigate('/admin/survey/result/list');
        }
    };

    const fetchRespondents = async () => {
        const res = await apiClient('/admin/api/survey/result/respondents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ survId })
        });
        if (res.ok) {
            const data = await res.json();
            setRespondents(data || []);
        }
    };

    const fetchStatistics = async () => {
        const res = await apiClient('/admin/api/survey/result/statistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ survId })
        });
        if (res.ok) {
            const data = await res.json();
            setStatistics(data || []);
        }
    };

    const fetchAnswers = async (respId) => {
        const res = await apiClient('/admin/api/survey/result/answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ survId, respId })
        });
        if (res.ok) {
            const data = await res.json();
            setAnswers(data || []);
        }
    };

    if (!survey) return <div style={{ padding: '20px' }}>Loading...</div>;

    // 통계 데이터 가공
    const statsByQstn = statistics.reduce((acc, curr) => {
        if (!acc[curr.qstnSn]) {
            acc[curr.qstnSn] = {
                qstnSn: curr.qstnSn,
                qstnTxt: curr.qstnTxt,
                qstnType: curr.qstnType,
                totalAns: 0,
                options: []
            };
        }
        acc[curr.qstnSn].totalAns += curr.ansCnt;
        acc[curr.qstnSn].options.push(curr);
        return acc;
    }, []);
    const statList = Object.values(statsByQstn).sort((a, b) => a.qstnSn - b.qstnSn);

    // 질문 목록 등�렬
    const questions = survey.questions || [];
    questions.sort((a, b) => a.ordNo - b.ordNo);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            
            {/* 1삭제 등�문 마스확인�보 */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2c3e50', paddingBottom: '10px', marginBottom: '15px' }}>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>{survey.survNm}</h2>
                    <button onClick={() => navigate('/admin/survey/result/list')} style={{ padding: '8px 15px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>목록등�로</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '14px' }}>
                    <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>등�문 ID</div>
                    <div>{survey.survId}</div>
                    <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>등�문 기간</div>
                    <div>{survey.startDt?.substring(0,10)} ~ {survey.endDt?.substring(0,10)}</div>
                    <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>등�문 등�명</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{survey.survExpl || '-'}</div>
                </div>
            </div>

            {/* 2삭제 등�답 등�계 등�등�보삭제*/}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', flexShrink: 0, maxHeight: '300px', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    등�� 문항�삭제�답 등�계
                </h3>
                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
                    {statList.map(stat => (
                        <div key={stat.qstnSn} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px dashed #ccc' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                                <span style={{ color: '#e67e22' }}>Q{stat.qstnSn}.</span> {stat.qstnTxt} <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'normal' }}>(�삭제�답: {stat.totalAns}�등</span>
                            </div>
                            
                            {(stat.qstnType === 'S' || stat.qstnType === 'M' || stat.qstnType === 'C') ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {stat.options.map(opt => {
                                        const pct = stat.totalAns === 0 ? 0 : Math.round((opt.ansCnt / respondents.length) * 100);
                                        return (
                                            <div key={opt.optSn} style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                                                <div style={{ width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={opt.optTxt}>
                                                    {opt.optTxt || '기타/주관식'}
                                                </div>
                                                <div style={{ flex: 1, background: '#ecf0f1', height: '14px', borderRadius: '7px', margin: '0 15px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${pct}%`, background: '#3498db', height: '100%', transition: 'width 0.5s' }}></div>
                                                </div>
                                                <div style={{ width: '80px', textAlign: 'right' }}>
                                                    {opt.ansCnt}�?({pct}%)
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div style={{ fontSize: '13px', color: '#34495e', background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                                    등�술등설문항등� <b>{stat.totalAns}</b>건의 등�답확인�집등�었등�니삭제 등�래 [등�세 등�답 등�역]등�서 개별 등�인등�주등�요.
                                </div>
                            )}
                        </div>
                    ))}
                    {statList.length === 0 && <div style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>등�계 등�이등��등 등�습등�다.</div>}
                </div>
            </div>

            {/* 3삭제 등�답등항목록 */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', flexShrink: 0, maxHeight: '250px', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    등�� 등�답등항목록 <span style={{ fontSize: '14px', background: '#e74c3c', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>�등{respondents.length}�등</span>
                </h3>
                <div style={{ overflowY: 'auto', flex: 1, border: '1px solid #eee' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
                        <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0 }}>
                            <tr>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>No</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>등�답삭제ID (IP/계정)</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>등�답 등�시</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>등�세 보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {respondents.map((r, idx) => (
                                <tr key={r.respId} 
                                    onClick={() => setSelectedRespId(r.respId)}
                                    style={{ 
                                        cursor: 'pointer', 
                                        borderBottom: '1px solid #eee',
                                        background: selectedRespId === r.respId ? '#e8f4fd' : '#fff'
                                    }}
                                    onMouseOver={e => { if(selectedRespId !== r.respId) e.currentTarget.style.background='#f1f2f6'; }} 
                                    onMouseOut={e => { if(selectedRespId !== r.respId) e.currentTarget.style.background='#fff'; }}
                                >
                                    <td style={{ padding: '10px' }}>{respondents.length - idx}</td>
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{r.userId || r.respId}</td>
                                    <td style={{ padding: '10px' }}>{new Date(r.frstRegDt).toLocaleString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button style={{ padding: '4px 10px', background: selectedRespId === r.respId ? '#2980b9' : '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>조회</button>
                                    </td>
                                </tr>
                            ))}
                            {respondents.length === 0 && (
                                <tr><td colSpan="4" style={{ padding: '30px', color: '#999' }}>등�직 등�답확인�용등��등 등�습등�다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4삭제 등�정 등�답등�의 등�답 등�세 등�역 */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>등�� 등�세 등�답 등�역 {selectedRespId && <span style={{ fontSize: '14px', color: '#7f8c8d' }}>({selectedRespId})</span>}</h3>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', background: '#fcfcfc', border: '1px inset #eee', padding: '15px' }}>
                    {!selectedRespId ? (
                        <div style={{ textAlign: 'center', color: '#aaa', marginTop: '50px' }}>등�에확인�답등��등 등�택등�주등�요.</div>
                    ) : (
                        questions.map((q) => {
                            const qAnswers = answers.filter(a => a.qstnSn === q.qstnSn);
                            const hasAnswer = qAnswers.length > 0;

                            return (
                                <div key={q.qstnSn} style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e1e8ed', opacity: hasAnswer ? 1 : 0.6 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#333', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ color: '#3498db' }}>Q{q.qstnSn}.</span> {q.qstnTxt}
                                        {!hasAnswer && <span style={{ fontSize: '12px', background: '#e74c3c', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>미응삭제</span>}
                                    </div>
                                    <div style={{ paddingLeft: '25px' }}>
                                        {hasAnswer ? (
                                            <>
                                                {(q.qstnType === 'S' || q.qstnType === 'M') && qAnswers.map(r => (
                                                    <div key={r.ansSn} style={{ color: '#2c3e50', background: '#f1f8ff', display: 'inline-block', padding: '5px 12px', borderRadius: '15px', fontSize: '14px', marginRight: '5px', marginBottom: '5px', border: '1px solid #d0e8ff' }}>
                                                        취소�️ {r.optTxt}
                                                    </div>
                                                ))}
                                                {q.qstnType === 'C' && qAnswers.map(r => (
                                                    <div key={r.ansSn} style={{ marginBottom: '5px' }}>
                                                        {r.optSn ? (
                                                            <span style={{ color: '#2c3e50', background: '#f1f8ff', display: 'inline-block', padding: '5px 12px', borderRadius: '15px', fontSize: '14px', border: '1px solid #d0e8ff' }}>취소�️ {r.optTxt}</span>
                                                        ) : null}
                                                        {r.ansTxt && (
                                                            <div style={{ marginTop: '8px', padding: '10px', background: '#fffbcc', borderLeft: '4px solid #f1c40f', color: '#555', fontSize: '14px' }}>
                                                                <b>기�삭제�견:</b> {r.ansTxt}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {(q.qstnType === 'T' || q.qstnType === 'L') && qAnswers.map(r => (
                                                    <div key={r.ansSn} style={{ padding: '10px', background: '#f8f9fa', borderLeft: '4px solid #3498db', color: '#333', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                                                        {r.ansTxt}
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div style={{ color: '#95a5a6', fontSize: '13px', fontStyle: 'italic' }}>
                                                등�답확인�역확인�습등�다.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

        </div>
    );
};

export default SurveyResultDetail;
