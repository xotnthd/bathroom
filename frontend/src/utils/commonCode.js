import { apiClient } from './apiClient';

export const getCommonCodes = async (grpCd, sysId = 'CORE', uprComCd) => {
    try {
        const query = uprComCd
            ? `sysId=${sysId}&grpCd=${grpCd}&uprComCd=${uprComCd}`
            : `sysId=${sysId}&grpCd=${grpCd}`;
        const res = await apiClient(`/api/comn/code/list?${query}`, {
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