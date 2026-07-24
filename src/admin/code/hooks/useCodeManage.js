import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useCodeManage = (defaultSysId, inqireYn) => {
    // 1. 3분할 데이터 상태 선언
    const [groupList, setGroupList] = useState([]);
    const [midList, setMidList] = useState([]);
    const [detailList, setDetailList] = useState([]);

    // 2. 선택된 항목 상태 선언
    const [selGroupCd, setSelGroupCd] = useState('');
    const [selMidCd, setSelMidCd] = useState('');

    useEffect(() => { 
        if (inqireYn === 'Y') {
            fnFetchGroupList(); 
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [inqireYn, defaultSysId]);

    const fnFetchGroupList = async () => {
        const res = await apiClient(`/admin/api/code/group/list?sysId=${defaultSysId}`);
        if (res.ok) setGroupList(await res.json());
    };

    const fnFetchMidList = async (grpCd) => {
        const res = await apiClient(`/admin/api/code/detail/list?sysId=${defaultSysId}&grpCd=${grpCd}&uprComCd=ROOT`);
        if (res.ok) setMidList(await res.json());
    };

    const fnFetchDetailList = async (grpCd, midCd) => {
        const res = await apiClient(`/admin/api/code/detail/list?sysId=${defaultSysId}&grpCd=${grpCd}&uprComCd=${midCd}`);
        if (res.ok) setDetailList(await res.json());
    };

    const handleGroupDelete = async (comCd) => {
        if (!window.confirm("그룹 삭제 시 속한 모든 하위 코드가 삭제됩니다. 진행하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/code/group/delete/${defaultSysId}/${comCd}`, { method: 'DELETE' });
        if (res.ok) { fnFetchGroupList(); setMidList([]); setDetailList([]); setSelGroupCd(''); setSelMidCd(''); }
    };

    const handleDetailDelete = async (targetType, uprComCd, comCd) => {
        if (!window.confirm("해당 코드를 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/code/detail/delete/${defaultSysId}/${selGroupCd}/${uprComCd}/${comCd}`, { method: 'DELETE' });
        if (res.ok) {
            if (targetType === 'MID') { fnFetchMidList(selGroupCd); setDetailList([]); setSelMidCd(''); }
            else { fnFetchDetailList(selGroupCd, selMidCd); }
        }
    };

    const saveCode = async (targetType, bodyData) => {
        const isGroup = targetType === 'GROUP';
        const url = isGroup ? '/admin/api/code/group/save' : '/admin/api/code/detail/save';

        const res = await apiClient(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        if (res.ok) {
            alert("정보 저장 처리가 완료되었습니다.");
            if (targetType === 'GROUP') fnFetchGroupList();
            else if (targetType === 'MID') fnFetchMidList(selGroupCd);
            else fnFetchDetailList(selGroupCd, selMidCd);
            return true;
        }
        return false;
    };

    return {
        groupList, midList, detailList,
        selGroupCd, setSelGroupCd,
        selMidCd, setSelMidCd,
        setMidList, setDetailList,
        fnFetchMidList, fnFetchDetailList,
        handleGroupDelete, handleDetailDelete, saveCode
    };
};
