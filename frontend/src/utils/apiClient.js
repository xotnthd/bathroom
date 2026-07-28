// 앞으로 fetch 대신 이 함수를 사용하면 모든 API에 쿠키가 자동으로 포함됩니다.
let isRedirectingToLogin = false;

export const apiClient = async (url, options = {}) => {
    const res = await fetch(url, {
        ...options,
        credentials: 'include' // 전역 강제 설정
    });

    // 세션 만료/미인증(401) 시 화면과 무관하게 관리자 로그인 페이지로 강제 이동
    if (res.status === 401 && !isRedirectingToLogin) {
        const path = window.location.pathname;
        if (path.startsWith('/admin') && path !== '/admin/login') {
            isRedirectingToLogin = true;
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/admin/login';
        }
    }

    return res;
};
