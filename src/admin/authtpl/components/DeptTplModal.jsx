import React from 'react';
import Modal from '../../../components/common/Modal';

const DeptTplModal = ({ isOpen, onClose, mode, formData, setFormData, handleSave }) => {
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
            width="500px"
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            title={`부서 템플릿 ${mode === 'INSERT' ? '등록' : '수정'}`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    <button type="submit" form="deptTplForm" className="admin-btn admin-btn-primary">
                        {mode === 'INSERT' ? '등록' : '수정'}
                    </button>
                </>
            }
        >
            <form id="deptTplForm" onSubmit={onSubmit}>
                <div className="admin-form-row">
                    <label className="admin-form-label">부서 코드</label>
                    <div className="admin-form-control">
                        <input type="text" className="admin-input" placeholder="예) A0" value={formData.deptTplCd || ''} onChange={e => setFormData({ ...formData, deptTplCd: e.target.value.toUpperCase() })} required disabled={mode === 'UPDATE'} />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">부서 명칭</label>
                    <div className="admin-form-control">
                        <input type="text" className="admin-input" placeholder="예) 인사팀" value={formData.deptTplNm || ''} onChange={e => setFormData({ ...formData, deptTplNm: e.target.value })} required />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">설명</label>
                    <div className="admin-form-control">
                        <textarea className="admin-textarea" rows="3" value={formData.deptExpl || ''} onChange={e => setFormData({ ...formData, deptExpl: e.target.value })} />
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
                        <label style={{ marginRight: '15px' }}><input type="radio" name="deptUseYn" value="Y" checked={formData.useYn === 'Y'} onChange={() => setFormData({ ...formData, useYn: 'Y' })} style={{ marginRight: '5px' }} />사용</label>
                        <label><input type="radio" name="deptUseYn" value="N" checked={formData.useYn === 'N'} onChange={() => setFormData({ ...formData, useYn: 'N' })} style={{ marginRight: '5px' }} />중지</label>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default DeptTplModal;
