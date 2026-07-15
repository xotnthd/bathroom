import React, { useState, useEffect } from 'react';

/*
 * 작업 경로: frontend/src/user/pages/UserMain.js
 * 설명: 일반 사용자용 메인 화면 페이지 컴포넌트
 */
const UserMain = () => {
    // 백엔드에서 받아온 데이터를 저장할 상태값
    const [data, setData] = useState(null);

    // 컴포넌트가 마운트될 때 백엔드 API 호출
    useEffect(() => {
        fetch('/api/user/main')
            .then((response) => response.json())
            .then((resData) => setData(resData))
            .catch((error) => console.error('User API 호출 에러:', error));
    }, []);

    return (
        <div style={{ border: '2px solid #007bff', padding: '20px', borderRadius: '5px' }}>
            <h2 style={{ color: '#007bff' }}>일반 사용자 메인 영역</h2>
            {data ? (
                <div>
                    <p><strong>서버 응답 메시지:</strong> {data.message}</p>
                    <p><strong>부여된 권한 식별자:</strong> {data.role}</p>
                </div>
            ) : (
                <p>백엔드에서 사용자 데이터를 불러오는 중입니다...</p>
            )}
        </div>
    );
};

export default UserMain;