import React, { useState } from 'react';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useCodeManage } from './hooks/useCodeManage';
import CodeModal from './components/CodeModal';

const CodeManage = () => {
    // 공통코드는 업체별로 복제/관리하지 않고 항상 CORE 코드만 다룸 - 업체 컨텍스트로 전환되어 있어도 고정
    const defaultSysId = 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth(MENU_IDS.CODE);

    const {
        groupList, midList, detailList,
        selGroupCd, setSelGroupCd,
        selMidCd, setSelMidCd,
        setMidList, setDetailList,
        fnFetchMidList, fnFetchDetailList,
        handleGroupDelete, handleDetailDelete, saveCode
    } = useCodeManage(defaultSysId, inqireYn);

    const [modalConfig, setModalConfig] = useState({ isOpen: false, targetType: 'GROUP', mode: 'INSERT' });
    const [formData, setFormData] = useState({});

    const openInsertModal = (targetType) => {
        if (targetType === 'MID' && !selGroupCd) return alert('좌측에서 상위 그룹 코드를 먼저 선택해주세요.');
        if (targetType === 'DETAIL' && !selMidCd) return alert('중간 레벨 코드를 먼저 선택해주세요.');

        setModalConfig({ isOpen: true, targetType, mode: 'INSERT' });
        if (targetType === 'GROUP') {
            setFormData({ sysId: defaultSysId, comCd: '', cdNm: '', cdExpl: '' });
        } else {
            setFormData({
                sysId: defaultSysId, grpCd: selGroupCd,
                uprComCd: targetType === 'MID' ? 'ROOT' : selMidCd,
                comCd: '', cdNm: '', cdExpl: '', sortOrd: 0, useYn: 'Y'
            });
        }
    };

    const openUpdateModal = (targetType, data) => {
        setModalConfig({ isOpen: true, targetType, mode: 'UPDATE' });
        setFormData(data);
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            
            {/* 상단 검색 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title">공통코드 검색</span>
                </div>
                {/* 
                <div className="admin-card-body" style={{ padding: '0' }}>
                    <div className="admin-form-row" style={{ borderBottom: 'none' }}>
                        <div className="admin-form-label" style={{ width: '120px' }}>시스템 구분</div>
                        <div className="admin-form-control">
                            <label style={{ marginRight: '15px' }}><input type="radio" checked={true} readOnly style={{ marginRight: '5px' }} />현재 접속 시스템 ({defaultSysId})</label>
                        </div>
                    </div>
                </div>
                */}
            </div>

            {/* 3분할 데이터 영역 */}
            <div style={{ display: 'flex', gap: '1.2rem', height: 'calc(100vh - 280px)', position: 'relative' }}>

                {/* [1] 좌측 공통 그룹 코드 보드 */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>1. 공통 그룹 코드</span>
                    {rgstYn === 'Y' && <button onClick={() => openInsertModal('GROUP')} className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: '12px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 등록</button>}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>그룹코드</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>그룹명</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>기능</th>
                            </tr>
                        </thead>
                        <tbody>
                        {groupList.map(g => (
                            <tr key={g.comCd} onClick={() => { setSelGroupCd(g.comCd); setMidList([]); setDetailList([]); setSelMidCd(''); fnFetchMidList(g.comCd); }} style={{ cursor: 'pointer', background: selGroupCd === g.comCd ? '#e3f2fd' : 'none' }}>
                                <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>{g.comCd}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)' }}>{g.cdNm}</td>
                                <td style={{ padding: '4px', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                    {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); openUpdateModal('GROUP', g); }} className="admin-btn admin-btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '4px' }}>수정</button>}
                                    {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleGroupDelete(g.comCd); }} className="admin-btn admin-btn-danger" style={{ padding: '2px 6px', fontSize: '11px' }}>삭제</button>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* [2] 중간 레벨 관리 보드 (1:N 계층 관계) */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span className="admin-card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>2. 중간 레벨 관리 {selGroupCd && <span style={{ color: 'var(--primary-color)' }}>({selGroupCd})</span>}</span>
                    {rgstYn === 'Y' && <button onClick={() => openInsertModal('MID')} className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: '12px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 등록</button>}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>코드</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>코드명</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>기능</th>
                            </tr>
                        </thead>
                        <tbody>
                        {midList.map(m => (
                            <tr key={m.comCd} onClick={() => { setSelMidCd(m.comCd); setDetailList([]); fnFetchDetailList(selGroupCd, m.comCd); }} style={{ cursor: 'pointer', background: selMidCd === m.comCd ? '#e8f5e9' : 'none' }}>
                                <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>{m.comCd}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)' }}>{m.cdNm}</td>
                                <td style={{ padding: '4px', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                    {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); openUpdateModal('MID', m); }} className="admin-btn admin-btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '4px' }}>수정</button>}
                                    {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleDetailDelete('MID', 'ROOT', m.comCd); }} className="admin-btn admin-btn-danger" style={{ padding: '2px 6px', fontSize: '11px' }}>삭제</button>}
                                </td>
                            </tr>
                        ))}
                        {midList.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>상위 그룹을 선택하세요.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* [3] 우측 최하위 상세 레벨 관리 보드 (1:N:N 구조 구현) */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span className="admin-card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>3. 상세 레벨 관리 {selMidCd && <span style={{ color: '#2ecc71' }}>({selMidCd})</span>}</span>
                    {rgstYn === 'Y' && <button onClick={() => openInsertModal('DETAIL')} className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: '12px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 등록</button>}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>코드</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>코드명</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>기능</th>
                            </tr>
                        </thead>
                        <tbody>
                        {detailList.map(d => (
                            <tr key={d.comCd}>
                                <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>{d.comCd}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)' }}>{d.cdNm}</td>
                                <td style={{ padding: '4px', borderBottom: '1px solid var(--border-color)' }}>
                                    {mdfcnYn === 'Y' && <button onClick={() => openUpdateModal('DETAIL', d)} className="admin-btn admin-btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '4px' }}>수정</button>}
                                    {delYn === 'Y' && <button onClick={() => handleDetailDelete('DETAIL', selMidCd, d.comCd)} className="admin-btn admin-btn-danger" style={{ padding: '2px 6px', fontSize: '11px' }}>삭제</button>}
                                </td>
                            </tr>
                        ))}
                        {detailList.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>중간 코드를 선택하세요.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <CodeModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                targetType={modalConfig.targetType}
                mode={modalConfig.mode}
                formData={formData}
                setFormData={setFormData}
                handleSave={saveCode}
            />
            </div>
        </div>
    );
};

export default CodeManage;
