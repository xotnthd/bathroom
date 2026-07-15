import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';

const AdminLogin = () => {
    const [userId, setUserId] = useState('');
    const [pswd, setPswd] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await apiClient('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loginId: userId, loginPw: pswd }),
                // credentials: 'include'삭제apiClient등매트릭스 등으삭제보기삭제빼셔확인니삭제
            });

            if (response.ok) {
                const data = await response.json();
                console.log("로그인 성공:", data);
                // 받아온 정보(sysId 등)를 sessionStorage에 저장
                if (data.sysId) {
                    sessionStorage.setItem('currentSysId', data.sysId);
                }
                navigate('/admin/dashboard'); // 로그인 성공 시 메인 레이아웃 화면으로 이동동
            } else {
                alert("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error("로그인에러:", error);
            alert("서버 통신 중 문제가 발생했습니다.");
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#ececec' }}>
            <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <h2>관리자 로그인</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                    <input
                        type="text"
                        placeholder="등�이삭제(admin)"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="비�등번호 (admin123)"
                        value={pswd}
                        onChange={(e) => setPswd(e.target.value)}
                        required
                    />
                    <button type="submit" style={{ padding: '0.5rem', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
