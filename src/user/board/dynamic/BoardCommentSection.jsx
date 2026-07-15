import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';

const CommentFileList = ({ grpId, sysId }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (grpId) fetchFiles();
    }, [grpId]);

    const fetchFiles = async () => {
        const res = await apiClient(`/admin/api/comn/file/list/${grpId}?sysId=${sysId}`);
        if (res.ok) setFiles(await res.json());
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

    if (files.length === 0) return null;

    return (
        <div style={{ marginTop: '8px', fontSize: '12px', background: '#f1f2f6', padding: '8px', borderRadius: '4px' }}>
            <strong style={{ color: '#2c3e50', marginBottom: '5px', display: 'block' }}>�� 첨부파일 ({files.length}건)</strong>
            <ul style={{ margin: 0, paddingLeft: '15px' }}>
                {files.map(f => (
                    <li key={f.fileSn} style={{ marginBottom: '4px' }}>
                        <span onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)} style={{ color: '#2980b9', textDecoration: 'underline', cursor: 'pointer' }}>
                            {f.fileOrgnlNm} <span style={{ color: '#7f8c8d', fontSize: '11px' }}>({(f.fileSize/1024).toFixed(1)} KB)</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const BoardCommentSection = ({ sysId, brdId, postId, boardMaster, isAdmin, menuAuth }) => {
    const [comments, setComments] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [newFiles, setNewFiles] = useState(null);
    const [replyTo, setReplyTo] = useState(null); // cmtIdx of parent
    const [replyContent, setReplyContent] = useState('');
    const [replyFiles, setReplyFiles] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const res = await apiClient('/api/board/comment/list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sysId, brdId, postIdx: postId })
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data.list || []);
                setCurrentUserId(data.currentUserId || null);
            }
        } catch (err) {
            console.error("댓글 불러오기 오류", err);
        }
    };

    const handleSaveComment = async (parentCmtIdx = null, content, files) => {
        if (!content.trim()) return alert("댓글 내용을 입력하세요.");
        
        // Depth validation if it's a reply
        if (parentCmtIdx) {
            if (boardMaster.rereplyYn === 'N') return alert("대댓글이 허용되지 않은 게시판입니다.");
            const parentCmt = comments.find(c => c.cmtIdx === parentCmtIdx);
            if (parentCmt && parentCmt.cmtDepth >= boardMaster.rereplyDepth) {
                return alert(`대댓글은 최대 ${boardMaster.rereplyDepth} depth 까지만 작성 가능합니다.`);
            }
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("commentData", JSON.stringify({
                sysId, brdId, postIdx: postId, parentCmtIdx, cmtContent: content
            }));
            if (files && boardMaster.cmtAtchFileYn === 'Y') {
                for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
            }

            const res = await apiClient('/api/board/comment/save', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                alert("댓글이 등록되었습니다.");
                setNewComment('');
                setNewFiles(null);
                setReplyTo(null);
                setReplyContent('');
                setReplyFiles(null);
                fetchComments();
            } else {
                alert("등록 실패");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (cmtIdx) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            const res = await apiClient(`/api/board/comment/delete/${cmtIdx}`, { method: 'DELETE' });
            if (res.ok) fetchComments();
        } catch (err) {
            console.error("삭제 실패", err);
        }
    };

    if (boardMaster?.userReplyYn === 'N' && comments.length === 0) {
        return null; // 댓글을 허용하지 않고, 달린 댓글도 없으면 렌더링 X
    }

    return (
        <div style={{ marginTop: '30px', padding: '20px', background: '#f9f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>�� 댓글 ({comments.length})</h4>
            
            {/* 리스트 출력 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {comments.map(c => (
                    <div key={c.cmtIdx} style={{ 
                        marginLeft: `${c.cmtDepth * 20}px`, 
                        padding: '12px', background: c.cmtDepth > 0 ? '#f0f4f8' : '#fff', 
                        border: '1px solid #e1e8ed', borderRadius: '6px'
                    }}>
                        {c.delYn === 'Y' ? (
                            <div style={{ color: '#95a5a6', fontStyle: 'italic' }}>삭제된 댓글입니다.</div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#7f8c8d' }}>
                                    <span><b>{c.wrtrNm}</b> | {new Date(c.frstRegDt).toLocaleString()}</span>
                                    <div>
                                        {boardMaster.rereplyYn === 'Y' && c.cmtDepth < boardMaster.rereplyDepth && (!isAdmin || menuAuth?.mdfcnYn === 'Y') && (
                                            <span onClick={() => setReplyTo(replyTo === c.cmtIdx ? null : c.cmtIdx)} style={{ color: '#2980b9', cursor: 'pointer', marginRight: '10px' }}>답글</span>
                                        )}
                                        {((isAdmin && menuAuth?.delYn === 'Y') || (!isAdmin && currentUserId && c.wrtrNm === currentUserId)) && (
                                            <span onClick={() => handleDeleteComment(c.cmtIdx)} style={{ color: '#e74c3c', cursor: 'pointer' }}>삭제</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ fontSize: '14px', color: '#333', whiteSpace: 'pre-wrap' }}>{c.cmtContent}</div>
                                {c.atchFileGrpId && (
                                    <CommentFileList grpId={c.atchFileGrpId} sysId={sysId} />
                                )}
                            </>
                        )}

                        {/* 대댓글 작성 폼 */}
                        {replyTo === c.cmtIdx && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="답글을 남겨주세요..." style={{ width: '100%', height: '60px', padding: '8px', boxSizing: 'border-box' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    {boardMaster.cmtAtchFileYn === 'Y' ? (
                                        <input type="file" multiple onChange={e => setReplyFiles(e.target.files)} style={{ fontSize: '12px' }} />
                                    ) : <div/>}
                                    <button onClick={() => handleSaveComment(c.cmtIdx, replyContent, replyFiles)} disabled={loading} style={{ padding: '6px 12px', background: '#34495e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>등록</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 메인 댓글 작성 폼 */}
            {boardMaster?.userReplyYn === 'Y' && (!isAdmin || menuAuth?.mdfcnYn === 'Y') && (
                <div style={{ padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>
                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="댓글을 남겨주세요..." style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        {boardMaster.cmtAtchFileYn === 'Y' ? (
                            <input type="file" multiple onChange={e => setNewFiles(e.target.files)} />
                        ) : <div/>}
                        <button onClick={() => handleSaveComment(null, newComment, newFiles)} disabled={loading} style={{ padding: '8px 20px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>댓글 등록</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardCommentSection;
