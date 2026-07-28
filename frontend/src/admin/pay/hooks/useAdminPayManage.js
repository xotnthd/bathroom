import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAdminPayManage = () => {
    const [payList, setPayList] = useState([]);
    const [tplList, setTplList] = useState([]);

    const fetchPayList = useCallback(async () => {
        const res = await apiClient('/admin/api/pay/list', { method: 'POST' });
        if (res.ok) setPayList(await res.json());
    }, []);

    const fetchTplList = useCallback(async () => {
        const res = await apiClient('/admin/api/auth-template/tpl/list', { method: 'POST' });
        if (res.ok) setTplList(await res.json());
    }, []);

    const fetchPayInfo = useCallback(async (payPlanCd) => {
        const res = await apiClient(`/admin/api/pay/detail/${payPlanCd}`);
        if (res.ok) return await res.json();
        return null;
    }, []);

    const reportError = async (res) => {
        const msg = await res.text();
        alert('오류: ' + msg);
    };

    const savePay = useCallback(async (form) => {
        const res = await apiClient('/admin/api/pay/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            alert('저장되었습니다.');
            fetchPayList();
            return true;
        }
        await reportError(res);
        return false;
    }, [fetchPayList]);

    const deletePay = useCallback(async (payPlanCd) => {
        if (!window.confirm('요금제를 삭제하시겠습니까?')) return;
        const res = await apiClient(`/admin/api/pay/delete/${payPlanCd}`, { method: 'DELETE' });
        if (res.ok) {
            fetchPayList();
        } else {
            await reportError(res);
        }
    }, [fetchPayList]);

    return { payList, tplList, fetchPayList, fetchTplList, fetchPayInfo, savePay, deletePay };
};
