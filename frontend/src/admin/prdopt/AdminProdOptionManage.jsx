import React, { useEffect, useState } from 'react';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useAdminPrdOptManage } from './hooks/useAdminPrdOptManage';
import OptionModal from './components/OptionModal';

const AdminProdOptionManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth(MENU_IDS.PRD_OPTION);
    const {
        groupList, valueList, selGroupIdx, setSelGroupIdx,
        fetchGroupList, fetchValueList, saveGroup, deleteGroup, saveValue, deleteValue
    } = useAdminPrdOptManage(defaultSysId);

    const [modal, setModal] = useState({ isOpen: false, targetType: 'GROUP', mode: 'INSERT' });
    const [form, setForm] = useState({});

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchGroupList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const openInsert = (targetType) => {
        if (targetType === 'VALUE' && !selGroupIdx) return alert('좌측에서 옵션 그룹을 먼저 선택해주세요.');
        setModal({ isOpen: true, targetType, mode: 'INSERT' });
        if (targetType === 'GROUP') {
            setForm({ optGrpNm: '', sortOrd: 0, useYn: 'Y' });
        } else {
            setForm({ optGrpIdx: selGroupIdx, optValNm: '', sortOrd: 0, useYn: 'Y' });
        }
    };
    const openUpdate = (targetType, data) => {
        setModal({ isOpen: true, targetType, mode: 'UPDATE' });
        setForm(data);
    };

    const selectGroup = (g) => {
        setSelGroupIdx(g.idx);
        fetchValueList(g.idx);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', gap: '1.2rem', height: 'calc(100vh - 200px)' }}>
                {/* 옵션 그룹 */}
                <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="admin-card-title">1. 옵션 그룹</span>
                        {rgstYn === 'Y' && <button onClick={() => openInsert('GROUP')} className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>+ 등록</button>}
                    </div>
                    <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)' }}>
                                <tr>
                                    <th style={{ padding: '10px' }}>그룹명</th>
                                    <th style={{ padding: '10px' }}>사용</th>
                                    <th style={{ padding: '10px' }}>기능</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupList.map(g => (
                                    <tr key={g.idx} onClick={() => selectGroup(g)} style={{ cursor: 'pointer', background: selGroupIdx === g.idx ? '#e3f2fd' : 'none' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>{g.optGrpNm}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', color: g.useYn === 'Y' ? '#2ecc71' : '#95a5a6' }}>{g.useYn}</td>
                                        <td style={{ padding: '4px', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                            {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); openUpdate('GROUP', g); }} className="admin-btn admin-btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '4px' }}>수정</button>}
                                            {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); deleteGroup(g.idx); }} className="admin-btn admin-btn-danger" style={{ padding: '2px 6px', fontSize: '11px' }}>삭제</button>}
                                        </td>
                                    </tr>
                                ))}
                                {groupList.length === 0 && <tr><td colSpan="3" style={{ padding: '20px', color: 'var(--text-secondary)' }}>등록된 옵션 그룹이 없습니다.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 옵션 값 */}
                <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="admin-card-title">2. 옵션 값</span>
                        {rgstYn === 'Y' && <button onClick={() => openInsert('VALUE')} className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>+ 등록</button>}
                    </div>
                    <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)' }}>
                                <tr>
                                    <th style={{ padding: '10px' }}>값</th>
                                    <th style={{ padding: '10px' }}>사용</th>
                                    <th style={{ padding: '10px' }}>기능</th>
                                </tr>
                            </thead>
                            <tbody>
                                {valueList.map(v => (
                                    <tr key={v.idx}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>{v.optValNm}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', color: v.useYn === 'Y' ? '#2ecc71' : '#95a5a6' }}>{v.useYn}</td>
                                        <td style={{ padding: '4px', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                            {mdfcnYn === 'Y' && <button onClick={() => openUpdate('VALUE', v)} className="admin-btn admin-btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '4px' }}>수정</button>}
                                            {delYn === 'Y' && <button onClick={() => deleteValue(v.idx, selGroupIdx)} className="admin-btn admin-btn-danger" style={{ padding: '2px 6px', fontSize: '11px' }}>삭제</button>}
                                        </td>
                                    </tr>
                                ))}
                                {valueList.length === 0 && <tr><td colSpan="3" style={{ padding: '20px', color: 'var(--text-secondary)' }}>좌측에서 옵션 그룹을 선택하세요.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <OptionModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                targetType={modal.targetType}
                mode={modal.mode}
                formData={form}
                setFormData={setForm}
                handleSave={modal.targetType === 'GROUP' ? saveGroup : saveValue}
            />
        </div>
    );
};

export default AdminProdOptionManage;
