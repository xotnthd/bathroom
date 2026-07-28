import React from 'react';

const RlsPeriod = ({ rlsStartDt, rlsEndDt, onChangeStart, onChangeEnd }) => {
    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '13px', padding: '10px', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px' }}>
            <strong>확인�약 등�출 기간 (등�택)</strong>
            <input type="datetime-local" value={rlsStartDt || ''} onChange={e => onChangeStart(e.target.value)} style={{ padding: '4px' }} /> ~
            <input type="datetime-local" value={rlsEndDt || ''} onChange={e => onChangeEnd(e.target.value)} style={{ padding: '4px' }} />
            <span style={{color: '#999'}}>(미입등�시 등�성 즉시 발행삭제</span>
        </div>
    );
};

export default RlsPeriod;
