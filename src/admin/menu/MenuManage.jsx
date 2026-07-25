import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import CommonCodePicker from '../../components/CommonCodePicker';
import { apiClient } from '../../utils/apiClient';
import { useMenuManage } from './hooks/useMenuManage';
import MenuModal from './components/MenuModal';

const MenuManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { isTrueSuperAdmin } = useOutletContext();

    const {
        sysSectCd, setSysSectCd,
        mainMenuList, midMenuList, subMenuList,
        selMainId, setSelMainId,
        selMidId, setSelMidId,
        setMidMenuList, setSubMenuList,
        fetchMainMenu, fetchMidMenu, fetchSubMenu,
        handleMenuLogicalDelete, saveMenu,
        moveMainItem, moveMidItem, moveSubItem,
        saveMainOrder, saveMidOrder, saveSubOrder
    } = useMenuManage(defaultSysId);

    const [targetBrdList, setTargetBrdList] = useState([]);
    const [useYnList, setUseYnList] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, type: 'MAIN', mode: 'INSERT' });
    const [isBrdMapping, setIsBrdMapping] = useState(false);
    const [menuForm, setMenuForm] = useState({
        sysId: defaultSysId, menuId: '', uprMenuId: 'ROOT', sysSectCd: 'MG',
        menuNm: '', menuUrl: '', compPath: '', brdId: '', menuIcon: '', menuKwd: '', sortOrd: 0, useYn: 'Y', sensitiveYn: 'N'
    });

    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    useEffect(() => { 
        if (inqireYn === 'Y') {
            fetchMainMenu(sysSectCd); 
            fnFetchUseYnCodes();
        }
    }, [sysSectCd, inqireYn, fetchMainMenu]);

    const fnFetchUseYnCodes = async () => {
        const res = await apiClient('/admin/api/board/common/code', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, grpCd: 'USE_YN', uprComCd: 'ROOT' })
        });
        if (res.ok) {
            setUseYnList(await res.json());
        }
    };

    const fnFetchTargetBoards = async () => {
        const res = await apiClient('/admin/api/board/managing/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId })
        });
        if (res.ok) {
            const allBoards = await res.json();
            const filtered = allBoards.filter(b => b.delYn === 'N');
            setTargetBrdList(filtered);
            return filtered;
        }
        return [];
    };

    const handleOpenInsert = (targetType) => {
        if (targetType === 'MID' && !selMainId) return alert('대메뉴를 먼저 선택해 주세요.');
        if (targetType === 'SUB' && !selMidId) return alert('중간단계 메뉴를 먼저 선택해 주세요.');

        setModal({ isOpen: true, type: targetType, mode: 'INSERT' });
        setIsBrdMapping(false);
        setTargetBrdList([]);
        fnFetchTargetBoards();

        setMenuForm({
            sysId: defaultSysId, menuId: '',
            uprMenuId: targetType === 'MAIN' ? 'ROOT' : (targetType === 'MID' ? selMainId : selMidId),
            sysSectCd: sysSectCd, menuNm: '', menuUrl: '', compPath: '', brdId: '', menuIcon: '', menuKwd: '', sortOrd: 0, useYn: 'Y', sensitiveYn: 'N'
        });
    };

    const handleOpenUpdate = (targetType, data) => {
        setModal({ isOpen: true, type: targetType, mode: 'UPDATE' });
        setMenuForm(data);

        fnFetchTargetBoards().then((boards) => {
            setIsBrdMapping(!!data.brdId);
        });
    };

    const handleModalFormSubmit = async (e) => {
        e.preventDefault();
        if (isBrdMapping && !menuForm.brdId) {
            return alert("게시판 매핑이 활성되었습니다. 결합할 게시판을 선택해주세요.");
        }
        const submitParam = { ...menuForm, brdId: isBrdMapping ? menuForm.brdId : '' };
        const success = await saveMenu(submitParam, modal.type);
        if (success) {
            setModal({ ...modal, isOpen: false });
        }
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>조회 권한이 없습니다.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: 'calc(100vh - 120px)' }}>

            {/* 상단 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', justifyContent: 'flex-start', gap: '24px' }}>
                    <span className="admin-card-title">메뉴 시스템 관리</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>시스템 영역 선택:</span>
                        <CommonCodePicker 
                            grpCd="SYS_SE_CD" 
                            type="radio" 
                            name="sect" 
                            value={sysSectCd} 
                            onChange={(e) => { 
                                setSysSectCd(e.target.value); 
                                setMidMenuList([]); 
                                setSubMenuList([]); 
                                setSelMainId(''); 
                                setSelMidId(''); 
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* 3분할 본문 */}
            <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
                {/* 1. 대메뉴 */}
                <div className="admin-card" style={{ flex: 1 }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">1단계 메뉴</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {mdfcnYn === 'Y' && <button onClick={saveMainOrder} className="admin-btn admin-btn-secondary">순서 저장</button>}
                            {rgstYn === 'Y' && <button onClick={() => handleOpenInsert('MAIN')} className="admin-btn admin-btn-success">등록</button>}
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <tbody>
                            {mainMenuList.map((m, idx) => (
                                <tr key={m.menuId}
                                    onClick={() => { setSelMainId(m.menuId); setMidMenuList([]); setSubMenuList([]); setSelMidId(''); fetchMidMenu(sysSectCd, m.menuId); }}
                                    style={{ cursor: 'pointer', background: selMainId === m.menuId ? 'rgba(52, 152, 219, 0.1)' : 'transparent', borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{m.menuNm}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{m.menuId}</div>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        {mdfcnYn === 'Y' && (
                                            <span style={{ display: 'inline-flex', gap: '2px', marginRight: '4px' }}>
                                                <button onClick={(e) => { e.stopPropagation(); moveMainItem(idx, -1); }} disabled={idx === 0} className="admin-btn admin-btn-secondary" style={{ padding: '4px 6px' }}>▲</button>
                                                <button onClick={(e) => { e.stopPropagation(); moveMainItem(idx, 1); }} disabled={idx === mainMenuList.length - 1} className="admin-btn admin-btn-secondary" style={{ padding: '4px 6px' }}>▼</button>
                                            </span>
                                        )}
                                        {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleOpenUpdate('MAIN', m); }} className="admin-btn admin-btn-secondary" style={{ marginRight: '4px', padding: '4px 8px' }}>수정</button>}
                                        {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleMenuLogicalDelete('MAIN', m.menuId); }} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px' }}>삭제</button>}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. 중메뉴 */}
                <div className="admin-card" style={{ flex: 1 }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">2단계 메뉴 {selMainId && <span style={{color: 'var(--primary-color)', fontSize: '12px', marginLeft: '6px'}}>{selMainId}</span>}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {mdfcnYn === 'Y' && <button onClick={saveMidOrder} className="admin-btn admin-btn-secondary">순서 저장</button>}
                            {rgstYn === 'Y' && <button onClick={() => handleOpenInsert('MID')} className="admin-btn admin-btn-success">등록</button>}
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <tbody>
                            {midMenuList.map((m, idx) => (
                                <tr key={m.menuId}
                                    onClick={() => { setSelMidId(m.menuId); setSubMenuList([]); fetchSubMenu(sysSectCd, m.menuId); }}
                                    style={{ cursor: 'pointer', background: selMidId === m.menuId ? 'rgba(46, 204, 113, 0.1)' : 'transparent', borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{m.menuNm}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{m.menuId}</div>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        {mdfcnYn === 'Y' && (
                                            <span style={{ display: 'inline-flex', gap: '2px', marginRight: '4px' }}>
                                                <button onClick={(e) => { e.stopPropagation(); moveMidItem(idx, -1); }} disabled={idx === 0} className="admin-btn admin-btn-secondary" style={{ padding: '4px 6px' }}>▲</button>
                                                <button onClick={(e) => { e.stopPropagation(); moveMidItem(idx, 1); }} disabled={idx === midMenuList.length - 1} className="admin-btn admin-btn-secondary" style={{ padding: '4px 6px' }}>▼</button>
                                            </span>
                                        )}
                                        {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleOpenUpdate('MID', m); }} className="admin-btn admin-btn-secondary" style={{ marginRight: '4px', padding: '4px 8px' }}>수정</button>}
                                        {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleMenuLogicalDelete('MID', m.menuId); }} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px' }}>삭제</button>}
                                    </td>
                                </tr>
                            ))}
                            {midMenuList.length === 0 && <tr><td style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>상위 메뉴를 선택해주세요.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. 소메뉴 */}
                <div className="admin-card" style={{ flex: 2 }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">3단계 메뉴 (상세) {selMidId && <span style={{color: 'var(--primary-color)', fontSize: '12px', marginLeft: '6px'}}>{selMidId}</span>}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {mdfcnYn === 'Y' && <button onClick={saveSubOrder} className="admin-btn admin-btn-secondary">순서 저장</button>}
                            {rgstYn === 'Y' && <button onClick={() => handleOpenInsert('SUB')} className="admin-btn admin-btn-primary">신규 등록</button>}
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--table-header-bg)' }}>
                                    <th style={{ padding: '12px' }}>메뉴명/ID</th>
                                    <th style={{ padding: '12px' }}>연결 정보</th>
                                    <th style={{ padding: '12px', width: '160px', textAlign: 'center' }}>조작</th>
                                </tr>
                            </thead>
                            <tbody>
                            {subMenuList.map((s, idx) => (
                                <tr key={s.menuId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{s.menuNm}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.menuId}</div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                            {s.brdId ? <span style={{ background: 'rgba(230, 126, 34, 0.1)', color: '#e67e22', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>게시판 연동: {s.brdId}</span>
                                                     : <span style={{ background: 'rgba(149, 165, 166, 0.1)', color: '#7f8c8d', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>컴포넌트</span>}
                                            {s.menuKwd && s.menuKwd.split(',').map((kwd, i) => (
                                                <span key={i} style={{ background: 'var(--table-header-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>#{kwd.trim()}</span>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--primary-color)' }}>{s.menuUrl || s.compPath || '경로 없음'}</div>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                        {mdfcnYn === 'Y' && (
                                            <span style={{ display: 'inline-flex', gap: '2px', marginRight: '4px' }}>
                                                <button onClick={() => moveSubItem(idx, -1)} disabled={idx === 0} className="admin-btn admin-btn-secondary" style={{ padding: '4px 6px' }}>▲</button>
                                                <button onClick={() => moveSubItem(idx, 1)} disabled={idx === subMenuList.length - 1} className="admin-btn admin-btn-secondary" style={{ padding: '4px 6px' }}>▼</button>
                                            </span>
                                        )}
                                        {mdfcnYn === 'Y' && <button onClick={() => handleOpenUpdate('SUB', s)} className="admin-btn admin-btn-secondary" style={{ marginRight: '4px', padding: '4px 8px' }}>수정</button>}
                                        {delYn === 'Y' && <button onClick={() => handleMenuLogicalDelete('SUB', s.menuId)} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px' }}>삭제</button>}
                                    </td>
                                </tr>
                            ))}
                            {subMenuList.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>하위 메뉴가 없습니다.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <MenuModal
                modal={modal}
                setModal={setModal}
                menuForm={menuForm}
                setMenuForm={setMenuForm}
                sysSectCd={sysSectCd}
                isBrdMapping={isBrdMapping}
                setIsBrdMapping={setIsBrdMapping}
                targetBrdList={targetBrdList}
                useYnList={useYnList}
                handleModalFormSubmit={handleModalFormSubmit}
                isTrueSuperAdmin={isTrueSuperAdmin}
            />

        </div>
    );
};

export default MenuManage;
