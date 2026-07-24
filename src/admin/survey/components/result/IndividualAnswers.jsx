import React from 'react';

const IndividualAnswers = ({ questions, answers, selectedRespId }) => {
    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>개별 상세 응답 내역 {selectedRespId && <span style={{ fontSize: '14px', color: '#7f8c8d' }}>({selectedRespId})</span>}</h3>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', background: '#fcfcfc', border: '1px inset #eee', padding: '15px' }}>
                {!selectedRespId ? (
                    <div style={{ textAlign: 'center', color: '#aaa', marginTop: '50px' }}>위에서 응답자를 선택해주세요.</div>
                ) : (
                    questions.map((q) => {
                        const qAnswers = answers.filter(a => a.qstnSn === q.qstnSn);
                        const hasAnswer = qAnswers.length > 0;

                        return (
                            <div key={q.qstnSn} style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e1e8ed', opacity: hasAnswer ? 1 : 0.6 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#333', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ color: '#3498db' }}>Q{q.qstnSn}.</span> {q.qstnTxt}
                                    {!hasAnswer && <span style={{ fontSize: '12px', background: '#e74c3c', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>미응답</span>}
                                </div>
                                <div style={{ paddingLeft: '25px' }}>
                                    {hasAnswer ? (
                                        <>
                                            {(q.qstnType === 'S' || q.qstnType === 'M') && qAnswers.map(r => (
                                                <div key={r.ansSn} style={{ color: '#2c3e50', background: '#f1f8ff', display: 'inline-block', padding: '5px 12px', borderRadius: '15px', fontSize: '14px', marginRight: '5px', marginBottom: '5px', border: '1px solid #d0e8ff' }}>
                                                    👉 {r.optTxt}
                                                </div>
                                            ))}
                                            {q.qstnType === 'C' && qAnswers.map(r => (
                                                <div key={r.ansSn} style={{ marginBottom: '5px' }}>
                                                    {r.optSn ? (
                                                        <span style={{ color: '#2c3e50', background: '#f1f8ff', display: 'inline-block', padding: '5px 12px', borderRadius: '15px', fontSize: '14px', border: '1px solid #d0e8ff' }}>👉 {r.optTxt}</span>
                                                    ) : null}
                                                    {r.ansTxt && (
                                                        <div style={{ marginTop: '8px', padding: '10px', background: '#fffbcc', borderLeft: '4px solid #f1c40f', color: '#555', fontSize: '14px' }}>
                                                            <b>기타 의견:</b> {r.ansTxt}
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
                                            응답 내역이 없습니다.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default IndividualAnswers;
