// 앞으로 fetch 대신 이 함수를 사용하면 모든 API에 쿠키가 자동으로 포함됩니다.
export const apiClient = async (url, options = {}) => {
    return fetch(url, {
        ...options,
        credentials: 'include' // 전역 강제 설정
    });
};
