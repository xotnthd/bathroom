import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useBoardManage = (defaultSysId, inqireYn) => {
    const [managingList, setManagingList] = useState([]);
    const [boardTypeList, setBoardTypeList] = useState([]);

    const [searchParams, setSearchParams] = useState({
        brdType: '',
        brdNm: ''
    });

    const fnFetchCommonCodes = async (grpCd, uprComCd, targetType) => {
        try {
            const res = await apiClient('/admin/api/board/common/code', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sysId: defaultSysId, grpCd, uprComCd })
            });
            if (res.ok) {
                const data = await res.json();
                if (targetType === 'TYPE') {
                    setBoardTypeList(data);
                }
            }
        } catch (err) {
            console.error("공통코드 추출 오류", err);
        }
    };

    const fnFetchManagingList = async (params) => {
        try {
            const res = await apiClient('/admin/api/board/managing/list', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    sysId: defaultSysId, 
                    searchBrdType: params.brdType,
                    searchBrdNm: params.brdNm
                })
            });
            if (res.ok) setManagingList(await res.json());
        } catch (err) {
            console.error("목록 조회 오류", err);
        }
    };

    useEffect(() => {
        if (inqireYn === 'Y') {
            fnFetchManagingList(searchParams);
            fnFetchCommonCodes('BOARD_SE_CD', 'ROOT', 'TYPE');
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    const fetchBoardDetail = async (brdId) => {
        const res = await apiClient(`/admin/api/board/managing/detail/${defaultSysId}/${brdId}`);
        if (res.ok) return await res.json();
        return null;
    };

    const handleSearch = () => {
        fnFetchManagingList(searchParams);
    };

    const handleResetSearch = () => {
        const resetParams = { brdType: '', brdNm: '' };
        setSearchParams(resetParams);
        fnFetchManagingList(resetParams);
    };

    const saveBoard = async (formData) => {
        try {
            const res = await apiClient('/admin/api/board/managing/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("게시판 정보가 성공적으로 반영되었습니다.");
                fnFetchManagingList(searchParams);
                return true;
            }
        } catch (err) {
            alert("게시판 정보 저장 오류");
            return false;
        }
    };

    const deleteBoard = async (brdId) => {
        if (!window.confirm("게시판을 영구 삭제하시겠습니까? (하위 글 동시 삭제됨)")) return false;
        try {
            const res = await apiClient(`/admin/api/board/managing/delete/${defaultSysId}/${brdId}`, { method: 'DELETE' });
            if (res.ok) {
                alert("삭제 완료");
                fnFetchManagingList(searchParams);
                return true;
            }
        } catch (err) {
            alert("게시판 삭제 오류");
            return false;
        }
    };

    return {
        managingList,
        boardTypeList,
        searchParams,
        setSearchParams,
        handleSearch,
        handleResetSearch,
        fetchBoardDetail,
        saveBoard,
        deleteBoard
    };
};
