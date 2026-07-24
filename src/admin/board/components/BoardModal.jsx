import React, { useEffect } from 'react';
import Modal from '../../../components/common/Modal';

const BoardModal = ({ isOpen, onClose, mode, formData, setFormData, handleSave, boardTypeList }) => {
    if (!isOpen) return null;

    const onSubmit = async (e) => {
        e.preventDefault();
        const success = await handleSave(formData);
        if (success) onClose();
    };

    const handleCheckboxToggle = (field) => {
        setFormData(prev => {
            const nextVal = prev[field] === 'Y' ? 'N' : 'Y';
            const nextForm = { ...prev, [field]: nextVal };
            // 대댓글 허용 취소 시, 하위 속성 N 처리
            if (field === 'userReplyYn' && nextVal === 'N') {
                nextForm.rereplyYn = 'N';
                nextForm.cmtAtchFileYn = 'N';
            }
            return nextForm;
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="700px"
            bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
            title={`게시판 ${mode === 'INSERT' ? '등록' : '수정'}`}
            closeButtonStyle={{ padding: '4px 12px', fontSize: '12px', background: '#fce4ec', color: '#c2185b', border: '1px solid #f8bbd0' }}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn" style={{ background: '#fce4ec', color: '#c2185b', border: '1px solid #f8bbd0' }}>닫기</button>
                    <button type="submit" form="boardForm" className="admin-btn admin-btn-primary">
                        {mode === 'INSERT' ? '등록' : '수정'}
                    </button>
                </>
            }
        >
                    <form id="boardForm" onSubmit={onSubmit}>

                        <div className="admin-form-row">
                            <label className="admin-form-label">게시판 ID</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" placeholder="영문 대문자 (예: NOTICE)" value={formData.brdId} onChange={e => setFormData({ ...formData, brdId: e.target.value.toUpperCase() })} required disabled={mode === 'UPDATE'} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">게시판 명칭</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" placeholder="게시판 명칭" value={formData.brdNm} onChange={e => setFormData({ ...formData, brdNm: e.target.value })} required />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">게시판 설명</label>
                            <div className="admin-form-control">
                                <textarea className="admin-textarea" rows="2" placeholder="간단한 설명" value={formData.brdExpl || ''} onChange={e => setFormData({ ...formData, brdExpl: e.target.value })} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">게시판 구분</label>
                            <div className="admin-form-control">
                                <select className="admin-input" value={formData.brdType} onChange={e => setFormData({ ...formData, brdType: e.target.value })} required>
                                    <option value="">-- 구분 선택 --</option>
                                    {boardTypeList.map(t => <option key={t.comCd} value={t.comCd}>[{t.comCd}] {t.cdNm}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">기능 옵션</label>
                            <div className="admin-form-control">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label><input type="checkbox" checked={formData.userWriteYn === 'Y'} onChange={() => handleCheckboxToggle('userWriteYn')} style={{ marginRight: '5px' }} /> 글 작성 허용</label>
                                    
                                    <label><input type="checkbox" checked={formData.userReplyYn === 'Y'} onChange={() => handleCheckboxToggle('userReplyYn')} style={{ marginRight: '5px' }} /> 댓글 작성 허용</label>
                                    
                                    <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <label><input type="checkbox" checked={formData.rereplyYn === 'Y'} onChange={() => handleCheckboxToggle('rereplyYn')} disabled={formData.userReplyYn === 'N'} style={{ marginRight: '5px' }} /> 대댓글 허용</label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            깊이:
                                            <select value={formData.rereplyDepth} onChange={e => setFormData({ ...formData, rereplyDepth: parseInt(e.target.value) })} disabled={formData.rereplyYn === 'N'} className="admin-input" style={{ width: '100px', padding: '2px 5px' }}>
                                                <option value="1">1</option><option value="2">2</option><option value="3">3 (최대)</option>
                                            </select>
                                        </label>
                                    </div>
                                    <label style={{ marginLeft: '20px' }}><input type="checkbox" checked={formData.cmtAtchFileYn === 'Y'} onChange={() => handleCheckboxToggle('cmtAtchFileYn')} disabled={formData.userReplyYn === 'N'} style={{ marginRight: '5px' }} /> 댓글 첨부파일 허용</label>

                                    <label><input type="checkbox" checked={formData.atchFileYn === 'Y'} onChange={() => handleCheckboxToggle('atchFileYn')} style={{ marginRight: '5px' }} /> 게시글 첨부파일 허용</label>
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <label style={{ marginRight: '15px' }}><input type="radio" checked={formData.useYn === 'Y'} onChange={() => setFormData({ ...formData, useYn: 'Y' })} style={{ marginRight: '5px' }} />사용</label>
                                <label><input type="radio" checked={formData.useYn === 'N'} onChange={() => setFormData({ ...formData, useYn: 'N' })} style={{ marginRight: '5px' }} />중지</label>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">삭제 여부</label>
                            <div className="admin-form-control">
                                <label style={{ marginRight: '15px' }}><input type="radio" checked={formData.delYn === 'N'} onChange={() => setFormData({ ...formData, delYn: 'N' })} style={{ marginRight: '5px' }} />정상</label>
                                <label style={{ color: 'red' }}><input type="radio" checked={formData.delYn === 'Y'} onChange={() => setFormData({ ...formData, delYn: 'Y' })} style={{ marginRight: '5px' }} />삭제됨</label>
                            </div>
                        </div>

                    </form>
        </Modal>
    );
};

export default BoardModal;
