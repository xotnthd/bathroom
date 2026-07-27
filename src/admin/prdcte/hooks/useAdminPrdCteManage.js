import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAdminPrdCteManage = (sysId) => {
    const [mainList, setMainList] = useState([]);
    const [midList, setMidList] = useState([]);
    const [subList, setSubList] = useState([]);
    const [selMainIdx, setSelMainIdx] = useState(null);
    const [selMidIdx, setSelMidIdx] = useState(null);

    const fetchChildren = useCallback(async (uprCteIdx) => {
        const res = await apiClient('/admin/api/prdcte/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId, uprCteIdx })
        });
        if (res.ok) return await res.json();
        return [];
    }, [sysId]);

    const fetchMainList = useCallback(async () => {
        setMainList(await fetchChildren(null));
    }, [fetchChildren]);

    const fetchMidList = useCallback(async (mainIdx) => {
        setMidList(await fetchChildren(mainIdx));
    }, [fetchChildren]);

    const fetchSubList = useCallback(async (midIdx) => {
        setSubList(await fetchChildren(midIdx));
    }, [fetchChildren]);

    const reportError = async (res) => {
        const msg = await res.text();
        alert('오류: ' + msg);
    };

    const saveCategory = useCallback(async (form) => {
        const res = await apiClient('/admin/api/prdcte/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, sysId })
        });
        if (res.ok) {
            alert('저장되었습니다.');
            if (form.uprCteIdx == null) fetchMainList();
            else if (form.uprCteIdx === selMainIdx) fetchMidList(selMainIdx);
            else fetchSubList(selMidIdx);
            return true;
        }
        await reportError(res);
        return false;
    }, [sysId, fetchMainList, fetchMidList, fetchSubList, selMainIdx, selMidIdx]);

    const deleteCategory = useCallback(async (targetType, idx) => {
        if (!window.confirm('카테고리를 삭제하시겠습니까? 하위 카테고리도 함께 삭제됩니다.')) return;
        const res = await apiClient(`/admin/api/prdcte/delete/${sysId}/${idx}`, { method: 'DELETE' });
        if (res.ok) {
            if (targetType === 'MAIN') { fetchMainList(); setMidList([]); setSubList([]); setSelMainIdx(null); setSelMidIdx(null); }
            else if (targetType === 'MID') { fetchMidList(selMainIdx); setSubList([]); setSelMidIdx(null); }
            else { fetchSubList(selMidIdx); }
        } else {
            await reportError(res);
        }
    }, [sysId, fetchMainList, fetchMidList, fetchSubList, selMainIdx, selMidIdx]);

    return {
        mainList, midList, subList, selMainIdx, setSelMainIdx, selMidIdx, setSelMidIdx,
        setMidList, setSubList,
        fetchMainList, fetchMidList, fetchSubList, saveCategory, deleteCategory
    };
};
