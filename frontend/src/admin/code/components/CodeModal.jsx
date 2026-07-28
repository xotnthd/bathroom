import React from 'react';
import Modal from '../../../components/common/Modal';

const CodeModal = ({ isOpen, onClose, targetType, mode, formData, setFormData, handleSave }) => {
    if (!isOpen) return null;

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleSave(targetType, formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="500px"
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            title={`${targetType === 'GROUP' ? '공통 그룹 코드' : targetType === 'MID' ? '중간 레벨 코드' : '상세 레벨 코드'} ${mode === 'INSERT' ? '등록' : '수정'}`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    <button type="submit" form="codeForm" className="admin-btn admin-btn-primary">
                        {mode === 'INSERT' ? '등록' : '수정'}
                    </button>
                </>
            }
        >
                    <form id="codeForm" onSubmit={onSubmit}>
                        {targetType === 'GROUP' ? (
                            <>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">그룹 코드</label>
                                    <div className="admin-form-control">
                                        <input type="text" className="admin-input" placeholder="영문 대문자" value={formData.comCd} onChange={e => setFormData({ ...formData, comCd: e.target.value.toUpperCase() })} required disabled={mode === 'UPDATE'} />
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">그룹 명칭</label>
                                    <div className="admin-form-control">
                                        <input type="text" className="admin-input" value={formData.cdNm} onChange={e => setFormData({ ...formData, cdNm: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">그룹 설명</label>
                                    <div className="admin-form-control">
                                        <textarea className="admin-textarea" rows="3" value={formData.cdExpl || ''} onChange={e => setFormData({ ...formData, cdExpl: e.target.value })} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">상위 코드</label>
                                    <div className="admin-form-control">
                                        <input type="text" className="admin-input" value={formData.uprComCd} readOnly style={{ background: '#f8f9fa' }} />
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">코드 ID</label>
                                    <div className="admin-form-control">
                                        <input type="text" className="admin-input" placeholder="영문 대문자" value={formData.comCd} onChange={e => setFormData({ ...formData, comCd: e.target.value.toUpperCase() })} required disabled={mode === 'UPDATE'} />
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">코드 명칭</label>
                                    <div className="admin-form-control">
                                        <input type="text" className="admin-input" value={formData.cdNm} onChange={e => setFormData({ ...formData, cdNm: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">코드 설명</label>
                                    <div className="admin-form-control">
                                        <textarea className="admin-textarea" rows="3" value={formData.cdExpl || ''} onChange={e => setFormData({ ...formData, cdExpl: e.target.value })} />
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">표시 순서</label>
                                    <div className="admin-form-control">
                                        <input type="number" className="admin-input" value={formData.sortOrd} onChange={e => setFormData({ ...formData, sortOrd: parseInt(e.target.value) || 0 })} required />
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">사용 여부</label>
                                    <div className="admin-form-control">
                                        <label style={{ marginRight: '15px' }}><input type="radio" name="useYn" value="Y" checked={formData.useYn === 'Y'} onChange={e => setFormData({ ...formData, useYn: 'Y' })} style={{ marginRight: '5px' }} />사용</label>
                                        <label><input type="radio" name="useYn" value="N" checked={formData.useYn === 'N'} onChange={e => setFormData({ ...formData, useYn: 'N' })} style={{ marginRight: '5px' }} />중지</label>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
        </Modal>
    );
};

export default CodeModal;
