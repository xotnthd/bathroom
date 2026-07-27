import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAdminPrdSupManage = (sysId) => {
    const [supplierList, setSupplierList] = useState([]);

    const fetchSupplierList = useCallback(async () => {
        const res = await apiClient(`/admin/api/prdsup/list?sysId=${sysId}`);
        if (res.ok) setSupplierList(await res.json());
    }, [sysId]);

    const fetchSupplierInfo = useCallback(async (idx) => {
        const res = await apiClient(`/admin/api/prdsup/detail/${sysId}/${idx}`);
        if (res.ok) return await res.json();
        return null;
    }, [sysId]);

    const reportError = async (res) => {
        const msg = await res.text();
        alert('오류: ' + msg);
    };

    const saveSupplier = useCallback(async (form) => {
        const res = await apiClient('/admin/api/prdsup/save', {
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

    const deleteSupplier = useCallback(async (idx) => {
        if (!window.confirm('매입처를 삭제하시겠습니까?')) return;
        const res = await apiClient(`/admin/api/prdsup/delete/${sysId}/${idx}`, { method: 'DELETE' });
        if (res.ok) {
            fetchSupplierList();
        } else {
            await reportError(res);
        }
    }, [sysId, fetchSupplierList]);

    return { supplierList, fetchSupplierList, fetchSupplierInfo, saveSupplier, deleteSupplier };
};
