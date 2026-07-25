import React from 'react';
import Modal from '../../../components/common/Modal';
import CommonCodePicker from '../../../components/CommonCodePicker';

const RoleTplModal = ({ isOpen, onClose, mode, formData, setFormData, handleSave }) => {
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
            title={`역할 템플릿 ${mode === 'INSERT' ? '등록' : '수정'}`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    <button type="submit" form="roleTplForm" className="admin-btn admin-btn-primary">
                        {mode === 'INSERT' ? '등록' : '수정'}
                    </button>
                </>
            }
        >
            <form id="roleTplForm" onSubmit={onSubmit}>
                <div className="admin-form-row">
                    <label className="admin-form-label">역할 코드</label>
                    <div className="admin-form-control">
                        <input type="text" className="admin-input" placeholder="예) A001" value={formData.athrtyTplCd || ''} onChange={e => setFormData({ ...formData, athrtyTplCd: e.target.value.toUpperCase() })} required disabled={mode === 'UPDATE'} />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">시스템 구분</label>
                    <div className="admin-form-control">
                        <CommonCodePicker
                            grpCd="SYS_SE_CD"
                            type="select"
                            name="sysSeCd"
                            value={formData.sysSeCd}
                            onChange={e => setFormData({ ...formData, sysSeCd: e.target.value })}
                            defaultOption="선택하세요"
                        />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">역할 명칭</label>
                    <div className="admin-form-control">
                        <input type="text" className="admin-input" placeholder="예) 부서장" value={formData.athrtyNm || ''} onChange={e => setFormData({ ...formData, athrtyNm: e.target.value })} required />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">설명</label>
                    <div className="admin-form-control">
                        <textarea className="admin-textarea" rows="3" value={formData.cdExpl || ''} onChange={e => setFormData({ ...formData, cdExpl: e.target.value })} />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">권한 레벨</label>
                    <div className="admin-form-control">
                        <input type="number" className="admin-input" placeholder="숫자가 낮을수록 상위 권한" value={formData.athrtyLevel ?? ''} onChange={e => setFormData({ ...formData, athrtyLevel: parseInt(e.target.value) || 0 })} required />
                    </div>
                </div>
                <div className="admin-form-row">
                    <label className="admin-form-label">사용 여부</label>
                    <div className="admin-form-control">
                        <label style={{ marginRight: '15px' }}><input type="radio" name="roleUseYn" value="Y" checked={formData.useYn === 'Y'} onChange={() => setFormData({ ...formData, useYn: 'Y' })} style={{ marginRight: '5px' }} />사용</label>
                        <label><input type="radio" name="roleUseYn" value="N" checked={formData.useYn === 'N'} onChange={() => setFormData({ ...formData, useYn: 'N' })} style={{ marginRight: '5px' }} />중지</label>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default RoleTplModal;
