import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../utils/apiClient';

const UserDynamicBoardList = () => {
    const { brdId } = useParams();
    const navigate = useNavigate();
    
    const [boardMaster, setBoardMaster] = useState(null);
    const [postList, setPostList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    
    // Search & Pagination state
    const [searchForm, setSearchForm] = useState({ searchType: 'TITLE', searchKeyword: '' });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    // FAQ / Q&A Accordion state
    const [expandedPostId, setExpandedPostId] = useState(null);

    // Secret Post Modal state
    const [secretModal, setSecretModal] = useState({ open: false, postId: null, inputPwd: '', errorMsg: '' });

    useEffect(() => {
        fetchBoardMaster();
    }, [brdId]);

    useEffect(() => {
        if (boardMaster) {
            fetchPostList();
        }
    }, [boardMaster, page, pageSize]);

    const fetchBoardMaster = async () => {
        const res = await apiClient('/user/api/board/dynamic/master', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brdId })
        });
        if (res.ok) {
            const data = await res.json();
            setBoardMaster(data);
            setSearchForm({ searchType: 'TITLE', searchKeyword: '' });
            setPage(1);
        } else {
            alert("존재하지 않거나 접근할 수 없는 게시판입니다.");
            navigate('/');
        }
    };

    const fetchPostList = async () => {
        const res = await apiClient('/user/api/board/dynamic/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brdId, page, pageSize, ...searchForm })
        });
        if (res.ok) {
            const data = await res.json();
            setPostList(data.list || []);
            setTotalCount(data.totalCount || 0);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPostList();
    };

    const handleWriteClick = () => {
        if (boardMaster?.userWriteYn === 'N') {
            alert("이 게시판은 쓰기 권한이 없습니다.");
            return;
        }
        navigate(`/user/board/view/${brdId}/write`);
    };

    const handlePostClick = (post) => {
        // If secret post
        if (post.secretYn === 'Y') {
            setSecretModal({ open: true, postId: post.idx, inputPwd: '', errorMsg: '' });
            return;
        }
        
        proceedPostClick(post.idx);
    };

    const proceedPostClick = (postId) => {
        if (boardMaster?.brdType === 'F' || boardMaster?.brdType === 'A') {
            setExpandedPostId(expandedPostId === postId ? null : postId);
        } else {
            navigate(`/user/board/view/${brdId}/detail/${postId}`);
        }
    };

    const handleSecretSubmit = () => {
        const post = postList.find(p => p.idx === secretModal.postId);
        if (post.secretPwd === secretModal.inputPwd) {
            setSecretModal({ open: false, postId: null, inputPwd: '', errorMsg: '' });
            proceedPostClick(post.idx);
        } else {
            setSecretModal({ ...secretModal, errorMsg: '비밀번호가 일치하지 않습니다.' });
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    if (!boardMaster) return <div style={{ padding: '20px' }}>게시판 설정을 불러오는 중입니다...</div>;

    const isGallery = boardMaster.brdType === 'G';

    return (
        <div>
            <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px', color: '#2c3e50' }}>
                {boardMaster.brdNm} <span style={{ fontSize: '14px', color: '#7f8c8d', fontWeight: 'normal' }}>({boardMaster.brdExpl})</span>
            </h2>

            {/* 상단 검색 영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', background: '#f8f9fa', padding: '15px', borderRadius: '4px', border: '1px solid #eee' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <select value={searchForm.searchType} onChange={e => setSearchForm({...searchForm, searchType: e.target.value})} style={{ padding: '6px' }}>
                        <option value="TITLE">제목</option>
                        <option value="CONTENT">내용</option>
                        <option value="WRITER">작성자</option>
                    </select>
                    <input type="text" value={searchForm.searchKeyword} onChange={e => setSearchForm({...searchForm, searchKeyword: e.target.value})} placeholder="검색어를 입력하세요" style={{ padding: '6px', width: '200px' }} />
                    <button type="submit" style={{ padding: '6px 15px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>검색</button>
                </form>
                
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} style={{ padding: '6px' }}>
                        <option value={20}>20건씩 보기</option>
                        <option value={50}>50건씩 보기</option>
                        <option value={100}>100건씩 보기</option>
                    </select>
                    {boardMaster.userWriteYn === 'Y' && (
                        <button onClick={handleWriteClick} style={{ padding: '8px 15px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>✍ 글쓰기</button>
                    )}
                </div>
            </div>

            <div style={{ fontSize: '13px', marginBottom: '10px', color: '#555' }}>전체: <b>{totalCount}</b>건</div>

            {/* 목록 렌더링 영역 */}
            {isGallery ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {postList.map(post => (
                        <div key={post.idx} onClick={() => proceedPostClick(post.idx)} style={{ border: post.highlightYn === 'Y' ? '2px solid #e67e22' : '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', background: post.ntcYn === 'Y' ? '#fcf3cf' : post.highlightYn === 'Y' ? '#fff9e6' : '#fff' }}>
                            <div style={{ height: '150px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                                {post.ntcYn === 'Y' && <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#e74c3c', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>공지</div>}
                                {(post.thumbSn || post.thumbsn || post.thumb_sn) ? (
                                    <img src={`/admin/api/comn/file/download/${post.thumbSn || post.thumbsn || post.thumb_sn}`} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{fontSize:'30px'}}>{post.atchFileGrpId ? '📁' : '📄'}</span>
                                )}
                            </div>
                            <div style={{ padding: '10px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {post.secretYn === 'Y' && '🔒 '}
                                    {post.title}
                                    {post.cmtCnt > 0 && <span style={{ color: '#e74c3c', marginLeft: '5px' }}>[{post.cmtCnt}]</span>}
                                </div>
                                <div style={{ fontSize: '12px', color: '#7f8c8d', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{post.wrtrNm}</span>
                                    <span>👁 {post.inqCnt}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {postList.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#aaa' }}>등록된 게시물이 없습니다.</div>}
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center', background: '#fff' }}>
                    <thead style={{ background: '#f1f2f6', color: '#2c3e50', borderBottom: '2px solid #ddd' }}>
                        <tr>
                            <th style={{ padding: '12px 8px', width: '60px' }}>번호</th>
                            <th style={{ padding: '12px 8px' }}>제목</th>
                            <th style={{ padding: '12px 8px', width: '100px' }}>작성자</th>
                            <th style={{ padding: '12px 8px', width: '120px' }}>등록일</th>
                            <th style={{ padding: '12px 8px', width: '60px' }}>조회</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.map(post => (
                            <React.Fragment key={post.idx}>
                                <tr onClick={() => handlePostClick(post)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee', background: post.ntcYn === 'Y' ? '#fcf3cf' : post.highlightYn === 'Y' ? '#fff9e6' : '#fff' }}>
                                    <td style={{ padding: '12px 8px' }}>{post.ntcYn === 'Y' ? '📌공지' : post.postNo}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'left', fontWeight: post.ntcYn === 'Y' || post.highlightYn === 'Y' ? 'bold' : 'normal', color: post.highlightYn === 'Y' ? '#e67e22' : 'inherit' }}>
                                        {boardMaster.brdType === 'F' && <span style={{ color: '#e74c3c', marginRight: '5px', fontWeight: 'bold' }}>Q.</span>}
                                        {boardMaster.brdType === 'A' && <span style={{ color: '#3498db', marginRight: '5px', fontWeight: 'bold' }}>Q.</span>}
                                        {post.highlightYn === 'Y' && <span style={{ marginRight: '5px' }}>✨</span>}
                                        {post.secretYn === 'Y' && <span style={{ marginRight: '5px' }}>🔒</span>}
                                        {post.title}
                                        {post.cmtCnt > 0 && <span style={{ color: '#e74c3c', marginLeft: '5px', fontSize: '0.9em', fontWeight: 'bold' }}>[{post.cmtCnt}]</span>}
                                    </td>
                                    <td style={{ padding: '12px 8px' }}>{post.wrtrNm}</td>
                                    <td style={{ padding: '12px 8px' }}>{post.frstRegDt ? new Date(post.frstRegDt).toLocaleDateString() : '-'}</td>
                                    <td style={{ padding: '12px 8px' }}>{post.inqCnt}</td>
                                </tr>
                                {/* FAQ / QNA 아코디언 본문 노출 영역 */}
                                {(boardMaster.brdType === 'F' || boardMaster.brdType === 'A') && expandedPostId === post.idx && (
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <td colSpan="5" style={{ padding: '20px 30px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <div style={{ color: boardMaster.brdType === 'F' ? '#3498db' : '#2ecc71', fontWeight: 'bold', fontSize: '18px' }}>A.</div>
                                                <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ flex: 1, lineHeight: '1.6' }} />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {postList.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '50px', color: '#aaa' }}>게시물이 존재하지 않습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* 페이징 및 하단 등록 버튼 영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <div style={{ width: '100px' }}></div>
                
                <div style={{ display: 'flex', gap: '5px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} style={{ padding: '5px 10px', border: '1px solid #ddd', background: page === p ? '#3498db' : '#fff', color: page === p ? '#fff' : '#333', cursor: 'pointer', borderRadius: '4px' }}>
                            {p}
                        </button>
                    ))}
                </div>

                <div style={{ width: '100px', textAlign: 'right' }}>
                    {boardMaster.userWriteYn === 'Y' && (
                        <button onClick={handleWriteClick} style={{ padding: '8px 15px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>✍ 글쓰기</button>
                    )}
                </div>
            </div>

            {/* 비밀글 비밀번호 입력 모달 */}
            {secretModal.open && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔒 비밀글 확인
                        </h3>
                        <div style={{ marginBottom: '15px' }}>
                            <input 
                                type="password" 
                                value={secretModal.inputPwd} 
                                onChange={e => {
                                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                    setSecretModal({...secretModal, inputPwd: val, errorMsg: ''});
                                }} 
                                placeholder="비밀번호 숫자 4자리 입력" 
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center', letterSpacing: '5px', fontSize: '16px' }}
                            />
                            {secretModal.errorMsg && <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '5px', textAlign: 'center' }}>{secretModal.errorMsg}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setSecretModal({open: false, postId: null, inputPwd: '', errorMsg: ''})} style={{ flex: 1, padding: '10px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                            <button onClick={handleSecretSubmit} style={{ flex: 1, padding: '10px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDynamicBoardList;
