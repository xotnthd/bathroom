import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';

const BoardManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';

    const [managingList, setManagingList] = useState([]);
    const [boardTypeList, setBoardTypeList] = useState([]);

    const [searchBrdType, setSearchBrdType] = useState('');
    const [selectedBrdId, setSelectedBrdId] = useState('');
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    const initialFormState = {
        sysId: defaultSysId, brdId: '', brdNm: '', brdExpl: '',
        brdType: '', userWriteYn: 'Y', userReplyYn: 'Y', rereplyYn: 'Y', rereplyDepth: 3,
        atchFileYn: 'Y', cmtAtchFileYn: 'N', useYn: 'Y', delYn: 'N'
    };
    const [boardForm, setBoardForm] = useState(initialFormState);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fnFetchManagingList('');
            fnFetchCommonCodes('BOARD_SE_CD', 'ROOT', 'TYPE');
        } else if (inqireYn === 'N') {
            alert('조회 권한명삭제�습등�다. 관리자등�게 문의등�세삭제');
        }
    }, [inqireYn]);

    const fnFetchCommonCodes = async (grpCd, uprComCd, targetType) => {
        try {
            const res = await apiClient('/admin/api/board/common/code', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sysId: defaultSysId, grpCd, uprComCd })
            });
            if (res.ok) {
                const data = await res.json();
                if (targetType === 'TYPE') {
                    setBoardTypeList(data);
                    if (data.length > 0) setBoardForm(prev => ({ ...prev, brdType: data[0].comCd }));
                }
            }
        } catch (err) { console.error("공통코드 추출 등�러", err); }
    };

    const fnFetchManagingList = async (typeFilter) => {
        try {
            const res = await apiClient('/admin/api/board/managing/list', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sysId: defaultSysId, searchBrdType: typeFilter })
            });
            if (res.ok) setManagingList(await res.json());
        } catch (err) { console.error("목록 등�신 등�러", err); }
    };

    const handleRowSelectClick = (board) => {
        setSelectedBrdId(board.brdId);
        setBoardForm(board);
    };

    const handleCheckboxToggle = (field) => {
        setBoardForm(prev => {
            const nextVal = prev[field] === 'Y' ? 'N' : 'Y';
            const nextForm = { ...prev, [field]: nextVal };
            // 등��등 등�용 등록확인�위 등�성(등�등��?, 등��등첨�삭제�일) 강제 N 처리 로직
            if (field === 'userReplyYn' && nextVal === 'N') {
                nextForm.rereplyYn = 'N';
                nextForm.cmtAtchFileYn = 'N';
            }
            return nextForm;
        });
    };

    const handleFormSubmitSave = async (e) => {
        e.preventDefault();
        if (selectedBrdId ? (mdfcnYn !== 'Y') : (rgstYn !== 'Y')) {
            alert('등�삭제권한명삭제�습등�다.');
            return;
        }
        try {
            const res = await apiClient('/admin/api/board/managing/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(boardForm)
            });
            if (res.ok) {
                alert("게시판삭제�정확인�상 반영등�었등�니삭제");
                fnFetchManagingList(searchBrdType);
                fnResetForm();
            }
        } catch (err) { alert("등�확인�신 등�류"); }
    };

    const handleMasterDelete = async (brdId) => {
        if (delYn !== 'Y') { alert('권한명삭제�습등�다.'); return; }
        if (!window.confirm("게시판삭제�태�삭제�구 등�괴등�시겠습등�까등 (등�위 글 등�시 삭제��)")) return;
        const res = await apiClient(`/admin/api/board/managing/delete/${defaultSysId}/${brdId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("등�괴 등�료");
            fnFetchManagingList(searchBrdType);
            fnResetForm();
        }
    };

    const fnResetForm = () => {
        setBoardForm({ ...initialFormState, brdType: boardTypeList[0]?.comCd || '' });
        setSelectedBrdId('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '1rem' }}>등�� 게시판삭제�태 조건 검색</span>
                <select value={searchBrdType} onChange={(e) => { setSearchBrdType(e.target.value); fnFetchManagingList(e.target.value); }} style={{ padding: '6px 12px' }}>
                    <option value="">등�체 등�태 목록 (조건 등�음)</option>
                    {boardTypeList.map(t => <option key={t.comCd} value={t.comCd}>[ {t.comCd} ] {t.cdNm}</option>)}
                </select>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 220px)' }}>
                <div style={{ flex: 1.2, background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', overflowY: 'auto' }}>
                    <h4>등�� 등�록삭제게시판항목록 마스삭제</h4>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#f8f9fa' }}>
                        <tr><th>게시판등ID</th><th>게시판설명칭</th><th>등�태 코드</th><th>등�태</th><th>관�등</th></tr>
                        </thead>
                        <tbody>
                        {managingList.map(b => (
                            <tr key={b.brdId} onClick={() => handleRowSelectClick(b)} style={{ cursor: 'pointer', background: selectedBrdId === b.brdId ? '#e3f2fd' : 'none' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{b.brdId}</td>
                                <td style={{ padding: '8px' }}>{b.brdNm}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}><span style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{b.brdType}</span></td>
                                <td style={{ padding: '8px', textAlign: 'center', color: b.delYn === 'Y' ? 'red' : 'green' }}>{b.delYn === 'Y' ? '삭제됨' : (b.useYn === 'Y' ? '등�성' : '중�등')}</td>
                                <td style={{ padding: '4px', textAlign: 'center' }}>
                                    {delYn === 'Y' && (
                                        <button onClick={(e) => { e.stopPropagation(); handleMasterDelete(b.brdId); }}>삭제��</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {managingList.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>등�재 조건확인�치등�는 등�이등��등 등�습등�다.</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div style={{ flex: 1, background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', overflowY: 'auto' }}>
                    <h4>등�️ 메�등 등�성 등�렬 매니등� {selectedBrdId ? <span style={{ color: '#e67e22' }}>[등�정]</span> : <span style={{ color: '#2ecc71' }}>[등�규 등�록]</span>}</h4>
                    <form onSubmit={handleFormSubmitSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold', marginTop: '5px' }}>[1. 기본 등�자 명세]</span>
                        <input type="text" placeholder="게시판등고유 등�별 ID" value={boardForm.brdId} onChange={e => setBoardForm({ ...boardForm, brdId: e.target.value.toUpperCase() })} required disabled={selectedBrdId !== ''} style={{ padding: '6px' }} />
                        <input type="text" placeholder="등�면 등�출확인�등��등" value={boardForm.brdNm} onChange={e => setBoardForm({ ...boardForm, brdNm: e.target.value })} required style={{ padding: '6px' }} />
                        <input type="text" placeholder="등�명 등�약" value={boardForm.brdExpl || ''} onChange={e => setBoardForm({ ...boardForm, brdExpl: e.target.value })} style={{ padding: '6px' }} />

                        <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold', marginTop: '5px' }}>[2. 게시판삭제�태 등�삭제지삭제(BOARD_SE_CD 등�동)]</span>
                        <select value={boardForm.brdType} onChange={e => setBoardForm({ ...boardForm, brdType: e.target.value })} required style={{ padding: '6px', border: '2px solid #f39c12', fontWeight: 'bold' }}>
                            <option value="">-- 등�태 등�수 등�형 지삭제--</option>
                            {boardTypeList.map(t => <option key={t.comCd} value={t.comCd}>[{t.comCd}] {t.cdNm}</option>)}
                        </select>

                        <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold', marginTop: '5px' }}>[3. 기능 등�터등�션 �삭제�제 Matrix]</span>
                        <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                            <label><input type="checkbox" checked={boardForm.userWriteYn === 'Y'} onChange={() => handleCheckboxToggle('userWriteYn')} /> 등�️ 글등�성 등�용</label>
                            <label><input type="checkbox" checked={boardForm.userReplyYn === 'Y'} onChange={() => handleCheckboxToggle('userReplyYn')} /> 등�� 등��삭제�성 등�용</label>
                            <label><input type="checkbox" checked={boardForm.rereplyYn === 'Y'} onChange={() => handleCheckboxToggle('rereplyYn')} /> 등�� 등�등��등 구조 등�용</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                등�� 등�용 깊이:
                                <select value={boardForm.rereplyDepth} onChange={e => setBoardForm({ ...boardForm, rereplyDepth: parseInt(e.target.value) })} disabled={boardForm.rereplyYn === 'N'}>
                                    <option value="1">1</option><option value="2">2</option><option value="3">3 (Max)</option>
                                </select>
                            </label>
                            <label style={{ borderTop: '1px dashed #eee', paddingTop: '5px', gridColumn: '1/-1', color: '#2980b9', fontWeight: 'bold' }}><input type="checkbox" checked={boardForm.atchFileYn === 'Y'} onChange={() => handleCheckboxToggle('atchFileYn')} /> 등�� 등�용삭제게시글 등�일 등�로확인�용</label>
                            <label style={{ gridColumn: '1/-1', color: '#2980b9', fontWeight: 'bold' }}><input type="checkbox" checked={boardForm.cmtAtchFileYn === 'Y'} onChange={() => handleCheckboxToggle('cmtAtchFileYn')} disabled={boardForm.userReplyYn === 'N'} /> 등�� 등�용확인��등 등�일 등�로확인�용</label>
                            <label style={{ gridColumn: '1/-1' }}><input type="checkbox" checked={boardForm.useYn === 'Y'} onChange={() => handleCheckboxToggle('useYn')} /> 등�� 등�스확인�성삭제</label>
                            <label style={{ borderTop: '1px dashed #eee', paddingTop: '5px', gridColumn: '1/-1', color: 'red' }}><input type="checkbox" checked={boardForm.delYn === 'Y'} onChange={() => handleCheckboxToggle('delYn')} /> 등���삭제�구 등�리 삭제�� (등��등)</label>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            {((selectedBrdId && mdfcnYn === 'Y') || (!selectedBrdId && rgstYn === 'Y')) && (
                                <button type="submit" style={{ flex: 1, padding: '10px', background: selectedBrdId ? '#e67e22' : '#2ecc71', color: '#fff', border: 'none', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>등�확인�정</button>
                            )}
                            <button type="button" onClick={fnResetForm} style={{ padding: '10px' }}>초기화</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BoardManage;
