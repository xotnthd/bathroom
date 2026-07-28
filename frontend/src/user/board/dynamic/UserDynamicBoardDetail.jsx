import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../utils/apiClient';
import BoardCommentSection from './BoardCommentSection';

const UserDynamicBoardDetail = () => {
    const { brdId, postId } = useParams();
    const navigate = useNavigate();
    
    const defaultSysId = 'CORE';
    const [boardMaster, setBoardMaster] = useState(null);
    const [postDetail, setPostDetail] = useState(null);
    const [existingFiles, setExistingFiles] = useState([]);
    
    // Assume we have a way to know the current logged in user's name or ID
    // For now, let's just assume we check if wrtrNm matches to show edit/delete
    // In a real scenario, check wrtr_idx or login token

    useEffect(() => {
        fetchBoardMaster();
        fetchPostDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brdId, postId]);

    const fetchBoardMaster = async () => {
        const res = await apiClient('/user/api/board/dynamic/master', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, brdId })
        });
        if (res.ok) setBoardMaster(await res.json());
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
                setPostDetail(data.detail);
                if (data.detail.atchFileGrpId) {
                    fetchExistingFiles(data.detail.atchFileGrpId);
                }
            } else {
                alert("삭제되었거나 존재하지 않는 게시물입니다.");
                navigate(-1);
            }
        }
    };

    const fetchExistingFiles = async (grpId) => {
        const fRes = await apiClient(`/admin/api/comn/file/list/${grpId}?sysId=${defaultSysId}`);
        if (fRes.ok) setExistingFiles(await fRes.json());
    };

    const handleFileDownload = async (fileSn, originalName) => {
        try {
            const res = await apiClient(`/admin/api/comn/file/download/${fileSn}`, { method: 'GET' });
            if (!res.ok) return alert("파일 다운로드 실패");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) { alert("다운로드 오류"); }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/board/post/kick/${postId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("게시물이 삭제되었습니다.");
            navigate(`/user/board/view/${brdId}`);
        }
    };

    if (!boardMaster || !postDetail) return <div style={{ padding: '20px' }}>게시물 불러오는 중...</div>;

    const isFaq = boardMaster.brdType === 'F';
    const isGallery = boardMaster.brdType === 'G';

    // Simple check for edit permission (should be handled via backend and login session)
    // For demo, we just assume if userWriteYn is Y, anyone can edit (unsafe, but UI placeholder)
    // A better approach is returning "canEdit" boolean from detail API based on security context.
    const canEdit = boardMaster.userWriteYn === 'Y'; 

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px', color: '#2c3e50', marginBottom: '0' }}>
                {isFaq && <span style={{ color: '#e74c3c', marginRight: '8px' }}>Q.</span>}
                {postDetail.title}
            </h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #ddd', fontSize: '13px', color: '#7f8c8d' }}>
                <div>
                    <span style={{ marginRight: '15px' }}><b>작성자:</b> {postDetail.wrtrNm}</span>
                    <span style={{ marginRight: '15px' }}><b>등록일:</b> {postDetail.frstRegDt ? new Date(postDetail.frstRegDt).toLocaleString() : '-'}</span>
                </div>
                <div>
                    <span><b>조회수:</b> {postDetail.inqCnt}</span>
                </div>
            </div>

            <div style={{ padding: '30px 10px', minHeight: '300px', lineHeight: '1.6', fontSize: '15px', color: '#333' }}>
                {isFaq && <div style={{ color: '#3498db', fontWeight: 'bold', fontSize: '20px', marginBottom: '10px' }}>A.</div>}
                <div dangerouslySetInnerHTML={{ __html: postDetail.content }} />
            </div>

            {existingFiles.length > 0 && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}>
                    {isGallery ? (
                        <div style={{ margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {existingFiles.map(f => (
                                <img key={`img_${f.fileSn}`} src={`/admin/api/comn/file/download/${f.fileSn}`} alt={f.fileOrgnlNm} style={{ maxWidth: '100%', borderRadius: '4px' }} />
                            ))}
                        </div>
                    ) : (
                        <>
                            <strong style={{ color: '#2980b9' }}>�� 첨부파일 ({existingFiles.length}건)</strong>
                            <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
                                {existingFiles.map(f => (
                                    <li key={f.fileSn} style={{ marginBottom: '8px', fontSize: '13px' }}>
                                        <span onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)} style={{ color: '#34495e', cursor: 'pointer', textDecoration: 'underline' }}>
                                            {f.fileOrgnlNm}
                                        </span>
                                        <span style={{ color: '#95a5a6', marginLeft: '10px' }}>({(f.fileSize/1024).toFixed(1)} KB)</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}

            <BoardCommentSection 
                sysId={defaultSysId} 
                brdId={brdId} 
                postId={postId} 
                boardMaster={boardMaster}
                isAdmin={false}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button onClick={() => navigate(`/user/board/view/${brdId}`)} style={{ padding: '10px 20px', background: '#ecf0f1', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>목록으로</button>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {canEdit && (
                        <>
                            <button onClick={() => navigate(`/user/board/view/${brdId}/write?postId=${postId}`)} style={{ padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>수정</button>
                            <button onClick={handleDelete} style={{ padding: '10px 20px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>삭제</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDynamicBoardDetail;
