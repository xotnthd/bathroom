import { useState } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useVoteManage = (defaultSysId) => {
    const [voteList, setVoteList] = useState([]);
    const [roleList, setRoleList] = useState([]);

    const fetchVoteList = async (searchKeyword = '') => {
        const res = await apiClient('/admin/api/vote/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchKeyword })
        });
        if (res.ok) setVoteList(await res.json());
    };

    // 결과관리(투표 결과 관리) 화면 전용 - 투표 관리 메뉴 권한과 별개로 검사됨
    const fetchVoteListForResult = async (searchKeyword = '') => {
        const res = await apiClient('/admin/api/vote/result/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchKeyword })
        });
        if (res.ok) setVoteList(await res.json());
    };

    const fetchVoteDetail = async (voteIdx) => {
        const res = await apiClient(`/admin/api/vote/detail/${defaultSysId}/${voteIdx}`);
        if (res.ok) return await res.json();
        return null;
    };

    const fetchVoteDetailForResult = async (voteIdx) => {
        const res = await apiClient(`/admin/api/vote/result/detail/${defaultSysId}/${voteIdx}`);
        if (res.ok) return await res.json();
        return null;
    };

    const saveVote = async (payload) => {
        const res = await apiClient('/admin/api/vote/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
        alert(await res.text() || '저장에 실패했습니다.');
        return null;
    };

    const deleteVote = async (voteIdx) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return false;
        const res = await apiClient(`/admin/api/vote/delete/${defaultSysId}/${voteIdx}`, { method: 'DELETE' });
        return res.ok;
    };

    const fetchEligibility = async (voteIdx) => {
        const res = await apiClient(`/admin/api/vote/eligibility/${defaultSysId}/${voteIdx}`);
        if (res.ok) return await res.json();
        return null;
    };

    const castVote = async (voteIdx, optIdx) => {
        const res = await apiClient('/admin/api/vote/cast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, voteIdx: Number(voteIdx), optIdx: Number(optIdx) })
        });
        if (res.ok) return true;
        alert(await res.text() || '투표 제출에 실패했습니다.');
        return false;
    };

    const fetchResult = async (voteIdx) => {
        const res = await apiClient(`/admin/api/vote/result/${defaultSysId}/${voteIdx}`);
        if (res.ok) return await res.json();
        return null;
    };

    const drawWinner = async (voteIdx) => {
        const res = await apiClient(`/admin/api/vote/draw/${defaultSysId}/${voteIdx}`, { method: 'POST' });
        if (res.ok) return await res.json();
        alert(await res.text() || '추첨에 실패했습니다.');
        return null;
    };

    const fetchRoleList = async () => {
        const res = await apiClient(`/admin/api/auth/role/list?sysId=${defaultSysId}&sysSeCd=MG`);
        if (res.ok) setRoleList(await res.json());
    };

    return {
        voteList, roleList,
        fetchVoteList, fetchVoteListForResult, fetchVoteDetail, fetchVoteDetailForResult, saveVote, deleteVote,
        fetchEligibility, castVote, fetchResult, drawWinner,
        fetchRoleList
    };
};
