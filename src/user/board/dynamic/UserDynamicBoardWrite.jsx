import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../../utils/apiClient';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const UserDynamicBoardWrite = () => {
    const { brdId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get('postId');

    const defaultSysId = 'CORE';
    const [boardMaster, setBoardMaster] = useState(null);
    const [postForm, setPostForm] = useState({ idx: '', title: '', content: '', atchFileGrpId: '', ntcYn: 'N', highlightYn: 'N', rlsStartDt: '', rlsEndDt: '', secretYn: 'N', secretPwd: '' });
    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);

    useEffect(() => {
        fetchBoardMaster();
        if (postId) {
            fetchPostDetail();
        }
    }, [brdId, postId]);

    const fetchBoardMaster = async () => {
        const res = await apiClient('/user/api/board/dynamic/master', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, brdId })
        });
        if (res.ok) {
            const data = await res.json();
            setBoardMaster(data);
            if (data.userWriteYn === 'N') {
                alert("해당 게시판은 사용자 쓰기 권한이 없습니다.");
                navigate(-1);
            }
        } else {
            alert("존재하지 않거나 접근할 수 없는 게시판입니다.");
            navigate('/');
        }
    };

    const fetchPostDetail = async () => {
        const res = await apiClient('/user/api/board/dynamic/detail', {
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
        // user file api would ideally be used here, assuming comn/file/list is public or user accessible
        const fRes = await apiClient(`/admin/api/comn/file/list/${grpId}?sysId=${defaultSysId}`);
        if (fRes.ok) setExistingFiles(await fRes.json());
    };

    const handleFileChange = (e) => {
        setUploadFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('sysId', defaultSysId);
        formData.append('brdId', brdId);
        Object.keys(postForm).forEach(key => formData.append(key, postForm[key] || ''));

        uploadFiles.forEach(file => { formData.append('files', file); });

        // Assuming save endpoint is common or user specific
        const res = await apiClient('/admin/api/board/post/save', { method: 'POST', body: formData });
        if (res.ok) {
            alert("게시물 저장이 완료되었습니다.");
            navigate(`/user/board/view/${brdId}`);
        } else {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleFileDelete = async (fileSn) => {
        if (!window.confirm("파일을 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/comn/file/delete/${fileSn}`, { method: 'DELETE' });
        if (res.ok && postForm.atchFileGrpId) {
            fetchExistingFiles(postForm.atchFileGrpId);
        }
    };

    if (!boardMaster) return <div style={{ padding: '20px' }}>로딩중...</div>;

    const isFaq = boardMaster.brdType === 'F';

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px', color: '#2980b9' }}>
                ✍ {boardMaster.brdNm} - {postId ? '수정' : '신규 작성'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold' }}>{isFaq ? '❓ 질문 (Question)' : '📝 제목'}</label>
                    <input type="text" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} required placeholder={isFaq ? '질문을 입력하세요' : '게시글 제목을 입력하세요'} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '15px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '40px' }}>
                    <label style={{ fontWeight: 'bold' }}>{isFaq ? '💡 답변 (Answer)' : '📄 본문 내용'}</label>
                    <div style={{ height: '300px', background: '#fff' }}>
                        <ReactQuill theme="snow" value={postForm.content || ''} onChange={val => setPostForm({...postForm, content: val})} style={{ height: '260px' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#fcf3cf', borderRadius: '4px', border: '1px solid #f1c40f' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        <input type="checkbox" checked={postForm.secretYn === 'Y'} onChange={e => {
                            setPostForm({...postForm, secretYn: e.target.checked ? 'Y' : 'N', secretPwd: ''})
                        }} />
                        �� 비밀글 설정
                    </label>
                    {postForm.secretYn === 'Y' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '14px' }}>비밀번호 (숫자 4자리):</span>
                            <input 
                                type="password" 
                                value={postForm.secretPwd} 
                                onChange={e => {
                                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                    setPostForm({...postForm, secretPwd: val});
                                }} 
                                placeholder="****" 
                                style={{ width: '80px', padding: '5px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '3px' }}
                            />
                        </div>
                    )}
                </div>

                {boardMaster.atchFileYn === 'Y' && (
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        <strong style={{color:'#34495e', display:'block', marginBottom:'10px'}}>�� 다중 첨부파일</strong>
                        <input type="file" multiple onChange={handleFileChange} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />

                        {existingFiles.length > 0 && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
                                <span style={{ fontWeight: 'bold', color: '#2980b9' }}>[기존 보관 파일 목록]</span>
                                <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', color: '#333' }}>
                                    {existingFiles.map(f => (
                                        <li key={f.fileSn} style={{ marginBottom: '8px', fontSize: '13px' }}>
                                            {f.fileOrgnlNm} <span style={{color:'#aaa', margin:'0 10px'}}>({(f.fileSize/1024).toFixed(1)} KB)</span>
                                            <button type="button" onClick={() => handleFileDelete(f.fileSn)} style={{ fontSize: '11px', background: '#ff7675', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px 6px', borderRadius: '3px' }}>삭제</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={() => navigate(`/user/board/view/${brdId}`)} style={{ flex: 1, padding: '12px', background: '#95a5a6', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold' }}>취소 및 목록으로</button>
                    <button type="submit" style={{ flex: 2, padding: '12px', background: '#3498db', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold' }}>등록</button>
                </div>
            </form>
        </div>
    );
};

export default UserDynamicBoardWrite;
