import React, { useState, useEffect } from 'react';
import CommonCodePicker from '../../../components/CommonCodePicker';
import Modal from '../../../components/common/Modal';
import { apiClient } from '../../../utils/apiClient';

const PopupModal = ({ 
    isOpen, onClose, mode, 
    formData, setFormData, 
    handleSave, handleDelete, 
    handleFileDelete, handleFileDownload,
    delYn, mdfcnYn, rgstYn,
    defaultSysId, setShowSurveyModal
}) => {
    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setUploadFiles([]);
            const fileInput = document.getElementById("popupFileInput");
            if(fileInput) fileInput.value = "";
            
            if (formData.fileGrpId) {
                fetchExistingFiles(formData.fileGrpId);
            } else {
                setExistingFiles([]);
            }
        }
    }, [isOpen, formData.fileGrpId]);

    const fetchExistingFiles = async (grpId) => {
        const fRes = await apiClient(`/admin/api/comn/file/list/${grpId}?sysId=${defaultSysId}`);
        if (fRes.ok) setExistingFiles(await fRes.json());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setUploadFiles(Array.from(e.target.files));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const success = await handleSave(formData, uploadFiles);
        if (success) onClose();
    };

    const onFileDelete = async (fileSn) => {
        if (delYn !== 'Y') { alert('삭제 권한이 없습니다.'); return; }
        const success = await handleFileDelete(fileSn, formData.fileGrpId, setExistingFiles);
        if (success) {
            // filelist updated inside hook
        }
    };

    const onDelete = async () => {
        if (delYn !== 'Y') { alert('삭제 권한이 없습니다.'); return; }
        const success = await handleDelete(formData.popIdx);
        if (success) onClose();
    };

    if (!isOpen) return null;

    const today = new Date().toISOString().split('T')[0];
    const isStarted = mode === 'UPDATE' && formData.bgngYmd && today >= formData.bgngYmd;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            width="700px"
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            title={mode === 'INSERT' ? '팝업 등록' : `팝업 수정 (ID: ${formData.popIdx})`}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    {mode === 'UPDATE' && delYn === 'Y' && !isStarted && (
                        <button type="button" onClick={onDelete} className="admin-btn admin-btn-danger">삭제</button>
                    )}
                    {((mode === 'INSERT' && rgstYn === 'Y') || (mode === 'UPDATE' && mdfcnYn === 'Y')) && !isStarted && (
                        <button type="submit" form="popupForm" className="admin-btn admin-btn-primary">
                            {mode === 'UPDATE' ? '수정' : '등록'}
                        </button>
                    )}
                </>
            }
        >
                    {isStarted && (
                        <div style={{ background: '#fff3cd', color: '#856404', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px', border: '1px solid #ffeeba' }}>
                            이미 노출이 시작되거나 종료된 팝업은 수정할 수 없습니다. (신규 팝업으로 등록해주세요)
                        </div>
                    )}
                    <form id="popupForm" onSubmit={onSubmit}>
                        
                        <div className="admin-form-row">
                            <label className="admin-form-label">시스템 구분</label>
                            <div className="admin-form-control">
                                <CommonCodePicker grpCd="SYS_SE_CD" type="radio" name="sysSeCd" value={formData.sysSeCd} onChange={handleChange} disabled={mode === 'UPDATE' || isStarted} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">노출 기간</label>
                            <div className="admin-form-control">
                                <input type="date" name="bgngYmd" value={formData.bgngYmd} onChange={handleChange} className="admin-input" required disabled={isStarted} />
                                <span style={{ margin: '0 5px', color: 'var(--text-secondary)' }}>~</span>
                                <input type="date" name="endYmd" value={formData.endYmd} onChange={handleChange} className="admin-input" required disabled={isStarted} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">팝업 제목</label>
                            <div className="admin-form-control">
                                <input name="popTitl" className="admin-input" type="text" value={formData.popTitl} onChange={handleChange} required placeholder="팝업 제목을 입력하세요" disabled={isStarted} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">팝업 내용</label>
                            <div className="admin-form-control">
                                <textarea name="popCn" className="admin-textarea" rows="6" value={formData.popCn} onChange={handleChange} placeholder="팝업 내용을 입력하세요" disabled={isStarted} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">설문 매핑</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={formData.survNm ? `[${formData.survId}] ${formData.survNm}` : formData.survId} placeholder="설문을 선택하세요" readOnly />
                                {!isStarted && (
                                    <>
                                        <button type="button" onClick={() => setShowSurveyModal(true)} className="admin-btn admin-btn-secondary" style={{ whiteSpace: 'nowrap' }}>설문 검색</button>
                                        <button type="button" onClick={() => setFormData({...formData, survId: '', survNm: ''})} className="admin-btn admin-btn-danger" style={{ whiteSpace: 'nowrap' }}>초기화</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">첨부 파일</label>
                            <div className="admin-form-control">
                                <div className="admin-file-box">
                                    {!isStarted && (
                                        <input id="popupFileInput" type="file" multiple onChange={handleFileChange} style={{ display: 'block', width: '100%', marginBottom: existingFiles.length > 0 ? '12px' : '0' }} />
                                    )}

                                    {existingFiles.length > 0 && (
                                        <div style={{ padding: '12px', background: 'var(--content-bg)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '12px' }}>[보유 파일 목록 - 클릭 시 다운로드]</span>
                                            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: 'var(--text-primary)' }}>
                                                {existingFiles.map(f => (
                                                    <li key={f.fileSn} style={{ marginBottom: '8px', fontSize: '13px' }}>
                                                        {f.fileOrgnlNm}
                                                        <span onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)}
                                                              style={{ fontSize: '12px', color: '#e67e22', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', margin: '0 10px' }}>다운로드</span>
                                                        {delYn === 'Y' && !isStarted && (
                                                            <button type="button" onClick={() => onFileDelete(f.fileSn)}
                                                                    className="admin-btn admin-btn-danger" style={{ padding: '2px 8px', fontSize: '11px' }}>삭제</button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <CommonCodePicker grpCd="USE_YN" type="radio" name="useYn" value={formData.useYn} onChange={handleChange} disabled={isStarted} />
                            </div>
                        </div>
                    </form>
        </Modal>
    );
};

export default PopupModal;
