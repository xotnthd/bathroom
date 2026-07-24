import React from 'react';

const MenuModal = ({
    modal,
    setModal,
    menuForm,
    setMenuForm,
    sysSectCd,
    isBrdMapping,
    setIsBrdMapping,
    targetBrdList,
    useYnList,
    handleModalFormSubmit
}) => {
    if (!modal.isOpen) return null;

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content">
                <h4 style={{ margin: '0 0 1rem 0', borderBottom: '2px solid #3498db', paddingBottom: '6px' }}>
                    [{modal.type}] 메뉴 노드 구성 정보 설정
                </h4>
                <form onSubmit={handleModalFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        부모 노드 식별: 
                        <input type="text" value={menuForm.uprMenuId} readOnly style={{ padding: '6px', width: '100%', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
                    </label>

                    <input type="text" placeholder="메뉴 고유 식별 ID (영문자)" value={menuForm.menuId} onChange={e => setMenuForm({ ...menuForm, menuId: e.target.value.toUpperCase() })} required disabled={modal.mode === 'UPDATE'} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <input type="text" placeholder="화면 표시 메뉴 이름" value={menuForm.menuNm} onChange={e => setMenuForm({ ...menuForm, menuNm: e.target.value })} required style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <input type="text" placeholder="브라우저 라우팅 경로 (path)" value={menuForm.menuUrl || ''} onChange={e => setMenuForm({ ...menuForm, menuUrl: e.target.value })} disabled={isBrdMapping} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', background: isBrdMapping ? '#f8f9fa' : '#fff' }} />
                    <input type="text" placeholder="물리 파일 컴포넌트 위치 소스 주소" value={menuForm.compPath || ''} onChange={e => setMenuForm({ ...menuForm, compPath: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />

                    <div style={{ borderTop: '1px dashed #ccc', margin: '5px 0' }}></div>
                    <input type="text" placeholder="검색 매핑 키워드 (콤마 단위로 복수 등록 가능)" value={menuForm.menuKwd || ''} onChange={e => setMenuForm({ ...menuForm, menuKwd: e.target.value })} style={{ padding: '8px', border: '1px solid #3498db', borderRadius: '4px' }} />

                    {/* 동적 게시판 옵션 결합 스위치 */}
                    <div style={{ background: '#f0f8ff', padding: '12px', borderRadius: '6px', border: '1px solid #b3d4fc', marginTop: '5px' }}>
                        <label style={{ fontWeight: 'bold', color: '#2980b9', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" checked={isBrdMapping} onChange={(e) => { 
                                const checked = e.target.checked;
                                setIsBrdMapping(checked); 
                                if (!checked) {
                                    setMenuForm({ ...menuForm, brdId: '', menuUrl: '' }); 
                                } else {
                                    setMenuForm({ ...menuForm, brdId: '', menuUrl: '' });
                                }
                            }} /> 동적 게시판 스왑 맵핑 활성
                        </label>

                        {isBrdMapping && (
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #cce0ff' }}>
                                <select value={menuForm.brdId || ''} onChange={e => {
                                    const selectedBrdId = e.target.value;
                                    const prefix = sysSectCd === 'MG' ? '/admin/board/view/' : '/user/board/view/';
                                    setMenuForm({ ...menuForm, brdId: selectedBrdId, menuUrl: selectedBrdId ? prefix + selectedBrdId : '' });
                                }} required style={{ padding: '8px', width: '100%', border: '1px solid #3498db', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', boxSizing: 'border-box' }}>
                                    <option value="">-- 결합 연동 게시판 선택 --</option>
                                    {targetBrdList.map(b => (
                                        <option key={b.brdId} value={b.brdId}>[{b.brdId}] - {b.brdNm}</option>
                                    ))}
                                </select>
                                {targetBrdList.length === 0 && <span style={{ fontSize: '11px', color: '#e74c3c' }}>생성 완료된 오픈 게시판이 하나도 없습니다.</span>}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                        <input type="number" placeholder="출력 정렬 순서" value={menuForm.sortOrd} onChange={e => setMenuForm({ ...menuForm, sortOrd: parseInt(e.target.value) || 0 })} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <select value={menuForm.useYn} onChange={e => setMenuForm({ ...menuForm, useYn: e.target.value })} style={{ padding: '8px', width: '120px', border: '1px solid #ddd', borderRadius: '4px' }}>
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

                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                        <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1, padding: '10px' }}>메뉴 저장</button>
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModal({ ...modal, isOpen: false })} style={{ flex: 1, padding: '10px' }}>닫기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuModal;
