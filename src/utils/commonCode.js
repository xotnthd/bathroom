import { apiClient } from './apiClient';

export const getCommonCodes = async (grpCd, sysId = 'CORE') => {
    try {
        const res = await apiClient(`/api/comn/code/list?sysId=${sysId}&grpCd=${grpCd}`, {
            method: 'GET'
        });

        if (res.ok) {
            return await res.json();
        }
        return [];
    } catch (error) {
        console.error(`공통코드(${grpCd}) 유틸리티 호출 에러:`, error);
        return [];
    }
};