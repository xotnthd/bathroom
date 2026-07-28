import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import BoardCommentSection from '../../../user/board/dynamic/BoardCommentSection';
import Modal from '../../../components/common/Modal';

const BoardPostModal = ({
    sysId,
    selectedBoard,
    boardTypeList,
    isModalOpen, closeModal,
    postForm, setPostForm,
    uploadFiles, setUploadFiles,
    existingFiles,
    handleSavePost, handleLogicalDeletePost, handleRestorePost,
    handleFileDelete, handleFileDownload,
    menuAuth
}) => {
    if (!isModalOpen) return null;

    const { rgstYn, mdfcnYn, delYn } = menuAuth;
    const isEdit = postForm.idx !== '';
    const isReadOnly = isEdit ? mdfcnYn !== 'Y' : rgstYn !== 'Y';

    const handleFileChange = (e) => {
        setUploadFiles(Array.from(e.target.files));
    };

    const getBrdTypeName = (code) => {
        if (!boardTypeList) return code;
        const found = boardTypeList.find(t => t.comCd === code);
        return found ? found.cdNm : code;
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            contentStyle={{ width: '800px', maxHeight: '90vh', overflowY: 'auto' }}
            title="게시글 상세 및 설정"
            closeButtonStyle={{ padding: '4px 12px', fontSize: '12px', background: '#fce4ec', color: '#c2185b', border: '1px solid #f8bbd0' }}
        >
                    <form onSubmit={handleSavePost}>
                        {isEdit && (
                            <div className="admin-form-row" style={{ background: '#f8f9fa', marginBottom: '10px', padding: '10px', borderRadius: '4px' }}>
                                <div style={{ flex: 1 }}><strong>등록자:</strong> {postForm.wrtrNm || postForm.frstRgstrId}</div>
                                <div style={{ flex: 1 }}><strong>수정자:</strong> {postForm.lastMdfrId || '-'}</div>
                                <div style={{ flex: 1 }}><strong>게시판 타입:</strong> {getBrdTypeName(selectedBoard?.brdType)}</div>
                            </div>
                        )}
                        <div className="admin-form-row">
                            <label className="admin-form-label">게시글 제목 *</label>
                            <input 
                                type="text" 
                                className="admin-input" 
                                placeholder="제목을 입력하세요" 
                                value={postForm.title || ''} 
                                onChange={e => setPostForm({...postForm, title: e.target.value})} 
                                required 
                                disabled={isReadOnly}
                                style={{ flex: 1 }}
                            />
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">최상단 노출 기간</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="datetime-local" className="admin-input" value={postForm.rlsStartDt || ''} onChange={e => setPostForm({...postForm, rlsStartDt: e.target.value})} disabled={isReadOnly} />
                                <span>~</span>
                                <input type="datetime-local" className="admin-input" value={postForm.rlsEndDt || ''} onChange={e => setPostForm({...postForm, rlsEndDt: e.target.value})} disabled={isReadOnly} />
                                <span style={{ color: '#999', fontSize: '12px' }}>(미입력시 작성 즉시 발행됨)</span>
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label" style={{ alignItems: 'flex-start', paddingTop: '15px', height: 'auto' }}>게시글 내용</label>
                            <div style={{ flex: 1, background: '#fff' }}>
                                <ReactQuill 
                                    theme="snow" 
                                    value={postForm.content || ''} 
                                    onChange={val => setPostForm({...postForm, content: val})} 
                                    readOnly={isReadOnly}
                                    style={{ height: '250px', marginBottom: '40px' }} 
                                />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">노출 설정</label>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#d35400', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={postForm.ntcYn === 'Y'} onChange={e => setPostForm({...postForm, ntcYn: e.target.checked ? 'Y' : 'N'})} disabled={isReadOnly} style={{ marginRight: '5px' }} /> 
                                    메인 상단 공지 고정
                                </label>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#8e44ad', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={postForm.highlightYn === 'Y'} onChange={e => setPostForm({...postForm, highlightYn: e.target.checked ? 'Y' : 'N'})} disabled={isReadOnly} style={{ marginRight: '5px' }} /> 
                                    새게시글 강조 처리 (목록 표시 배경)
                                </label>
                            </div>
                        </div>

                        {selectedBoard?.atchFileYn === 'Y' && (
                            <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                                <label className="admin-form-label" style={{ alignItems: 'flex-start', paddingTop: '15px', height: 'auto' }}>첨부 파일</label>
                                <div style={{ flex: 1, background: '#fff8f0', padding: '10px', borderRadius: '4px', border: '1px solid #f39c12' }}>
                                    {!isReadOnly && (
                                        <input type="file" multiple onChange={handleFileChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
                                    )}

                                    {existingFiles.length > 0 && (
                                        <div style={{ padding: '8px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#2980b9', fontSize: '12px' }}>[기존 첨부 파일 목록]</span>
                                            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                                                {existingFiles.map(f => (
                                                    <li key={f.fileSn} style={{ marginBottom: '5px', fontSize: '12px' }}>
                                                        {f.fileOrgnlNm}
                                                        <span style={{color:'#aaa', margin:'0 10px'}}>({(f.fileSize/1024).toFixed(1)} KB)</span>
                                                        <button type="button" onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)} className="admin-btn admin-btn-secondary" style={{ padding: '2px 8px', fontSize: '11px', marginRight: '5px' }}>다운로드</button>
                                                        {!isReadOnly && (
                                                            <button type="button" onClick={() => handleFileDelete(f.fileSn)} className="admin-btn admin-btn-danger" style={{ padding: '2px 8px', fontSize: '11px' }}>삭제</button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="admin-modal-footer">
                            <button type="button" onClick={closeModal} className="admin-btn" style={{ background: '#fce4ec', color: '#c2185b', border: '1px solid #f8bbd0' }}>닫기</button>
                            
                            {isEdit && delYn === 'Y' && (
                                postForm.delYn === 'Y' ? (
                                    <button type="button" onClick={(e) => handleRestorePost(e, postForm.idx)} className="admin-btn admin-btn-success">차단 해제 (노출)</button>
                                ) : (
                                    <button type="button" onClick={(e) => handleLogicalDeletePost(e, postForm.idx)} className="admin-btn admin-btn-danger">강제 차단 (블라인드)</button>
                                )
                            )}

                            {!isReadOnly && (
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {isEdit ? '수정 사항 저장' : '신규 게시물 등록'}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Comment Section (Only visible when editing an existing post) */}
                    {isEdit && (
                        <div style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                            <BoardCommentSection 
                                sysId={sysId} 
                                brdId={selectedBoard.brdId} 
                                postId={postForm.idx} 
                                boardMaster={selectedBoard}
                                isAdmin={true}
                                menuAuth={menuAuth}
                            />
                        </div>
                    )}
        </Modal>
    );
};

export default BoardPostModal;
