import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useBoardPostManage = (defaultSysId, inqireYn, rgstYn, mdfcnYn, delYn) => {
    // Board Master States
    const [boardList, setBoardList] = useState([]);
    const [boardTypeList, setBoardTypeList] = useState([]);
    const [searchForm, setSearchForm] = useState({ searchBrdType: '', searchUseYn: '', searchDelYn: '' });
    
    // Board Master Pagination
    const [boardCurrentPage, setBoardCurrentPage] = useState(1);
    const boardsPerPage = 10;

    // Post States
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [postList, setPostList] = useState([]);
    const [selectedPostIds, setSelectedPostIds] = useState([]);
    
    // Post Pagination
    const [postCurrentPage, setPostCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(20);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postForm, setPostForm] = useState({ 
        idx: '', title: '', content: '', atchFileGrpId: '', 
        ntcYn: 'N', highlightYn: 'N', rlsStartDt: '', rlsEndDt: '' 
    });
    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchCodes('BOARD_SE_CD', 'ROOT', 'TYPE');
            fetchBoardMasterGrid(searchForm);
        }
    }, [inqireYn]);

    const fetchCodes = async (grpCd, uprComCd, type) => {
        const res = await apiClient('/admin/api/board/common/code', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, grpCd, uprComCd })
        });
        if (res.ok) {
            const data = await res.json();
            if (type === 'TYPE') setBoardTypeList(data);
        }
    };

    const fetchBoardMasterGrid = async (searchData) => {
        const res = await apiClient('/admin/api/board/managing/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, ...searchData })
        });
        if (res.ok) {
            setBoardList(await res.json());
            setBoardCurrentPage(1); // Reset to first page
        }
    };

    const handleSearchBoard = (e) => {
        if (e) e.preventDefault();
        fetchBoardMasterGrid(searchForm);
    };

    const handleResetSearchBoard = () => {
        const resetForm = { searchBrdType: '', searchUseYn: '', searchDelYn: '' };
        setSearchForm(resetForm);
        fetchBoardMasterGrid(resetForm);
    };

    const selectBoard = async (board) => {
        if (inqireYn !== 'Y') return;
        setSelectedBoard(board);
        setSelectedPostIds([]);
        setPostCurrentPage(1); // Reset to first page

        const res = await apiClient('/admin/api/board/post/monitor', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, brdId: board.brdId })
        });
        if (res.ok) {
            setPostList(await res.json());
        }
    };

    const fetchExistingFiles = async (grpId) => {
        const res = await apiClient(`/admin/api/comn/file/list/${grpId}?sysId=${defaultSysId}`);
        if (res.ok) setExistingFiles(await res.json());
    };

    const openModal = async (post = null) => {
        if (!selectedBoard) return alert("게시판을 먼저 선택해주세요.");
        setUploadFiles([]);
        setExistingFiles([]);

        if (post) {
            setPostForm(post);
            if (post.atchFileGrpId) {
                await fetchExistingFiles(post.atchFileGrpId);
            }
        } else {
            setPostForm({ 
                idx: '', title: '', content: '', atchFileGrpId: '', 
                ntcYn: 'N', highlightYn: 'N', rlsStartDt: '', rlsEndDt: '' 
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSavePost = async (e) => {
        e.preventDefault();
        const isEdit = postForm.idx !== '';
        
        if (isEdit ? (mdfcnYn !== 'Y') : (rgstYn !== 'Y')) {
            alert("처리 권한이 없습니다.");
            return;
        }

        const formData = new FormData();
        formData.append('sysId', defaultSysId);
        formData.append('brdId', selectedBoard.brdId);
        Object.keys(postForm).forEach(key => {
            formData.append(key, postForm[key] !== null && postForm[key] !== undefined ? postForm[key] : '');
        });

        uploadFiles.forEach(file => { formData.append('files', file); });

        const res = await apiClient('/admin/api/board/post/save', { method: 'POST', body: formData });
        if (res.ok) {
            alert("게시물 저장이 정상적으로 완료되었습니다.");
            closeModal();
            if (selectedBoard) selectBoard(selectedBoard); // refresh
        }
    };

    const handleLogicalDeletePost = async (e, idx) => {
        if (e) e.stopPropagation();
        if (delYn !== 'Y') return alert('권한이 없습니다.');
        if (!window.confirm("게시글을 차단(논리삭제) 하시겠습니까?")) return;

        const res = await apiClient(`/admin/api/board/post/kick/${idx}`, { method: 'DELETE' });
        if (res.ok) {
            alert("블라인드 처리 완료");
            if (selectedBoard) selectBoard(selectedBoard);
        }
    };

    const handleRestorePost = async (e, idx) => {
        if (e) e.stopPropagation();
        if (delYn !== 'Y') return alert('권한이 없습니다.');
        if (!window.confirm("게시글 차단을 해제하고 다시 노출하시겠습니까?")) return;

        const res = await apiClient(`/admin/api/board/post/restore/${idx}`, { method: 'POST' });
        if (res.ok) {
            alert("차단 해제 완료");
            if (selectedBoard) selectBoard(selectedBoard);
        }
    };

    const handleBulkDeletePost = async () => {
        if (delYn !== 'Y') return alert('권한이 없습니다.');
        if (selectedPostIds.length === 0) return alert("선택된 게시글이 없습니다.");
        if (!window.confirm(`선택된 ${selectedPostIds.length}개의 게시글을 일괄 차단(블라인드) 하시겠습니까?`)) return;

        const res = await apiClient(`/admin/api/board/post/kick/bulk`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedPostIds)
        });
        if (res.ok) {
            alert("일괄 차단 완료");
            setSelectedPostIds([]);
            if (selectedBoard) selectBoard(selectedBoard);
        }
    };

    const handleBulkRestorePost = async () => {
        if (delYn !== 'Y') return alert('권한이 없습니다.');
        if (selectedPostIds.length === 0) return alert("선택된 게시글이 없습니다.");
        if (!window.confirm(`선택된 ${selectedPostIds.length}개의 게시글을 일괄 차단 해제(노출) 하시겠습니까?`)) return;

        const res = await apiClient(`/admin/api/board/post/restore/bulk`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedPostIds)
        });
        if (res.ok) {
            alert("일괄 해제 완료");
            setSelectedPostIds([]);
            if (selectedBoard) selectBoard(selectedBoard);
        }
    };

    const handleFileDelete = async (fileSn) => {
        if (!window.confirm("파일을 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/comn/file/delete/${fileSn}`, { method: 'DELETE' });
        if (res.ok) {
            if (postForm.atchFileGrpId) {
                await fetchExistingFiles(postForm.atchFileGrpId);
            }
        }
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

    // Computed Pagination Data
    const boardTotalPages = Math.ceil(boardList.length / boardsPerPage) || 1;
    const currentBoardList = boardList.slice((boardCurrentPage - 1) * boardsPerPage, boardCurrentPage * boardsPerPage);

    const postTotalPages = Math.ceil(postList.length / postsPerPage) || 1;
    const currentPostList = postList.slice((postCurrentPage - 1) * postsPerPage, postCurrentPage * postsPerPage);

    return {
        boardTypeList,
        searchForm, setSearchForm,
        handleSearchBoard, handleResetSearchBoard,
        
        boardList: currentBoardList,
        boardTotalCount: boardList.length,
        boardCurrentPage, setBoardCurrentPage, boardTotalPages,
        
        selectedBoard, selectBoard,
        
        postList: currentPostList,
        postTotalCount: postList.length,
        postCurrentPage, setPostCurrentPage, postTotalPages,
        postsPerPage, setPostsPerPage,
        
        selectedPostIds, setSelectedPostIds,
        
        isModalOpen, openModal, closeModal,
        postForm, setPostForm,
        uploadFiles, setUploadFiles,
        existingFiles,
        
        handleSavePost, handleLogicalDeletePost, handleRestorePost,
        handleBulkDeletePost, handleBulkRestorePost,
        handleFileDelete, handleFileDownload
    };
};
