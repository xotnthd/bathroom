import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import CommonCodePicker from '../../components/CommonCodePicker';
import { useMenuAuth } from '../hooks/useMenuAuth';

const UserManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    const [roleList, setRoleList] = useState([]);      
    const [userList, setUserList] = useState([]);      
    const [selectedRoleCd, setSelectedRoleCd] = useState(''); 
    const [selectedUserId, setSelectedUserId] = useState('');
    const [sysSectCd, setSysSectCd] = useState('MG'); 

    const [searchForm, setSearchForm] = useState({ searchUserId: '', searchUserNm: '', searchUserStatCd: '' });

    const [userForm, setUserForm] = useState({
        sysId: defaultSysId, userId: '', pswd: '', userNm: '', athrtyCd: '', userStatCd: 'ACTV',
        email: '', mblTelno: '', zipCd: '', baseAddr: '', dtlAddr: ''
    });

    useEffect(() => {
        if (inqireYn === 'Y') {
            fnFetchRoleList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [inqireYn, sysSectCd]);

    const fnFetchRoleList = async () => {
        try {
            const res = await apiClient(`/admin/api/auth/role/list?sysId=${defaultSysId}&sysSeCd=${sysSectCd}`);
            if (res.ok) {
                const roles = await res.json();
                setRoleList(roles);
                if (roles.length > 0) {
                    handleRoleClick(roles[0].athrtyComCd);
                } else {
                    setSelectedRoleCd('');
                    setUserList([]);
                }
            }
        } catch (err) { console.error("권한 목록 조회 실패", err); }
    };

    const handleRoleClick = (roleCd) => {
        setSelectedRoleCd(roleCd);
        fnFetchUserList(roleCd, searchForm);
        setUserForm(prev => ({ ...prev, athrtyCd: roleCd })); 
    };

    const fnFetchUserList = async (roleCd, searchData) => {
        try {
            const queryParams = new URLSearchParams({
                sysId: defaultSysId,
                athrtyCd: roleCd, 
                searchUserId: searchData.searchUserId,
                searchUserNm: searchData.searchUserNm,
                searchUserStatCd: searchData.searchUserStatCd
            }).toString();

            const res = await apiClient(`/admin/api/user/search?${queryParams}`);
            if (res.ok) setUserList(await res.json());
        } catch (err) { console.error("회원 리스트 검색 실패", err); }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fnFetchUserList(selectedRoleCd, searchForm);
    };

    const handleSearchReset = () => {
        const resetSearch = { searchUserId: '', searchUserNm: '', searchUserStatCd: '' };
        setSearchForm(resetSearch);
        fnFetchUserList(selectedRoleCd, resetSearch);
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm({ ...userForm, [name]: value });
    };

    const handleUserSave = async (e) => {
        e.preventDefault();
        try {
            const res = await apiClient('/admin/api/user/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userForm)
            });
            if (res.ok) {
                alert("사용자 계정 정보가 정상 처리되었습니다.");
                fnFetchUserList(selectedRoleCd, searchForm);
                fnFormReset();
            }
        } catch (err) { alert("계정 정보 저장 실패"); }
    };

    const handleUserDelete = async (userId) => {
        if (delYn !== 'Y') {
            alert('삭제 권한이 없습니다.');
            return;
        }
        if (!window.confirm(`계정 [ ${userId} ] 정보를 완전 영구 삭제 처리하시겠습니까?`)) return;
        try {
            const res = await apiClient(`/admin/api/user/delete/${defaultSysId}/${userId}`, { method: 'DELETE' });
            if (res.ok) {
                alert("삭제 완료되었습니다.");
                fnFetchUserList(selectedRoleCd, searchForm);
                fnFormReset();
            }
        } catch (err) { alert("계정 제거 통신 실패"); }
    };

    const fnFormReset = () => {
        setUserForm({
            sysId: defaultSysId, userId: '', pswd: '', userNm: '', athrtyCd: selectedRoleCd || '', userStatCd: 'ACTV',
            email: '', mblTelno: '', zipCd: '', baseAddr: '', dtlAddr: ''
        });
        setSelectedUserId('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <h2 style={{ marginBottom: '15px' }}>시스템 회원관리 (현재 관리 중인 시스템: {defaultSysId})</h2>
            <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>

            <div style={{ width: '250px', background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>권한 등급 관리</h4>
                
                <div style={{ marginBottom: '1rem', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#7f8c8d', marginBottom: '8px' }}>[시스템 구분 필터]</div>
                    <CommonCodePicker 
                        grpCd="SYS_SE_CD" 
                        type="radio" 
                        name="sysSectFilter" 
                        value={sysSectCd}  
                        onChange={(e) => setSysSectCd(e.target.value)} 
                    />
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flex: 1 }}>
                    {roleList.map(role => (
                        <li key={role.athrtyComCd}
                            onClick={() => handleRoleClick(role.athrtyComCd)}
                            style={{
                                padding: '12px 15px',
                                marginBottom: '0.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                background: selectedRoleCd === role.athrtyComCd ? '#3498db' : '#f8f9fa',
                                color: selectedRoleCd === role.athrtyComCd ? '#fff' : '#333',
                                transition: 'all 0.2s'
                            }}>
                            🛡️ {role.athrtyNm}
                            <span style={{ fontSize: '11px', display: 'block', fontWeight: 'normal', opacity: 0.8 }}>({role.athrtyComCd})</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="아이디" value={searchForm.searchUserId} onChange={e => setSearchForm({...searchForm, searchUserId: e.target.value})} style={{ padding: '6px', width: '130px' }} />
                        <select value={searchForm.searchUserStatCd} onChange={e => setSearchForm({...searchForm, searchUserStatCd: e.target.value})} style={{ padding: '6px' }}>
                            <option value="">전체 상태</option>
                            <option value="ACTV">정상 활성</option>
                            <option value="SUSP">정지/휴면</option>
                        </select>
                        <button type="submit" style={{ padding: '6px 14px', background: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>검색</button>
                        <button type="button" onClick={handleSearchReset} style={{ padding: '6px 14px', background: '#eee', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}>초기화</button>
                    </form>
                </div>

                <div style={{ flex: 1, background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', overflowY: 'auto' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>해당 권한 소속 인원 명단 현황 {selectedRoleCd && <span style={{ color: '#3498db' }}>[{selectedRoleCd}]</span>}</h4>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                        <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>연락처</th>
                            <th>상태</th>
                            {delYn === 'Y' && <th>제거</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {userList.map(u => (
                            <tr key={u.userId} onClick={() => { setSelectedUserId(u.userId); setUserForm({ ...u, pswd: '' }); }}
                                style={{ cursor: 'pointer', background: selectedUserId === u.userId ? '#e3f2fd' : 'none' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{u.userId}</td>
                                <td style={{ padding: '8px' }}>{u.userNm}</td>
                                <td style={{ padding: '8px' }}>{u.mblTelno || '미등록'}</td>
                                <td style={{ padding: '8px' }}>{u.userStatCd === 'ACTV' ? '정상 활성' : '정지/휴면'}</td>
                                {delYn === 'Y' && (
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <button onClick={(e) => { e.stopPropagation(); handleUserDelete(u.userId); }}>제거</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {userList.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>조건에 일치하는 소속 인원이 없습니다.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ width: '400px', background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', overflowY: 'auto' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>선택된 계정 상세 설정</h4>
                <form onSubmit={handleUserSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

                    <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>[계정 기본 설정]</span>
                    <input type="text" name="userId" placeholder="아이디" value={userForm.userId} onChange={handleFormInputChange} required disabled={selectedUserId !== ''} />
                    <input type="password" name="pswd" placeholder={selectedUserId ? "변경시에만 입력 (기존유지)" : "비밀번호 입력"} value={userForm.pswd} onChange={handleFormInputChange} required={selectedUserId === ''} />
                    <input type="text" name="userNm" placeholder="이름" value={userForm.userNm} onChange={handleFormInputChange} required />

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select name="athrtyCd" value={userForm.athrtyCd} onChange={handleFormInputChange} style={{ flex: 1, padding: '6px' }}>
                            {roleList.map(role => (
                                <option key={role.athrtyComCd} value={role.athrtyComCd}>{role.athrtyNm}</option>
                            ))}
                        </select>
                        <select name="userStatCd" value={userForm.userStatCd} onChange={handleFormInputChange} style={{ width: '100px', padding: '6px' }}>
                            <option value="ACTV">정상 활성</option>
                            <option value="SUSP">정지/휴면</option>
                        </select>
                    </div>

                    <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold', marginTop: '10px' }}>[인적 정보 상세 설정]</span>
                    <input type="email" name="email" placeholder="이메일 주소" value={userForm.email || ''} onChange={handleFormInputChange} />
                    <input type="text" name="mblTelno" placeholder="휴대전화 번호" value={userForm.mblTelno || ''} onChange={handleFormInputChange} />
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <input type="text" name="zipCd" placeholder="우편번호" value={userForm.zipCd || ''} onChange={handleFormInputChange} style={{ width: '90px' }} />
                        <input type="text" name="baseAddr" placeholder="기본 주소" value={userForm.baseAddr || ''} onChange={handleFormInputChange} style={{ flex: 1 }} />
                    </div>
                    <input type="text" name="dtlAddr" placeholder="상세 주소" value={userForm.dtlAddr || ''} onChange={handleFormInputChange} />

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        {((selectedUserId === '' && rgstYn === 'Y') || (selectedUserId !== '' && mdfcnYn === 'Y')) && (
                            <button type="submit" style={{ flex: 1, padding: '10px', background: '#3498db', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>회원 정보 저장</button>
                        )}
                        <button type="button" onClick={fnFormReset} style={{ padding: '10px' }}>초기화</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default UserManage;
