import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';
import CommonCodePicker from '../../components/CommonCodePicker';

const MenuManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';

    // 1. 관리 섹션 분할 상태 변수
    const [sysSectCd, setSysSectCd] = useState('MG');
    const [mainMenuList, setMainMenuList] = useState([]);
    const [midMenuList, setMidMenuList] = useState([]);
    const [subMenuList, setSubMenuList] = useState([]);

    // 2. 모달 하위 동적 셀렉트박스용 코드 디렉토리풀 변수
    const [targetBrdList, setTargetBrdList] = useState([]);
    const [useYnList, setUseYnList] = useState([]);

    // 3. 계층 추적 부모 ID 식별 변수
    // dup removed
    const [selMainId, setSelMainId] = useState('');
    const [selMidId, setSelMidId] = useState('');

    // 4. 모달 조립 상태 구조 정의 (CamelCase 사전 준비)
    const [modal, setModal] = useState({ isOpen: false, type: 'MAIN', mode: 'INSERT' });
    const [isBrdMapping, setIsBrdMapping] = useState(false);

    const [menuForm, setMenuForm] = useState({
        sysId: defaultSysId, menuId: '', uprMenuId: 'ROOT', sysSectCd: 'MG',
        menuNm: '', menuUrl: '', compPath: '', brdId: '', menuIcon: '', menuKwd: '', sortOrd: 0, useYn: 'Y'
    });

    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    useEffect(() => { 
        if (inqireYn === 'Y') {
            fnFetchMainMenu(sysSectCd); 
            fnFetchUseYnCodes();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [sysSectCd, inqireYn]);

    const fnFetchMainMenu = async (sect) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: 'ROOT' })
        });
        if (res.ok) setMainMenuList(await res.json());
    };

    const fnFetchMidMenu = async (sect, parentId) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: parentId })
        });
        if (res.ok) setMidMenuList(await res.json());
    };

    const fnFetchSubMenu = async (sect, parentId) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: parentId })
        });
        if (res.ok) setSubMenuList(await res.json());
    };

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

    const handleMenuLogicalDelete = async (targetType, menuId) => {
        if (!window.confirm("선택 메뉴를 논리 삭제(마킹) 처리하시겠습니까?\n하위 상세 계층도 시스템에서 제외 처리됩니다.")) return;
        const res = await apiClient(`/admin/api/menu/delete/${defaultSysId}/${menuId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("메뉴가 논리 삭제(del_yn='Y') 되었습니다.");
            if (targetType === 'MAIN') { fnFetchMainMenu(sysSectCd); setMidMenuList([]); setSubMenuList([]); setSelMainId(''); setSelMidId(''); }
            else if (targetType === 'MID') { fnFetchMidMenu(sysSectCd, selMainId); setSubMenuList([]); setSelMidId(''); }
            else { fnFetchSubMenu(sysSectCd, selMidId); }
        }
    };

    const handleOpenInsert = (targetType) => {
        if (targetType === 'MID' && !selMainId) return alert('좌측 상단의 대메뉴를 먼저 클릭 지정해 주세요.');
        if (targetType === 'SUB' && !selMidId) return alert('좌측 하단의 중간단계 메뉴를 먼저 선택해주세요.');

        setModal({ isOpen: true, type: targetType, mode: 'INSERT' });
        setIsBrdMapping(false);
        setTargetBrdList([]);
        fnFetchTargetBoards();

        setMenuForm({
            sysId: defaultSysId, menuId: '',
            uprMenuId: targetType === 'MAIN' ? 'ROOT' : (targetType === 'MID' ? selMainId : selMidId),
            sysSectCd: sysSectCd, menuNm: '', menuUrl: '', compPath: '', brdId: '', menuIcon: '', menuKwd: '', sortOrd: 0, useYn: 'Y'
        });
    };

    const handleOpenUpdate = (targetType, data) => {
        setModal({ isOpen: true, type: targetType, mode: 'UPDATE' });
        setMenuForm(data);

        fnFetchTargetBoards().then((boards) => {
            if (data.brdId) {
                setIsBrdMapping(true);
            } else {
                setIsBrdMapping(false);
            }
        });
    };

    const handleModalFormSubmit = async (e) => {
        e.preventDefault();
        if (isBrdMapping && !menuForm.brdId) {
            return alert("게시판 매핑이 활성되었습니다. 결합할 게시판을 선택해주세요.");
        }

        const submitParam = { ...menuForm, brdId: isBrdMapping ? menuForm.brdId : '' };

        const res = await apiClient('/admin/api/menu/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitParam)
        });

        if (res.ok) {
            alert("메뉴 아키텍처 정보가 성공적으로 저장되었습니다.");
            setModal({ ...modal, isOpen: false });
            if (modal.type === 'MAIN') fnFetchMainMenu(sysSectCd);
            else if (modal.type === 'MID') fnFetchMidMenu(sysSectCd, selMainId);
            else fnFetchSubMenu(sysSectCd, selMidId);
        }
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 160px)' }}>

            {/* 상단 전역 시스템구분 분류 라디오버튼 */}
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>전체 메뉴 마스터링 선택:</span>
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

            {/* 좌우 비대칭 2분할 배치 섹션 */}
            <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                {/* 좌측 선택 존 (대메뉴 상단 / 중간메뉴 하단 배치 구조) */}
                <div style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>

                    {/* [대메뉴 박스] */}
                    <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h5 style={{ margin: 0 }}>▶ 1. 대메뉴 목록</h5>
                            {rgstYn === 'Y' && <button onClick={() => handleOpenInsert('MAIN')} style={{ padding: '3px 8px', fontSize: '11px', background: '#2ecc71', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>+ 등록</button>}
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <tbody>
                                {mainMenuList.map(m => (
                                    <tr key={m.menuId} onClick={() => { setSelMainId(m.menuId); setMidMenuList([]); setSubMenuList([]); setSelMidId(''); fnFetchMidMenu(sysSectCd, m.menuId); }} style={{ cursor: 'pointer', background: selMainId === m.menuId ? '#e3f2fd' : 'none' }}>
                                        <td style={{ padding: '6px', fontWeight: 'bold' }}>{m.menuNm} <span style={{color:'#aaa', fontSize:'10px'}}>({m.menuId})</span></td>
                                        <td style={{ padding: '3px', textAlign: 'center', width: '85px' }}>
                                            {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleOpenUpdate('MAIN', m); }} style={{fontSize:'11px', marginRight:'2px'}}>수정</button>}
                                            {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleMenuLogicalDelete('MAIN', m.menuId); }} style={{fontSize:'11px'}}>삭제</button>}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* [중간단계 메뉴 박스] */}
                    <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h5 style={{ margin: 0 }}>▶ 2. 중간단계 메뉴보드 {selMainId && <span style={{color:'#2980b9'}}>({selMainId})</span>}</h5>
                            {rgstYn === 'Y' && <button onClick={() => handleOpenInsert('MID')} style={{ padding: '3px 8px', fontSize: '11px', background: '#3498db', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>+ 등록</button>}
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <tbody>
                                {midMenuList.map(m => (
                                    <tr key={m.menuId} onClick={() => { setSelMidId(m.menuId); setSubMenuList([]); fnFetchSubMenu(sysSectCd, m.menuId); }} style={{ cursor: 'pointer', background: selMidId === m.menuId ? '#e8f5e9' : 'none' }}>
                                        <td style={{ padding: '6px', fontWeight: 'bold' }}>{m.menuNm}</td>
                                        <td style={{ padding: '3px', textAlign: 'center', width: '85px' }}>
                                            {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleOpenUpdate('MID', m); }} style={{fontSize:'11px', marginRight:'2px'}}>수정</button>}
                                            {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleMenuLogicalDelete('MID', m.menuId); }} style={{fontSize:'11px'}}>삭제</button>}
                                        </td>
                                    </tr>
                                ))}
                                {midMenuList.length === 0 && <tr><td style={{textAlign:'center', padding:'15px', color:'#aaa'}}>대메뉴를 먼저 선택하십시오.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* 우측 독립 리스트 (상세 메뉴 노출 구역 수직 확장) */}
                <div style={{ flex: 1, background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <h4 style={{ margin: 0 }}>▶ 3. 상세 메뉴 종합 리스트 {selMidId && <span style={{ color: '#2ecc71' }}>[{selMidId}]</span>}</h4>
                        {rgstYn === 'Y' && <button onClick={() => handleOpenInsert('SUB')} style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>+ 상세메뉴 신규 등록</button>}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                            <thead>
                            <tr style={{ background: '#2c3e50', color: '#fff' }}>
                                <th style={{ padding: '10px' }}>상세 메뉴 ID</th>
                                <th>상세 메뉴명</th>
                                <th>매핑 키워드</th>
                                <th>라우팅 주소 (Path)</th>
                                <th>결합 컴포넌트</th>
                                <th>연동 게시판 ID</th>
                                <th style={{ textAlign: 'center' }}>조작</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subMenuList.map(s => (
                                <tr key={s.menuId}>
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.menuId}</td>
                                    <td style={{ padding: '10px' }}>{s.menuNm}</td>
                                    <td style={{ padding: '10px' }}>
                                        {s.menuKwd ? s.menuKwd.split(',').map((kwd, i) => (
                                            <span key={i} style={{ display: 'inline-block', background: '#34495e', color: '#fff', fontSize: '10px', padding: '2px 5px', borderRadius: '3px', marginRight: '3px', marginBottom: '3px' }}>#{kwd.trim()}</span>
                                        )) : <span style={{ color: '#aaa', fontSize: '11px' }}>없음</span>}
                                    </td>
                                    <td style={{ padding: '10px', color: '#2980b9' }}>{s.menuUrl || 'N/A'}</td>
                                    <td style={{ padding: '10px', color: '#7f8c8d' }}>{s.compPath || 'N/A'}</td>
                                    <td style={{ padding: '10px' }}>
                                        {s.brdId ? <span style={{ background: '#fff3cd', color: '#d35400', padding: '3px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px' }}>연동 {s.brdId}</span> : <span style={{ color: '#aaa', fontSize: '11px' }}>일반 화면</span>}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'center', width: '100px' }}>
                                        {mdfcnYn === 'Y' && <button onClick={() => handleOpenUpdate('SUB', s)} style={{ marginRight: '3px' }}>수정</button>}
                                        {delYn === 'Y' && <button onClick={() => handleMenuLogicalDelete('SUB', s.menuId)}>삭제</button>}
                                    </td>
                                </tr>
                            ))}
                            {subMenuList.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999', fontWeight: 'bold' }}>중간 레벨 단계를 선택하시면 상세 라우팅 정보가 길게 펼쳐집니다.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* ==========================================================
             * 지능형 동적 스왑 매핑 폼 모달 팝업 레이어 창
             * ========================================================== */}
            {modal.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', width: '430px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h4 style={{ margin: '0 0 1rem 0', borderBottom: '2px solid #e67e22', paddingBottom: '6px' }}>
                            ▶ [{modal.type}] 메뉴 노드 구성 정보 설정
                        </h4>
                        <form onSubmit={handleModalFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>

                            <label style={{fontSize:'12px', fontWeight:'bold'}}>부모 노드 식별: <input type="text" value={menuForm.uprMenuId} readOnly style={{ padding: '5px', width: '100%', background: '#eee', border: '1px solid #ccc' }} /></label>
                            <input type="text" placeholder="메뉴 문자열 고유 식별 ID (영문자)" value={menuForm.menuId} onChange={e => setMenuForm({ ...menuForm, menuId: e.target.value.toUpperCase() })} required disabled={modal.mode === 'UPDATE'} style={{ padding: '6px' }} />
                            <input type="text" placeholder="화면 표시 메뉴 이름" value={menuForm.menuNm} onChange={e => setMenuForm({ ...menuForm, menuNm: e.target.value })} required style={{ padding: '6px' }} />
                            <input type="text" placeholder="브라우저 주소창 라우팅 경로 (path)" value={menuForm.menuUrl || ''} onChange={e => setMenuForm({ ...menuForm, menuUrl: e.target.value })} disabled={isBrdMapping} style={{ padding: '6px', background: isBrdMapping ? '#eee' : '#fff' }} />
                            <input type="text" placeholder="물리 파일 컴포넌트 위치 소스 주소" value={menuForm.compPath || ''} onChange={e => setMenuForm({ ...menuForm, compPath: e.target.value })} style={{ padding: '6px' }} />

                            <div style={{ borderTop: '1px dashed #ccc', margin: '5px 0' }}></div>
                            <input type="text" placeholder="지능형 검색 매핑 키워드 (콤마 단위로 복수 등록 가능)" value={menuForm.menuKwd || ''} onChange={e => setMenuForm({ ...menuForm, menuKwd: e.target.value })} style={{ padding: '6px', borderColor: '#2980b9' }} />

                            {/* 동적 게시판 옵션 결합 스위치 */}
                            <div style={{ background: '#fff8f0', padding: '0.8rem', borderRadius: '6px', border: '1px solid #f39c12', marginTop: '5px' }}>
                                <label style={{ fontWeight: 'bold', color: '#d35400', fontSize: '13px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={isBrdMapping} onChange={(e) => { 
                                        const checked = e.target.checked;
                                        setIsBrdMapping(checked); 
                                        if(!checked) {
                                            setMenuForm({...menuForm, brdId: '', menuUrl: ''}); 
                                        } else {
                                            // 체크 시 게시판 선택 전이므로 url은 비워두고 기본 셋팅
                                            setMenuForm({...menuForm, brdId: '', menuUrl: ''});
                                        }
                                    }} /> 동적 아키텍처 게시판 스왑 맵핑 활성
                                </label>

                                {isBrdMapping && (
                                    <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fff', padding: '0.6rem', borderRadius: '4px', border: '1px solid #fddc9b' }}>
                                        {/* 최종 결합 게시판 ID 드롭다운 (카테고리 분리 의존성 제거) */}
                                        <select value={menuForm.brdId || ''} onChange={e => {
                                            const selectedBrdId = e.target.value;
                                            const prefix = sysSectCd === 'MG' ? '/admin/board/view/' : '/user/board/view/';
                                            setMenuForm({ ...menuForm, brdId: selectedBrdId, menuUrl: selectedBrdId ? prefix + selectedBrdId : '' });
                                        }} required style={{ padding: '6px', width: '100%', borderColor: '#e67e22', fontSize: '12px', fontWeight: 'bold' }}>
                                            <option value="">-- 맵핑 결합 연동 게시판 선택 --</option>
                                            {targetBrdList.map(b => (
                                                <option key={b.brdId} value={b.brdId}>[ {b.brdId} ] - {b.brdNm}</option>
                                            ))}
                                        </select>
                                        {targetBrdList.length === 0 && <span style={{fontSize:'11px', color:'#e74c3c'}}>▶ 생성 완료된 오픈 게시판이 하나도 없습니다.</span>}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
                                <input type="number" placeholder="출력 정렬 순서" value={menuForm.sortOrd} onChange={e => setMenuForm({ ...menuForm, sortOrd: parseInt(e.target.value) || 0 })} style={{ flex: 1, padding: '5px' }} />
                                <select value={menuForm.useYn} onChange={e => setMenuForm({ ...menuForm, useYn: e.target.value })} style={{ padding: '5px', width: '100px' }}>
                                    {useYnList.length > 0 ? (
                                        useYnList.map(c => <option key={c.comCd} value={c.comCd}>{c.cdNm}</option>)
                                    ) : (
                                        <>
                                            <option value="Y">노출 (Y)</option>
                                            <option value="N">숨김 (N)</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem' }}>
                                <button type="submit" style={{ flex: 1, padding: '10px', background: '#2c3e50', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>메뉴 아키텍처 저장</button>
                                <button type="button" onClick={() => setModal({ ...modal, isOpen: false })} style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>닫기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MenuManage;
