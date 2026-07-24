import React, { useState, useEffect } from 'react';
import CommonCodePicker from '../../../components/CommonCodePicker';
import Modal from '../../../components/common/Modal';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const UserModal = ({ 
    isOpen, onClose, userForm, handleFormChange, handleUserSave, 
    selectedUserId, roleList, rgstYn, mdfcnYn, setUploadFiles, existingFiles,
    handleFileDelete, handleFileDownload, setUserForm
}) => {
    const [pswdConfirm, setPswdConfirm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPswdConfirm('');
        }
    }, [isOpen, selectedUserId]);

    if (!isOpen) return null;

    const isReadOnly = selectedUserId !== '' ? mdfcnYn !== 'Y' : rgstYn !== 'Y';

    const handleFileChange = (e) => {
        setUploadFiles(Array.from(e.target.files));
    };

    const isPswdMismatch = userForm.pswd && pswdConfirm && userForm.pswd !== pswdConfirm;
    const pswdStyle = isPswdMismatch ? { backgroundColor: 'pink' } : {};

    const onSubmit = (e) => {
        e.preventDefault();
        if (isPswdMismatch) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        handleUserSave(e);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            contentStyle={{ width: '800px', maxHeight: '90vh', overflowY: 'auto' }}
            title={`회원 ${selectedUserId ? '수정' : '신규 등록'}`}
            closeLabel="취소"
            closeButtonStyle={{ padding: '4px 12px', fontSize: '12px', background: '#fce4ec', color: '#c2185b', border: '1px solid #f8bbd0' }}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn" style={{ background: '#fce4ec', color: '#c2185b', border: '1px solid #f8bbd0' }}>취소</button>
                    {!isReadOnly && (
                        <button type="submit" form="userForm" className="admin-btn admin-btn-primary">
                            {selectedUserId ? '회원 정보 수정' : '신규 회원 등록'}
                        </button>
                    )}
                </>
            }
        >
                    <form id="userForm" onSubmit={onSubmit}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">아이디 *</label>
                            <input type="text" name="userId" className="admin-input" placeholder="아이디" value={userForm.userId} onChange={handleFormChange} required disabled={selectedUserId !== ''} />
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">비밀번호 *</label>
                            <input type="password" name="pswd" className="admin-input" placeholder={selectedUserId ? "변경시에만 입력 (기존유지)" : "비밀번호 입력"} value={userForm.pswd} onChange={handleFormChange} required={selectedUserId === ''} disabled={isReadOnly} style={pswdStyle} />
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">비밀번호 확인 *</label>
                            <input type="password" name="pswdConfirm" className="admin-input" placeholder="비밀번호 재입력" value={pswdConfirm} onChange={(e) => setPswdConfirm(e.target.value)} required={userForm.pswd !== '' && userForm.pswd !== undefined} disabled={isReadOnly} style={pswdStyle} />
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">이름 *</label>
                            <input type="text" name="userNm" className="admin-input" placeholder="이름" value={userForm.userNm} onChange={handleFormChange} required disabled={isReadOnly} />
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label" style={{ alignItems: 'flex-start', paddingTop: '15px', height: 'auto' }}>이미지 파일</label>
                            <div style={{ flex: 1, background: '#fff8f0', padding: '10px', borderRadius: '4px', border: '1px solid #f39c12' }}>
                                {!isReadOnly && (
                                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
                                )}

                                {existingFiles && existingFiles.length > 0 && (
                                    <div style={{ padding: '8px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#2980b9', fontSize: '12px' }}>[기존 이미지 목록]</span>
                                        <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                                            {existingFiles.map(f => (
                                                <li key={f.fileSn} style={{ marginBottom: '5px', fontSize: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                                        <span>{f.fileOrgnlNm} ({(f.fileSize/1024).toFixed(1)} KB)</span>
                                                        <button type="button" onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)} className="admin-btn admin-btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>다운로드</button>
                                                        {!isReadOnly && (
                                                            <button type="button" onClick={() => handleFileDelete(f.fileSn)} className="admin-btn admin-btn-danger" style={{ padding: '2px 8px', fontSize: '11px' }}>삭제</button>
                                                        )}
                                                    </div>
                                                    {f.fileType && f.fileType.startsWith('image/') && (
                                                        <img src={`/admin/api/comn/file/download/${f.fileSn}`} alt="preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', border: '1px solid #ddd' }} />
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">권한 및 상태 *</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select name="athrtyCd" className="admin-input" value={userForm.athrtyCd} onChange={handleFormChange} required disabled={isReadOnly}>
                                    <option value="">권한 선택</option>
                                    {roleList.map(role => (
                                        <option key={role.athrtyComCd} value={role.athrtyComCd}>{role.athrtyNm}</option>
                                    ))}
                                </select>
                                <CommonCodePicker 
                                    grpCd="USER_STAT_CD" 
                                    type="select" 
                                    name="userStatCd" 
                                    value={userForm.userStatCd} 
                                    onChange={handleFormChange} 
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label" style={{ alignItems: 'flex-start', paddingTop: '15px', height: 'auto' }}>인적 정보</label>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input type="email" name="email" className="admin-input" placeholder="이메일 주소" value={userForm.email || ''} onChange={handleFormChange} disabled={isReadOnly} />
                                <input type="text" name="mblTelno" className="admin-input" placeholder="휴대전화 번호" value={userForm.mblTelno || ''} onChange={handleFormChange} disabled={isReadOnly} />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" name="zipCd" className="admin-input" placeholder="우편번호" value={userForm.zipCd || ''} onChange={handleFormChange} style={{ width: '100px' }} disabled={isReadOnly} />
                                    <input type="text" name="baseAddr" className="admin-input" placeholder="기본 주소" value={userForm.baseAddr || ''} onChange={handleFormChange} style={{ flex: 1 }} disabled={isReadOnly} />
                                </div>
                                <input type="text" name="dtlAddr" className="admin-input" placeholder="상세 주소" value={userForm.dtlAddr || ''} onChange={handleFormChange} disabled={isReadOnly} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">등록 기간</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="date" name="rgstBgngDt" className="admin-input" value={userForm.rgstBgngDt || ''} onChange={handleFormChange} disabled={isReadOnly} />
                                <span>~</span>
                                <input type="date" name="rgstEndDt" className="admin-input" value={userForm.rgstEndDt || ''} onChange={handleFormChange} disabled={isReadOnly} />
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label" style={{ alignItems: 'flex-start', paddingTop: '15px', height: 'auto' }}>비고</label>
                            <div style={{ flex: 1, background: '#fff' }}>
                                <ReactQuill 
                                    theme="snow" 
                                    value={userForm.rmrk || ''} 
                                    onChange={val => setUserForm({...userForm, rmrk: val})} 
                                    readOnly={isReadOnly}
                                    style={{ height: '200px', marginBottom: '40px' }} 
                                />
                            </div>
                        </div>

                    </form>
        </Modal>
    );
};

export default UserModal;
