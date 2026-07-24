import React from 'react';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useBoardPostManage } from './hooks/useBoardPostManage';
import BoardMasterList from './components/BoardMasterList';
import BoardPostList from './components/BoardPostList';
import BoardPostModal from './components/BoardPostModal';
import '../../assets/css/admin-board-post.css';

const BoardPostManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const menuAuth = useMenuAuth();
    const { inqireYn, rgstYn, mdfcnYn, delYn, menuNm } = menuAuth;

    const boardManageData = useBoardPostManage(defaultSysId, inqireYn, rgstYn, mdfcnYn, delYn);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px' }}>조회 권한이 없습니다. 관리자에게 문의하세요.</div>;
    }

    return (
        <div className="board-post-manage-layout">
            {/* Top Area: Board Master List Search & Grid */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', justifyContent: 'flex-start', gap: '24px' }}>
                    <span className="admin-card-title">{menuNm || '게시판 상세 관리'}</span>
                    <form onSubmit={boardManageData.handleSearchBoard} className="admin-boardpost-search-form">
                        <span className="admin-search-label">게시판 형태</span>
                        <select 
                            className="admin-input-small" 
                            value={boardManageData.searchForm.searchBrdType} 
                            onChange={e => boardManageData.setSearchForm({...boardManageData.searchForm, searchBrdType: e.target.value})}
                        >
                            <option value="">전체</option>
                            {boardManageData.boardTypeList.map(t => <option key={t.comCd} value={t.comCd}>{t.cdNm}</option>)}
                        </select>

                        <div className="admin-search-divider"></div>

                        <span className="admin-search-label">사용 상태</span>
                        <select 
                            className="admin-input-small" 
                            value={boardManageData.searchForm.searchUseYn} 
                            onChange={e => boardManageData.setSearchForm({...boardManageData.searchForm, searchUseYn: e.target.value})}
                        >
                            <option value="">전체</option>
                            <option value="Y">정상</option>
                            <option value="N">중지</option>
                        </select>

                        <div className="admin-search-divider"></div>

                        <span className="admin-search-label">삭제 여부</span>
                        <select 
                            className="admin-input-small" 
                            value={boardManageData.searchForm.searchDelYn} 
                            onChange={e => boardManageData.setSearchForm({...boardManageData.searchForm, searchDelYn: e.target.value})}
                        >
                            <option value="">전체</option>
                            <option value="N">정상 보존</option>
                            <option value="Y">삭제됨</option>
                        </select>

                        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={boardManageData.handleResetSearchBoard} className="admin-btn admin-btn-secondary">초기화</button>
                    </form>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {/* 상단: 게시판 목록 */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
                    <BoardMasterList 
                        boardList={boardManageData.boardList}
                        boardTypeList={boardManageData.boardTypeList}
                        boardCurrentPage={boardManageData.boardCurrentPage}
                        setBoardCurrentPage={boardManageData.setBoardCurrentPage}
                        boardTotalPages={boardManageData.boardTotalPages}
                        boardTotalCount={boardManageData.boardTotalCount}
                        selectedBoard={boardManageData.selectedBoard}
                        selectBoard={boardManageData.selectBoard}
                    />
                </div>

                {/* 하단: 선택된 게시판의 게시물 목록 */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
                    <BoardPostList 
                        selectedBoard={boardManageData.selectedBoard}
                        postList={boardManageData.postList}
                        postCurrentPage={boardManageData.postCurrentPage}
                        setPostCurrentPage={boardManageData.setPostCurrentPage}
                        postTotalPages={boardManageData.postTotalPages}
                        postTotalCount={boardManageData.postTotalCount}
                        postsPerPage={boardManageData.postsPerPage}
                        setPostsPerPage={boardManageData.setPostsPerPage}
                        selectedPostIds={boardManageData.selectedPostIds}
                        setSelectedPostIds={boardManageData.setSelectedPostIds}
                        openModal={boardManageData.openModal}
                        handleBulkDeletePost={boardManageData.handleBulkDeletePost}
                        handleBulkRestorePost={boardManageData.handleBulkRestorePost}
                        menuAuth={menuAuth}
                    />
                </div>
            </div>

            {/* Modal for Post Detail/Edit */}
            <BoardPostModal 
                sysId={defaultSysId}
                selectedBoard={boardManageData.selectedBoard}
                boardTypeList={boardManageData.boardTypeList}
                isModalOpen={boardManageData.isModalOpen}
                closeModal={boardManageData.closeModal}
                postForm={boardManageData.postForm}
                setPostForm={boardManageData.setPostForm}
                uploadFiles={boardManageData.uploadFiles}
                setUploadFiles={boardManageData.setUploadFiles}
                existingFiles={boardManageData.existingFiles}
                handleSavePost={boardManageData.handleSavePost}
                handleLogicalDeletePost={boardManageData.handleLogicalDeletePost}
                handleRestorePost={boardManageData.handleRestorePost}
                handleFileDelete={boardManageData.handleFileDelete}
                handleFileDownload={boardManageData.handleFileDownload}
                menuAuth={menuAuth}
            />
        </div>
    );
};

export default BoardPostManage;
