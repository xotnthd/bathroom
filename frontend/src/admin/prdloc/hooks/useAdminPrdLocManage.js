import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAdminPrdLocManage = (sysId) => {
    const [locationList, setLocationList] = useState([]);

    const fetchLocationList = useCallback(async () => {
        const res = await apiClient(`/admin/api/prdloc/list?sysId=${sysId}`);
        if (res.ok) setLocationList(await res.json());
    }, [sysId]);

    const fetchLocationInfo = useCallback(async (idx) => {
        const res = await apiClient(`/admin/api/prdloc/detail/${sysId}/${idx}`);
        if (res.ok) return await res.json();
        return null;
    }, [sysId]);

    const reportError = async (res) => {
        const msg = await res.text();
        alert('오류: ' + msg);
    };

    const saveLocation = useCallback(async (form) => {
        const res = await apiClient('/admin/api/prdloc/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, sysId })
        });
        if (res.ok) {
            const saved = await res.json();
            alert('저장되었습니다.');
            return saved;
        }
        await reportError(res);
        return null;
    }, [sysId]);

    const deleteLocation = useCallback(async (idx) => {
        if (!window.confirm('지점을 삭제하시겠습니까? 해당 지점의 재고 이력은 남아있지만 더 이상 재고를 등록할 수 없게 됩니다.')) return;
        const res = await apiClient(`/admin/api/prdloc/delete/${sysId}/${idx}`, { method: 'DELETE' });
        if (res.ok) {
            fetchLocationList();
        } else {
            await reportError(res);
        }
    }, [sysId, fetchLocationList]);

    return { locationList, fetchLocationList, fetchLocationInfo, saveLocation, deleteLocation };
};
