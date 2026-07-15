import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';

const CodeManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';

    // 1. 3분할 데이터 상태 선언
    const [groupList, setGroupList] = useState([]);
    const [midList, setMidList] = useState([]);
    const [detailList, setDetailList] = useState([]);

    // 2. 선택된 항목 상태 선언
    const [selGroupCd, setSelGroupCd] = useState('');
    const [selMidCd, setSelMidCd] = useState('');

    // 3. 모달 제어 상태 선언
    const [modalConfig, setModalConfig] = useState({ isOpen: false, targetType: 'GROUP', mode: 'INSERT' });
    const [groupForm, setGroupForm] = useState({ sysId: defaultSysId, comCd: '', cdNm: '', cdExpl: '' });
    const [detailForm, setDetailForm] = useState({ sysId: defaultSysId, grpCd: '', uprComCd: '', comCd: '', cdNm: '', cdExpl: '', sortOrd: 0, useYn: 'Y' });

    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    useEffect(() => { 
        if (inqireYn === 'Y') {
            fnFetchGroupList(); 
        } else if (inqireYn === 'N') {
            // 조회 권한이 없을 경우 더 이상 호출하지 않음
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [inqireYn]);

    /* ==========================================
     * 통신 비즈니스 로직
     * ========================================== */
    const fnFetchGroupList = async () => {
        const res = await apiClient(`/admin/api/code/group/list?sysId=${defaultSysId}`);
        if (res.ok) setGroupList(await res.json());
    };

    const fnFetchMidList = async (grpCd) => {
        const res = await apiClient(`/admin/api/code/detail/list?sysId=${defaultSysId}&grpCd=${grpCd}&uprComCd=ROOT`);
        if (res.ok) setMidList(await res.json());
    };

    const fnFetchDetailList = async (grpCd, midCd) => {
        const res = await apiClient(`/admin/api/code/detail/list?sysId=${defaultSysId}&grpCd=${grpCd}&uprComCd=${midCd}`);
        if (res.ok) setDetailList(await res.json());
    };

    const handleGroupDelete = async (comCd) => {
        if (!window.confirm("그룹 삭제 시 속한 모든 하위 코드가 삭제됩니다. 진행하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/code/group/delete/${defaultSysId}/${comCd}`, { method: 'DELETE' });
        if (res.ok) { fnFetchGroupList(); setMidList([]); setDetailList([]); setSelGroupCd(''); setSelMidCd(''); }
    };

    const handleDetailDelete = async (targetType, uprComCd, comCd) => {
        if (!window.confirm("해당 코드를 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/code/detail/delete/${defaultSysId}/${selGroupCd}/${uprComCd}/${comCd}`, { method: 'DELETE' });
        if (res.ok) {
            if (targetType === 'MID') { fnFetchMidList(selGroupCd); setDetailList([]); setSelMidCd(''); }
            else { fnFetchDetailList(selGroupCd, selMidCd); }
        }
    };

    /* ==========================================
     * 모달 제어 이벤트 핸들러
     * ========================================== */
    const openInsertModal = (targetType) => {
        if (targetType === 'MID' && !selGroupCd) return alert('좌측에서 상위 그룹 코드를 먼저 선택해주세요.');
        if (targetType === 'DETAIL' && !selMidCd) return alert('중간 레벨 코드를 먼저 선택해주세요.');

        setModalConfig({ isOpen: true, targetType, mode: 'INSERT' });
        if (targetType === 'GROUP') {
            setGroupForm({ sysId: defaultSysId, comCd: '', cdNm: '', cdExpl: '' });
        } else {
            setDetailForm({
                sysId: defaultSysId, grpCd: selGroupCd,
                uprComCd: targetType === 'MID' ? 'ROOT' : selMidCd,
                comCd: '', cdNm: '', cdExpl: '', sortOrd: 0, useYn: 'Y'
            });
        }
    };

    const openUpdateModal = (targetType, data) => {
        setModalConfig({ isOpen: true, targetType, mode: 'UPDATE' });
        if (targetType === 'GROUP') setGroupForm(data);
        else setDetailForm(data);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const isGroup = modalConfig.targetType === 'GROUP';
        const url = isGroup ? '/admin/api/code/group/save' : '/admin/api/code/detail/save';
        const bodyData = isGroup ? groupForm : detailForm;

        const res = await apiClient(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        if (res.ok) {
            alert("정보 저장 처리가 완료되었습니다.");
            setModalConfig({ ...modalConfig, isOpen: false });
            if (modalConfig.targetType === 'GROUP') fnFetchGroupList();
            else if (modalConfig.targetType === 'MID') fnFetchMidList(selGroupCd);
            else fnFetchDetailList(selGroupCd, selMidCd);
        }
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    return (
        <div style={{ display: 'flex', gap: '1.2rem', height: 'calc(100vh - 160px)', position: 'relative' }}>

            {/* [1] 좌측 공통 그룹 코드 보드 */}
            <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <h4 style={{ margin: 0 }}>🗂 1. 공통 그룹 코드</h4>
                    {rgstYn === 'Y' && <button onClick={() => openInsertModal('GROUP')} style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>+ 신규 등록</button>}
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead><tr style={{ background: '#f8f9fa' }}><th>그룹코드</th><th>그룹명</th><th>기능</th></tr></thead>
                        <tbody>
                        {groupList.map(g => (
                            <tr key={g.comCd} onClick={() => { setSelGroupCd(g.comCd); setMidList([]); setDetailList([]); setSelMidCd(''); fnFetchMidList(g.comCd); }} style={{ cursor: 'pointer', background: selGroupCd === g.comCd ? '#e3f2fd' : 'none' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{g.comCd}</td>
                                <td style={{ padding: '8px' }}>{g.cdNm}</td>
                                <td style={{ padding: '4px', textAlign: 'center' }}>
                                    {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); openUpdateModal('GROUP', g); }} style={{ marginRight: '3px' }}>수정</button>}
                                    {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleGroupDelete(g.comCd); }}>삭제</button>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* [2] 중간 레벨 관리 보드 (1:N 계층 관계) */}
            <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <h4 style={{ margin: 0 }}>🏷️ 2. 중간 레벨 관리 {selGroupCd && <span style={{ color: '#2980b9' }}>({selGroupCd})</span>}</h4>
                    {rgstYn === 'Y' && <button onClick={() => openInsertModal('MID')} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>+ 신규 등록</button>}
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead><tr style={{ background: '#f8f9fa' }}><th>코드</th><th>코드명</th><th>기능</th></tr></thead>
                        <tbody>
                        {midList.map(m => (
                            <tr key={m.comCd} onClick={() => { setSelMidCd(m.comCd); setDetailList([]); fnFetchDetailList(selGroupCd, m.comCd); }} style={{ cursor: 'pointer', background: selMidCd === m.comCd ? '#e8f5e9' : 'none' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{m.comCd}</td>
                                <td style={{ padding: '8px' }}>{m.cdNm}</td>
                                <td style={{ padding: '4px', textAlign: 'center' }}>
                                    {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); openUpdateModal('MID', m); }} style={{ marginRight: '3px' }}>수정</button>}
                                    {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleDetailDelete('MID', 'ROOT', m.comCd); }}>삭제</button>}
                                </td>
                            </tr>
                        ))}
                        {midList.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>상위 그룹을 선택하세요.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* [3] 우측 최하위 상세 레벨 관리 보드 (1:N:N 구조 구현) */}
            <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <h4 style={{ margin: 0 }}>📄 3. 상세 레벨 관리 {selMidCd && <span style={{ color: '#2ecc71' }}>({selMidCd})</span>}</h4>
                    {rgstYn === 'Y' && <button onClick={() => openInsertModal('DETAIL')} style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>+ 신규 등록</button>}
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead><tr style={{ background: '#f8f9fa' }}><th>코드</th><th>코드명</th><th>기능</th></tr></thead>
                        <tbody>
                        {detailList.map(d => (
                            <tr key={d.comCd}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{d.comCd}</td>
                                <td style={{ padding: '8px' }}>{d.cdNm}</td>
                                <td style={{ padding: '4px', textAlign: 'center' }}>
                                    {mdfcnYn === 'Y' && <button onClick={() => openUpdateModal('DETAIL', d)} style={{ marginRight: '3px' }}>수정</button>}
                                    {delYn === 'Y' && <button onClick={() => handleDetailDelete('DETAIL', selMidCd, d.comCd)}>삭제</button>}
                                </td>
                            </tr>
                        ))}
                        {detailList.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>중간 코드를 선택하세요.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==========================================================
             * 팝업 모달창 (HTML/CSS 완전 분리 레이아웃 구조)
             * ========================================================== */}
            {modalConfig.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', width: '380px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                        <h4 style={{ margin: '0 0 1rem 0', borderBottom: '2px solid #34495e', paddingBottom: '5px' }}>
                            ⚙️ [{modalConfig.targetType}] 코드 {modalConfig.mode === 'INSERT' ? '신규 등록' : '정보 수정'}
                        </h4>
                        <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {modalConfig.targetType === 'GROUP' ? (
                                <>
                                    <input type="text" placeholder="그룹 코드 (영문)" value={groupForm.comCd} onChange={e => setGroupForm({ ...groupForm, comCd: e.target.value.toUpperCase() })} required disabled={modalConfig.mode === 'UPDATE'} style={{ padding: '6px' }} />
                                    <input type="text" placeholder="그룹 코드 명칭" value={groupForm.cdNm} onChange={e => setGroupForm({ ...groupForm, cdNm: e.target.value })} required style={{ padding: '6px' }} />
                                    <input type="text" placeholder="그룹 설명 기술" value={groupForm.cdExpl || ''} onChange={e => setGroupForm({ ...groupForm, cdExpl: e.target.value })} style={{ padding: '6px' }} />
                                </>
                            ) : (
                                <>
                                    <input type="text" placeholder="부모 연결 ID" value={detailForm.uprComCd} readOnly style={{ padding: '6px', background: '#eee' }} />
                                    <input type="text" placeholder="코드 ID" value={detailForm.comCd} onChange={e => setDetailForm({ ...detailForm, comCd: e.target.value.toUpperCase() })} required disabled={modalConfig.mode === 'UPDATE'} style={{ padding: '6px' }} />
                                    <input type="text" placeholder="상세코드 명칭" value={detailForm.cdNm} onChange={e => setDetailForm({ ...detailForm, cdNm: e.target.value })} required style={{ padding: '6px' }} />
                                    <input type="text" placeholder="코드 요약 기술 설명" value={detailForm.cdExpl || ''} onChange={e => setDetailForm({ ...detailForm, cdExpl: e.target.value })} style={{ padding: '6px' }} />
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <input type="number" placeholder="순서" value={detailForm.sortOrd} onChange={e => setDetailForm({ ...detailForm, sortOrd: parseInt(e.target.value) || 0 })} style={{ flex: 1, padding: '6px' }} />
                                        <select value={detailForm.useYn} onChange={e => setDetailForm({ ...detailForm, useYn: e.target.value })} style={{ padding: '6px' }}>
                                            <option value="Y">사용 (Y)</option>
                                            <option value="N">중지 (N)</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem' }}>
                                <button type="submit" style={{ flex: 1, padding: '8px', background: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>저장</button>
                                <button type="button" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} style={{ flex: 1, padding: '8px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>취소</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeManage;
