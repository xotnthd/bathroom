import React from 'react';

const RespondentList = ({ respondents, selectedRespId, onSelectRespondent }) => {
    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', flexShrink: 0, maxHeight: '250px', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
                전체 응답자 목록 <span style={{ fontSize: '14px', background: '#e74c3c', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>총 {respondents.length}명</span>
            </h3>
            <div style={{ overflowY: 'auto', flex: 1, border: '1px solid #eee' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
                    <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0 }}>
                        <tr>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>No</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>응답자 ID (IP/계정)</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>응답 일시</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>상세 보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {respondents.map((r, idx) => (
                            <tr key={r.respId} 
                                onClick={() => onSelectRespondent(r.respId)}
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
                            <tr><td colSpan="4" style={{ padding: '30px', color: '#999' }}>아직 응답 내역이 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RespondentList;
