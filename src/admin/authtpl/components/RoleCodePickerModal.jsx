import React from 'react';
import Modal from '../../../components/common/Modal';

const RoleCodePickerModal = ({ isOpen, onClose, roleOptions, onSelect }) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="520px"
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
            title="CORE 등록 역할 중 선택"
            footer={<button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">닫기</button>}
        >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)' }}>
                    <tr>
                        <th style={{ padding: '8px', textAlign: 'center' }}>코드</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>명칭</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>레벨</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>설명</th>
                    </tr>
                </thead>
                <tbody>
                    {roleOptions.map(r => (
                        <tr
                            key={r.athrtyComCd}
                            onClick={() => onSelect(r)}
                            style={{ cursor: 'pointer' }}
                            onMouseOver={e => { e.currentTarget.style.background = '#eef6ff'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid var(--border-color, #eee)' }}>{r.athrtyComCd}</td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid var(--border-color, #eee)' }}>{r.athrtyNm}</td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid var(--border-color, #eee)' }}>{r.athrtyLevel}</td>
                            <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid var(--border-color, #eee)' }}>{r.cdExpl}</td>
                        </tr>
                    ))}
                    {roleOptions.length === 0 && (
                        <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>CORE 권한 매트릭스 관리에 등록된 역할이 없습니다.</td></tr>
                    )}
                </tbody>
            </table>
        </Modal>
    );
};

export default RoleCodePickerModal;
