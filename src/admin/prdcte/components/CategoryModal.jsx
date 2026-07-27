import React from 'react';
import Modal from '../../../components/common/Modal';

const LEVEL_LABEL = { MAIN: '대분류', MID: '중분류', SUB: '소분류' };

const CategoryModal = ({ isOpen, onClose, modal, formData, setFormData, handleSave }) => {
    if (!isOpen) return null;

    const onSubmit = async (e) => {
        e.preventDefault();
        const ok = await handleSave(formData);
        if (ok) onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="440px"
            title={`${LEVEL_LABEL[modal.type]} ${modal.mode === 'INSERT' ? '등록' : '수정'}`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    <button type="submit" form="categoryForm" className="admin-btn admin-btn-primary">
                        {modal.mode === 'INSERT' ? '등록' : '수정'}
                    </button>
                </>
            }
        >
            <form id="categoryForm" onSubmit={onSubmit}>
                <div className="admin-form-row">
                    <label className="admin-form-label">카테고리명</label>
                    <div className="admin-form-control">
                        <input type="text" className="admin-input" value={formData.cteNm || ''} onChange={e => setFormData({ ...formData, cteNm: e.target.value })} required />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">설명</label>
                    <div className="admin-form-control">
                        <textarea className="admin-textarea" rows="3" value={formData.cteExpl || ''} onChange={e => setFormData({ ...formData, cteExpl: e.target.value })} />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">표시 순서</label>
                    <div className="admin-form-control">
                        <input type="number" className="admin-input" value={formData.sortOrd ?? 0} onChange={e => setFormData({ ...formData, sortOrd: parseInt(e.target.value) || 0 })} required />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">사용 여부</label>
                    <div className="admin-form-control">
                        <label style={{ marginRight: '15px' }}><input type="radio" name="cteUseYn" value="Y" checked={formData.useYn === 'Y'} onChange={() => setFormData({ ...formData, useYn: 'Y' })} style={{ marginRight: '5px' }} />사용</label>
                        <label><input type="radio" name="cteUseYn" value="N" checked={formData.useYn === 'N'} onChange={() => setFormData({ ...formData, useYn: 'N' })} style={{ marginRight: '5px' }} />중지</label>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default CategoryModal;
