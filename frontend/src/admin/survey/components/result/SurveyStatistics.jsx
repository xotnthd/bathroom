import React from 'react';

const SurveyStatistics = ({ statList, totalRespondents }) => {
    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
                설문 문항별 응답 통계
            </h3>
            <div>
                {statList.map(stat => (
                    <div key={stat.qstnSn} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px dashed #ccc' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                            <span style={{ color: '#e67e22' }}>Q{stat.qstnSn}.</span> {stat.qstnTxt} <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'normal' }}>(총 응답: {stat.totalAns}건)</span>
                        </div>
                        
                        {(stat.qstnType === 'S' || stat.qstnType === 'M' || stat.qstnType === 'C') ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {stat.options.map(opt => {
                                    const pct = totalRespondents === 0 ? 0 : Math.round((opt.ansCnt / totalRespondents) * 100);
                                    return (
                                        <div key={opt.optSn} style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                                            <div style={{ width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={opt.optTxt}>
                                                {opt.optTxt || '기타/주관식'}
                                            </div>
                                            <div style={{ flex: 1, background: '#ecf0f1', height: '14px', borderRadius: '7px', margin: '0 15px', overflow: 'hidden' }}>
                                                <div style={{ width: `${pct}%`, background: '#3498db', height: '100%', transition: 'width 0.5s' }}></div>
                                            </div>
                                            <div style={{ width: '80px', textAlign: 'right' }}>
                                                {opt.ansCnt}건({pct}%)
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div style={{ fontSize: '13px', color: '#34495e', background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                                서술형/주관식 문항은 <b>{stat.totalAns}</b>건의 응답이 수집되었으니 아래 [상세 응답 내역]에서 개별 확인해주세요.
                            </div>
                        )}
                    </div>
                ))}
                {statList.length === 0 && <div style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>통계 데이터가 없습니다.</div>}
            </div>
        </div>
    );
};

export default SurveyStatistics;
