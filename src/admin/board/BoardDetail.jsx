import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useBoardManage } from './hooks/useBoardManage';

const BoardDetail = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const brdId = new URLSearchParams(routerLocation.search).get('brdId');
    const mode = brdId ? 'UPDATE' : 'INSERT';

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth();
    const { boardTypeList, fetchBoardDetail, saveBoard } = useBoardManage(defaultSysId, inqireYn);

    const initialForm = {
        sysId: defaultSysId, brdId: '', brdNm: '', brdExpl: '',
        brdType: '', userWriteYn: 'Y', userReplyYn: 'Y', rereplyYn: 'Y', rereplyDepth: 3,
        atchFileYn: 'Y', cmtAtchFileYn: 'N', useYn: 'Y', delYn: 'N'
    };
    const [form, setForm] = useState(initialForm);
    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    useEffect(() => {
        if (mode === 'UPDATE') {
            fetchBoardDetail(brdId).then(info => { if (info) setForm(info); });
        } else {
            setForm({ ...initialForm, brdType: boardTypeList[0]?.comCd || '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brdId, boardTypeList]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleCheckboxToggle = (field) => {
        setForm(prev => {
            const nextVal = prev[field] === 'Y' ? 'N' : 'Y';
            const nextForm = { ...prev, [field]: nextVal };
            if (field === 'userReplyYn' && nextVal === 'N') {
                nextForm.rereplyYn = 'N';
                nextForm.cmtAtchFileYn = 'N';
            }
            return nextForm;
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const ok = await saveBoard(form);
        if (ok) {
            if (mode === 'INSERT') navigate(`/admin/board/write?brdId=${form.brdId}`);
            else fetchBoardDetail(brdId).then(info => { if (info) setForm(info); });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '게시판 등록' : '게시판 상세'}</h2>
                <button onClick={() => navigate('/admin/board')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">게시판 정보</span>
                    {canEdit && <button type="submit" form="boardForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '등록' : '수정'}</button>}
                </div>
                <div className="admin-card-body">
                    <form id="boardForm" onSubmit={onSubmit}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">게시판 ID</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" placeholder="영문 대문자 (예: NOTICE)" value={form.brdId} onChange={e => setForm({ ...form, brdId: e.target.value.toUpperCase() })} required disabled={mode === 'UPDATE' || !canEdit} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">게시판 명칭</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" placeholder="게시판 명칭" value={form.brdNm} onChange={e => setForm({ ...form, brdNm: e.target.value })} required disabled={!canEdit} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">게시판 설명</label>
                            <div className="admin-form-control">
                                <textarea className="admin-textarea" rows="2" placeholder="간단한 설명" value={form.brdExpl || ''} onChange={e => setForm({ ...form, brdExpl: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">게시판 구분</label>
                            <div className="admin-form-control">
                                <select className="admin-input" value={form.brdType} onChange={e => setForm({ ...form, brdType: e.target.value })} required disabled={!canEdit}>
                                    <option value="">-- 구분 선택 --</option>
                                    {boardTypeList.map(t => <option key={t.comCd} value={t.comCd}>[{t.comCd}] {t.cdNm}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">기능 옵션</label>
                            <div className="admin-form-control">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label><input type="checkbox" checked={form.userWriteYn === 'Y'} onChange={() => handleCheckboxToggle('userWriteYn')} disabled={!canEdit} style={{ marginRight: '5px' }} /> 글 작성 허용</label>

                                    <label><input type="checkbox" checked={form.userReplyYn === 'Y'} onChange={() => handleCheckboxToggle('userReplyYn')} disabled={!canEdit} style={{ marginRight: '5px' }} /> 댓글 작성 허용</label>

                                    <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <label><input type="checkbox" checked={form.rereplyYn === 'Y'} onChange={() => handleCheckboxToggle('rereplyYn')} disabled={!canEdit || form.userReplyYn === 'N'} style={{ marginRight: '5px' }} /> 대댓글 허용</label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            깊이:
                                            <select value={form.rereplyDepth} onChange={e => setForm({ ...form, rereplyDepth: parseInt(e.target.value) })} disabled={!canEdit || form.rereplyYn === 'N'} className="admin-input" style={{ width: '100px', padding: '2px 5px' }}>
                                                <option value="1">1</option><option value="2">2</option><option value="3">3 (최대)</option>
                                            </select>
                                        </label>
                                    </div>
                                    <label style={{ marginLeft: '20px' }}><input type="checkbox" checked={form.cmtAtchFileYn === 'Y'} onChange={() => handleCheckboxToggle('cmtAtchFileYn')} disabled={!canEdit || form.userReplyYn === 'N'} style={{ marginRight: '5px' }} /> 댓글 첨부파일 허용</label>

                                    <label><input type="checkbox" checked={form.atchFileYn === 'Y'} onChange={() => handleCheckboxToggle('atchFileYn')} disabled={!canEdit} style={{ marginRight: '5px' }} /> 게시글 첨부파일 허용</label>
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <label style={{ marginRight: '15px' }}><input type="radio" checked={form.useYn === 'Y'} onChange={() => setForm({ ...form, useYn: 'Y' })} disabled={!canEdit} style={{ marginRight: '5px' }} />사용</label>
                                <label><input type="radio" checked={form.useYn === 'N'} onChange={() => setForm({ ...form, useYn: 'N' })} disabled={!canEdit} style={{ marginRight: '5px' }} />중지</label>
                            </div>
                        </div>

                        {mode === 'UPDATE' && (
                            <div className="admin-form-row">
                                <label className="admin-form-label">삭제 여부</label>
                                <div className="admin-form-control">
                                    <label style={{ marginRight: '15px' }}><input type="radio" checked={form.delYn === 'N'} onChange={() => setForm({ ...form, delYn: 'N' })} disabled={!canEdit} style={{ marginRight: '5px' }} />정상</label>
                                    <label style={{ color: 'red' }}><input type="radio" checked={form.delYn === 'Y'} onChange={() => setForm({ ...form, delYn: 'Y' })} disabled={!canEdit} style={{ marginRight: '5px' }} />삭제됨</label>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BoardDetail;
