import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../utils/apiClient';
import { useMenuAuth } from '../../hooks/useMenuAuth';

const AdminDynamicBoardList = () => {
    const { brdId } = useParams();
    const navigate = useNavigate();
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth();
    
    const [boardMaster, setBoardMaster] = useState(null);
    const [postList, setPostList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    
    // Search & Pagination state
    const [searchForm, setSearchForm] = useState({ searchType: 'TITLE', searchKeyword: '' });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    // FAQ Accordion state
    const [expandedPostId, setExpandedPostId] = useState(null);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchBoardMaster();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brdId, inqireYn]);

    useEffect(() => {
        if (boardMaster && inqireYn === 'Y') {
            fetchPostList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardMaster, page, pageSize, inqireYn]);

    const fetchBoardMaster = async () => {
        const res = await apiClient('/admin/api/board/dynamic/master', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brdId })
        });
        if (res.ok) {
            const data = await res.json();
            setBoardMaster(data);
            setSearchForm({ searchType: 'TITLE', searchKeyword: '' });
            setPage(1);
        }
    };

    const fetchPostList = async () => {
        const res = await apiClient('/admin/api/board/dynamic/list', {
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
        if (rgstYn !== 'Y') {
            alert('작성 권한이 없습니다.');
            return;
        }
        navigate(`/admin/board/view/${brdId}/write`);
    };

    const handlePostClick = (postId) => {
        if (boardMaster?.brdType === 'F' || boardMaster?.brdType === 'A') {
            setExpandedPostId(expandedPostId === postId ? null : postId);
        } else {
            navigate(`/admin/board/view/${brdId}/detail/${postId}`);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    if (!boardMaster) return <div style={{ padding: '20px' }}>게시판정보를 불러오는 중입니다...</div>;

    const isGallery = boardMaster.brdType === 'G';

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h2 style={{ borderBottom: '2px solid #2c3e50', paddingBottom: '10px', color: '#2c3e50' }}>
                {boardMaster.brdNm} <span style={{ fontSize: '14px', color: '#7f8c8d', fontWeight: 'normal' }}>({boardMaster.brdExpl})</span>
            </h2>

            {/* 상단 검색영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <select value={searchForm.searchType} onChange={e => setSearchForm({...searchForm, searchType: e.target.value})} style={{ padding: '6px' }}>
                        <option value="TITLE">제목</option>
                        <option value="CONTENT">내용</option>
                        <option value="WRITER">작성자</option>
                        <option value="ALL">제목+내용</option>
                    </select>
                    <input type="text" value={searchForm.searchKeyword} onChange={e => setSearchForm({...searchForm, searchKeyword: e.target.value})} placeholder="검색어를 입력하세요" style={{ padding: '6px', width: '200px' }} />
                    <button type="submit" style={{ padding: '6px 15px', background: '#34495e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>검색</button>
                </form>
                
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} style={{ padding: '6px' }}>
                        <option value={20}>20건씩 보기</option>
                        <option value={50}>50건씩 보기</option>
                        <option value={100}>100건씩 보기</option>
                    </select>
                    {rgstYn === 'Y' && (
                    <button onClick={handleWriteClick} style={{ padding: '8px 15px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>글쓰기</button>
                    )}
                </div>
            </div>

            <div style={{ fontSize: '13px', marginBottom: '10px', color: '#555' }}>전체: <b>{totalCount}</b>건</div>

            {/* 목록 영역 */}
            {isGallery ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {postList.map(post => (
                        <div key={post.idx} onClick={() => handlePostClick(post.idx)} style={{ border: post.highlightYn === 'Y' ? '2px solid #e67e22' : '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', background: post.ntcYn === 'Y' ? '#fcf3cf' : post.highlightYn === 'Y' ? '#fff9e6' : '#fff' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
                                    {post.secretYn === 'Y' && <span style={{ color: '#e74c3c' }}>🔒[{post.secretPwd}] </span>}
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
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                    <thead style={{ background: '#2c3e50', color: '#fff' }}>
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
                                <tr onClick={() => handlePostClick(post.idx)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee', background: post.ntcYn === 'Y' ? '#fcf3cf' : post.highlightYn === 'Y' ? '#fff9e6' : '#fff' }}>
                                    <td style={{ padding: '12px 8px' }}>{post.ntcYn === 'Y' ? '공지' : post.postNo}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'left', fontWeight: post.ntcYn === 'Y' || post.highlightYn === 'Y' ? 'bold' : 'normal', color: post.highlightYn === 'Y' ? '#e67e22' : 'inherit' }}>
                                        {boardMaster.brdType === 'F' && <span style={{ color: '#e74c3c', marginRight: '5px', fontWeight: 'bold' }}>Q.</span>}
                                        {boardMaster.brdType === 'A' && <span style={{ color: '#3498db', marginRight: '5px', fontWeight: 'bold' }}>Q.</span>}
                                        {post.highlightYn === 'Y' && <span style={{ marginRight: '5px' }}>⭐</span>}
                                        {post.secretYn === 'Y' && <span style={{ marginRight: '5px', color: '#e74c3c' }}>🔒[{post.secretPwd}]</span>}
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
                                            {mdfcnYn === 'Y' && (
                                                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                    <button onClick={() => navigate(`/admin/board/view/${brdId}/write?postId=${post.idx}`)} style={{ padding: '5px 10px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>수정</button>
                                                </div>
                                            )}
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

            {/* 하단 페이지네이션 및 우측 등록 버튼 영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <div style={{ width: '100px' }}></div> {/* 좌측 여백 균형 */}
                
                <div style={{ display: 'flex', gap: '5px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} style={{ padding: '5px 10px', border: '1px solid #ddd', background: page === p ? '#3498db' : '#fff', color: page === p ? '#fff' : '#333', cursor: 'pointer', borderRadius: '4px' }}>
                            {p}
                        </button>
                    ))}
                </div>

                <div style={{ width: '100px', textAlign: 'right' }}>
                    {rgstYn === 'Y' && (
                        <button onClick={handleWriteClick} style={{ padding: '8px 15px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>글쓰기</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDynamicBoardList;
