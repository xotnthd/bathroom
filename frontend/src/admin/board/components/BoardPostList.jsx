import React from 'react';
import Pagination from '../../../components/common/Pagination';

const BoardPostList = ({
    selectedBoard,
    postList, postCurrentPage, setPostCurrentPage, postTotalPages, postTotalCount,
    postsPerPage, setPostsPerPage,
    selectedPostIds, setSelectedPostIds,
    openModal,
    handleBulkDeletePost, handleBulkRestorePost,
    menuAuth
}) => {
    const { delYn, rgstYn } = menuAuth;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPostIds(postList.map(p => p.idx));
        } else {
            setSelectedPostIds([]);
        }
    };

    const handleSelectPost = (idx, isChecked) => {
        if (isChecked) {
            setSelectedPostIds([...selectedPostIds, idx]);
        } else {
            setSelectedPostIds(selectedPostIds.filter(id => id !== idx));
        }
    };

    if (!selectedBoard) {
        return (
            <div className="admin-card" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#7f8c8d' }}>
                게시판을 먼저 선택해주세요.
            </div>
        );
    }

    return (
        <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span className="admin-card-title">게시글 목록 <span style={{ color: 'var(--admin-primary)', fontSize: '14px' }}>({selectedBoard.brdNm} - 총 {postTotalCount}건)</span></span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {delYn === 'Y' && (
                        <>
                            <button onClick={handleBulkDeletePost} className="admin-btn admin-btn-danger">선택 일괄 차단</button>
                            <button onClick={handleBulkRestorePost} className="admin-btn admin-btn-success">선택 차단 해제</button>
                        </>
                    )}
                    {rgstYn === 'Y' && (
                        <button onClick={() => openModal(null)} className="admin-btn admin-btn-warning">+ 신규 글 등록</button>
                    )}
                </div>
            </div>

            <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)', zIndex: 1 }}>
                        <tr>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)', width: '40px' }}>
                                <input type="checkbox" onChange={handleSelectAll} checked={postList.length > 0 && selectedPostIds.length === postList.length} />
                            </th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>No</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>제목</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>첨부파일</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>상태</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>등록자</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>등록일시</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>수정자</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>수정일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.map(p => (
                            <tr 
                                key={p.idx} 
                                onClick={() => openModal(p)} 
                                style={{ 
                                    cursor: 'pointer', 
                                    background: p.highlightYn === 'Y' ? '#fff9c4' : (p.delYn === 'Y' ? '#fde8e8' : 'none'),
                                    borderBottom: '1px solid var(--border-color)'
                                }}
                                className="admin-table-row-hover"
                            >
                                <td style={{ padding: '10px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" checked={selectedPostIds.includes(p.idx)} onChange={e => handleSelectPost(p.idx, e.target.checked)} />
                                </td>
                                <td style={{ padding: '10px' }}>{p.ntcYn === 'Y' ? '공지사항' : p.postNo}</td>
                                <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'left' }}>
                                    {p.title}
                                    {p.cmtCnt > 0 && <span style={{ color: 'var(--admin-primary)', marginLeft: '5px' }}>({p.cmtCnt})</span>}
                                </td>
                                <td style={{ padding: '10px' }}>{p.atchFileGrpId ? 'O' : '-'}</td>
                                <td style={{ padding: '10px', color: p.delYn === 'Y' ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                                    {p.delYn === 'Y' ? '차단됨' : '노출중'}
                                </td>
                                <td style={{ padding: '10px' }}>{p.wrtrNm || p.frstRgstrId || '-'}</td>
                                <td style={{ padding: '10px' }}>{p.frstRegDt ? new Date(p.frstRegDt).toLocaleString() : '-'}</td>
                                <td style={{ padding: '10px' }}>{p.lastMdfrId || '-'}</td>
                                <td style={{ padding: '10px' }}>{p.lastMdfcnDt ? new Date(p.lastMdfcnDt).toLocaleString() : '-'}</td>
                            </tr>
                        ))}
                        {postList.length === 0 && (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>게시물이 존재하지 않습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination & List size */}
            {postList.length > 0 && (
                <Pagination
                    currentPage={postCurrentPage}
                    totalPages={postTotalPages}
                    onPageChange={setPostCurrentPage}
                    pageSize={postsPerPage}
                    onPageSizeChange={setPostsPerPage}
                />
            )}
        </div>
    );
};

export default BoardPostList;
