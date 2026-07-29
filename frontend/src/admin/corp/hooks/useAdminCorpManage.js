import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAdminCorpManage = () => {
    const [corpList, setCorpList] = useState([]);

    const fetchCorpList = useCallback(async (corpNm = '') => {
        const res = await apiClient('/admin/api/corp/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ corpNm })
        });
        if (res.ok) setCorpList(await res.json());
    }, []);

    const fetchCorpDetail = useCallback(async (idx) => {
        const res = await apiClient(`/admin/api/corp/detail/${idx}`);
        if (res.ok) return await res.json();
        return null;
    }, []);

    const reportError = async (res) => {
        const msg = await res.text();
        alert('오류: ' + msg);
    };

    const saveCorp = useCallback(async (form) => {
        const res = await apiClient('/admin/api/corp/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            alert('저장되었습니다.');
            return true;
        }
        await reportError(res);
        return false;
    }, []);

    const deleteCorp = useCallback(async (idx) => {
        if (!window.confirm('업체 정보를 삭제하시겠습니까?')) return;
        const res = await apiClient(`/admin/api/corp/delete/${idx}`, { method: 'DELETE' });
        if (res.ok) {
            fetchCorpList();
        } else {
            await reportError(res);
        }
    }, [fetchCorpList]);

    return { corpList, fetchCorpList, fetchCorpDetail, saveCorp, deleteCorp };
};
