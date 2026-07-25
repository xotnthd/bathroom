import React from 'react';
import Modal from '../../../components/common/Modal';
import CommonCodePicker from '../../../components/CommonCodePicker';

const MenuMapModal = ({
    isOpen, onClose, roleNm,
    menuMapList, sysSectCd, onSysSectCdChange,
    saveMenuMap, updateMenuMapCheckbox, toggleMenuMapHeader
}) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="720px"
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            title={`메뉴 권한 - ${roleNm || ''}`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">닫기</button>
                    <button type="button" onClick={saveMenuMap} className="admin-btn admin-btn-primary">저장</button>
                </>
            }
        >
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>시스템 구분</span>
                <CommonCodePicker
                    grpCd="SYS_SE_CD"
                    type="radio"
                    name="menuMapSect"
                    value={sysSectCd}
                    onChange={e => onSysSectCdChange(e.target.value)}
                />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ background: '#f4f7f6' }}>
                    <tr>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>메뉴명</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Show<br /><input type="checkbox" onChange={() => toggleMenuMapHeader('menuShowYn')} /></th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>조회(R)<br /><input type="checkbox" onChange={() => toggleMenuMapHeader('inqireYn')} /></th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>등록(C)<br /><input type="checkbox" onChange={() => toggleMenuMapHeader('rgstYn')} /></th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>수정(U)<br /><input type="checkbox" onChange={() => toggleMenuMapHeader('mdfcnYn')} /></th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>삭제(D)<br /><input type="checkbox" onChange={() => toggleMenuMapHeader('delYn')} /></th>
                    </tr>
                </thead>
                <tbody>
                    {menuMapList.map(m => (
                        <tr key={m.menuId}>
                            <td style={{ padding: '8px', textAlign: 'left', fontWeight: m.depth === 0 ? 'bold' : 'normal', color: m.depth === 0 ? '#2c3e50' : '#7f8c8d' }}>
                                {m.displayNm}
                            </td>
                            <td style={{ textAlign: 'center' }}><input type="checkbox" checked={m.menuShowYn === 'Y'} onChange={() => updateMenuMapCheckbox(m.menuId, 'menuShowYn')} /></td>
                            <td style={{ textAlign: 'center' }}><input type="checkbox" checked={m.inqireYn === 'Y'} onChange={() => updateMenuMapCheckbox(m.menuId, 'inqireYn')} /></td>
                            <td style={{ textAlign: 'center' }}><input type="checkbox" checked={m.rgstYn === 'Y'} onChange={() => updateMenuMapCheckbox(m.menuId, 'rgstYn')} /></td>
                            <td style={{ textAlign: 'center' }}><input type="checkbox" checked={m.mdfcnYn === 'Y'} onChange={() => updateMenuMapCheckbox(m.menuId, 'mdfcnYn')} /></td>
                            <td style={{ textAlign: 'center' }}><input type="checkbox" checked={m.delYn === 'Y'} onChange={() => updateMenuMapCheckbox(m.menuId, 'delYn')} /></td>
                        </tr>
                    ))}
                    {menuMapList.length === 0 && (
                        <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>해당 구분에 등록된 메뉴가 없습니다.</td></tr>
                    )}
                </tbody>
            </table>
        </Modal>
    );
};

export default MenuMapModal;
