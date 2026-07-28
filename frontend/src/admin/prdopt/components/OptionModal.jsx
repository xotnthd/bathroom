import React from 'react';
import Modal from '../../../components/common/Modal';

const OptionModal = ({ isOpen, onClose, targetType, mode, formData, setFormData, handleSave }) => {
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
            width="420px"
            title={`${targetType === 'GROUP' ? '옵션 그룹' : '옵션 값'} ${mode === 'INSERT' ? '등록' : '수정'}`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    <button type="submit" form="optionForm" className="admin-btn admin-btn-primary">
                        {mode === 'INSERT' ? '등록' : '수정'}
                    </button>
                </>
            }
        >
            <form id="optionForm" onSubmit={onSubmit}>
                {targetType === 'GROUP' ? (
                    <div className="admin-form-row">
                        <label className="admin-form-label">옵션 그룹명</label>
                        <div className="admin-form-control">
                            <input type="text" className="admin-input" placeholder="예) 색상, 사이즈" value={formData.optGrpNm || ''} onChange={e => setFormData({ ...formData, optGrpNm: e.target.value })} required />
                        </div>
                    </div>
                ) : (
                    <div className="admin-form-row">
                        <label className="admin-form-label">옵션 값</label>
                        <div className="admin-form-control">
                            <input type="text" className="admin-input" placeholder="예) 빨강, M" value={formData.optValNm || ''} onChange={e => setFormData({ ...formData, optValNm: e.target.value })} required />
                        </div>
                    </div>
                )}
                <div className="admin-form-row">
                    <label className="admin-form-label">표시 순서</label>
                    <div className="admin-form-control">
                        <input type="number" className="admin-input" value={formData.sortOrd ?? 0} onChange={e => setFormData({ ...formData, sortOrd: parseInt(e.target.value) || 0 })} required />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">사용 여부</label>
                    <div className="admin-form-control">
                        <label style={{ marginRight: '15px' }}><input type="radio" name="optUseYn" value="Y" checked={formData.useYn === 'Y'} onChange={() => setFormData({ ...formData, useYn: 'Y' })} style={{ marginRight: '5px' }} />사용</label>
                        <label><input type="radio" name="optUseYn" value="N" checked={formData.useYn === 'N'} onChange={() => setFormData({ ...formData, useYn: 'N' })} style={{ marginRight: '5px' }} />중지</label>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default OptionModal;
