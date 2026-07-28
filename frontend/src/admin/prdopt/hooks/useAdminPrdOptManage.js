import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAdminPrdOptManage = (sysId) => {
    const [groupList, setGroupList] = useState([]);
    const [valueList, setValueList] = useState([]);
    const [selGroupIdx, setSelGroupIdx] = useState(null);

    const fetchGroupList = useCallback(async () => {
        const res = await apiClient(`/admin/api/prdopt/group/list?sysId=${sysId}`);
        if (res.ok) setGroupList(await res.json());
    }, [sysId]);

    const fetchValueList = useCallback(async (optGrpIdx) => {
        const res = await apiClient(`/admin/api/prdopt/value/list?optGrpIdx=${optGrpIdx}`);
        if (res.ok) setValueList(await res.json());
    }, []);

    const reportError = async (res) => {
        const msg = await res.text();
        alert('오류: ' + msg);
    };

    const saveGroup = useCallback(async (form) => {
        const res = await apiClient('/admin/api/prdopt/group/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, sysId })
        });
        if (res.ok) { alert('저장되었습니다.'); fetchGroupList(); return true; }
        await reportError(res);
        return false;
    }, [sysId, fetchGroupList]);

    const deleteGroup = useCallback(async (idx) => {
        if (!window.confirm('옵션 그룹을 삭제하시겠습니까?')) return;
        const res = await apiClient(`/admin/api/prdopt/group/delete/${sysId}/${idx}`, { method: 'DELETE' });
        if (res.ok) {
            fetchGroupList();
            if (selGroupIdx === idx) { setValueList([]); setSelGroupIdx(null); }
        } else {
            await reportError(res);
        }
    }, [sysId, fetchGroupList, selGroupIdx]);

    const saveValue = useCallback(async (form) => {
        const res = await apiClient('/admin/api/prdopt/value/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) { alert('저장되었습니다.'); fetchValueList(form.optGrpIdx); return true; }
        await reportError(res);
        return false;
    }, [fetchValueList]);

    const deleteValue = useCallback(async (idx, optGrpIdx) => {
        if (!window.confirm('옵션 값을 삭제하시겠습니까? 이미 SKU에 쓰이고 있으면 삭제되지 않습니다.')) return;
        const res = await apiClient(`/admin/api/prdopt/value/delete/${idx}`, { method: 'DELETE' });
        if (res.ok) {
            fetchValueList(optGrpIdx);
        } else {
            await reportError(res);
        }
    }, [fetchValueList]);

    return {
        groupList, valueList, selGroupIdx, setSelGroupIdx,
        fetchGroupList, fetchValueList, saveGroup, deleteGroup, saveValue, deleteValue
    };
};
