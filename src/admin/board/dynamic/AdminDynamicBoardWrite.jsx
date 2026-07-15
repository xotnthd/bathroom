import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../../utils/apiClient';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import RlsPeriod from './RlsPeriod';
import { useMenuAuth } from '../../hooks/useMenuAuth';

const AdminDynamicBoardWrite = () => {
    const { brdId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();
    
    // Parse postId from query string if it exists (for Edit mode)
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get('postId');

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const [boardMaster, setBoardMaster] = useState(null);
    const [postForm, setPostForm] = useState({ idx: '', title: '', content: '', atchFileGrpId: '', ntcYn: 'N', highlightYn: 'N', rlsStartDt: '', rlsEndDt: '', secretYn: 'N', secretPwd: '' });
    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchBoardMaster();
            if (postId) {
                fetchPostDetail();
            }
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [brdId, postId, inqireYn]);

    const fetchBoardMaster = async () => {
        const res = await apiClient('/admin/api/board/dynamic/master', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, brdId })
        });
        if (res.ok) setBoardMaster(await res.json());
    };

    const fetchPostDetail = async () => {
        const res = await apiClient('/admin/api/board/dynamic/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, idx: postId })
        });
        if (res.ok) {
            const data = await res.json();
            if (data.detail) {
                setPostForm(prev => ({ ...prev, ...data.detail }));
                if (data.detail.atchFileGrpId) {
                    fetchExistingFiles(data.detail.atchFileGrpId);
                }
            }
        }
    };

    const fetchExistingFiles = async (grpId) => {
        const fRes = await apiClient(`/admin/api/comn/file/list/${grpId}?sysId=${defaultSysId}`);
        if (fRes.ok) setExistingFiles(await fRes.json());
    };

    const handleFileChange = (e) => {
        setUploadFiles(Array.from(e.target.files));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (postId ? (mdfcnYn !== 'Y') : (rgstYn !== 'Y')) {
            alert('권한이 없습니다.');
            return;
        }

        if (!postForm.title.trim()) return alert("제목을 입력하세요.");
        const formData = new FormData();
        formData.append('sysId', defaultSysId);
        formData.append('brdId', brdId);
        Object.keys(postForm).forEach(key => formData.append(key, postForm[key] || ''));

        uploadFiles.forEach(file => { formData.append('files', file); });

        const res = await apiClient('/admin/api/board/post/save', { method: 'POST', body: formData });
        if (res.ok) {
            alert("게시물 저장이 완료되었습니다.");
            navigate(`/admin/board/view/${brdId}`);
        } else {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleFileDelete = async (fileSn) => {
        if (delYn !== 'Y') {
            alert('삭제 권한이 없습니다.');
            return;
        }
        if (!window.confirm("파일을 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/comn/file/delete/${fileSn}`, { method: 'DELETE' });
        if (res.ok && postForm.atchFileGrpId) {
            fetchExistingFiles(postForm.atchFileGrpId);
        }
    };

    if (!boardMaster) return <div style={{ padding: '20px' }}>로딩중...</div>;

    const isFaq = boardMaster.brdType === 'F';

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #e67e22', paddingBottom: '10px', color: '#d35400' }}>
                {boardMaster.brdNm} - {postId ? '수정' : '신규 작성'}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '20px' }}>
                <div style={{ display: 'flex', gap: '1rem', padding: '10px', background: '#f8f9fa', borderRadius: '4px', border: '1px solid #ddd' }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#d35400', cursor: 'pointer' }}>
                        <input type="checkbox" checked={postForm.ntcYn === 'Y'} onChange={e => setPostForm({...postForm, ntcYn: e.target.checked ? 'Y' : 'N'})} style={{ marginRight: '5px' }} /> 상단 공지 고정
                    </label>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#8e44ad', cursor: 'pointer' }}>
                        <input type="checkbox" checked={postForm.highlightYn === 'Y'} onChange={e => setPostForm({...postForm, highlightYn: e.target.checked ? 'Y' : 'N'})} style={{ marginRight: '5px' }} /> 게시물 강조 처리 (목록 배경)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto', background: '#fcf3cf', padding: '5px 10px', borderRadius: '4px', border: '1px solid #f1c40f' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <input type="checkbox" checked={postForm.secretYn === 'Y'} onChange={e => {
                                setPostForm({...postForm, secretYn: e.target.checked ? 'Y' : 'N', secretPwd: ''})
                            }} />
                            비밀글 설정
                        </label>
                        {postForm.secretYn === 'Y' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ fontSize: '13px' }}>비밀번호 (숫자 4자리):</span>
                                <input 
                                    type="text" 
                                    value={postForm.secretPwd} 
                                    onChange={e => {
                                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                        setPostForm({...postForm, secretPwd: val});
                                    }} 
                                    placeholder="0000" 
                                    style={{ width: '60px', padding: '3px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '3px' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold' }}>{isFaq ? '질문 (Question)' : '제목'}</label>
                    <input type="text" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} required placeholder={isFaq ? '질문' : '게시글'} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '15px' }} />
                </div>

                <RlsPeriod 
                    rlsStartDt={postForm.rlsStartDt} 
                    rlsEndDt={postForm.rlsEndDt} 
                    onChangeStart={val => setPostForm({...postForm, rlsStartDt: val})} 
                    onChangeEnd={val => setPostForm({...postForm, rlsEndDt: val})} 
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '40px' }}>
                    <label style={{ fontWeight: 'bold' }}>{isFaq ? '답변 (Answer)' : '본문 내용'}</label>
                    <div style={{ height: '300px', background: '#fff' }}>
                        <ReactQuill theme="snow" value={postForm.content || ''} onChange={val => setPostForm({...postForm, content: val})} style={{ height: '260px' }} />
                    </div>
                </div>

                {boardMaster.atchFileYn === 'Y' && (
                    <div style={{ background: '#fff8f0', padding: '15px', borderRadius: '4px', border: '1px solid #f39c12' }}>
                        <strong style={{color:'#d35400', display:'block', marginBottom:'10px'}}>다중 첨부파일</strong>
                        <input type="file" multiple onChange={handleFileChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />

                        {existingFiles.length > 0 && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
                                <span style={{ fontWeight: 'bold', color: '#2980b9' }}>[기존 보관 파일 목록]</span>
                                <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', color: '#333' }}>
                                    {existingFiles.map(f => (
                                        <li key={f.fileSn} style={{ marginBottom: '8px', fontSize: '13px' }}>
                                            {f.fileOrgnlNm} <span style={{color:'#aaa', margin:'0 10px'}}>({(f.fileSize/1024).toFixed(1)} KB)</span>
                                            {delYn === 'Y' && (
                                                <button type="button" onClick={() => handleFileDelete(f.fileSn)} style={{ fontSize: '11px', background: '#ff7675', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px 6px', borderRadius: '3px' }}>삭제</button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
                    <button type="button" onClick={() => navigate(`/admin/board/view/${brdId}`)} style={{ padding: '12px 25px', background: '#ecf0f1', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>취소</button>
                    {((postId && mdfcnYn === 'Y') || (!postId && rgstYn === 'Y')) && (
                        <button type="submit" style={{ padding: '12px 25px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{postId ? '수정' : '게시물 등록'}</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AdminDynamicBoardWrite;
