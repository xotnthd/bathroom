import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonCodePicker from '../../components/CommonCodePicker';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useUserManage } from './hooks/useUserManage';

const UserManage = () => {
    const navigate = useNavigate();
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, delYn } = useMenuAuth();
    const [sysSectCd, setSysSectCd] = useState('MG');

    const {
        roleList, userList, selectedRoleCd, searchForm,
        handleRoleClick, handleSearchChange, handleSearchSubmit, handleSearchReset,
        deleteUser
    } = useUserManage(defaultSysId, sysSectCd, inqireYn);

    const handleUserDelete = async (e, userId) => {
        e.stopPropagation();
        if (delYn !== 'Y') { alert('삭제 권한이 없습니다.'); return; }
        if (!window.confirm(`계정 [ ${userId} ] 정보를 완전 영구 삭제 처리하시겠습니까?`)) return;
        await deleteUser(userId);
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다. 관리자에게 문의하세요.</div>;
    }

    const roleLabel = (athrtyCd) => {
        const role = roleList.find(r => r.athrtyComCd === athrtyCd);
        return role ? role.athrtyNm : athrtyCd;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            {/* 상단 검색 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span className="admin-card-title">회원 관리</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>시스템 구분:</span>
                            <CommonCodePicker grpCd="SYS_SE_CD" type="radio" name="sysSectFilter" value={sysSectCd} onChange={(e) => setSysSectCd(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>소속 권한:</span>
                        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto' }}>
                            {roleList.map(role => (
                                <button
                                    key={role.athrtyComCd}
                                    type="button"
                                    onClick={() => handleRoleClick(role.athrtyComCd)}
                                    style={{
                                        padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-color)',
                                        background: selectedRoleCd === role.athrtyComCd ? '#3498db' : 'transparent',
                                        color: selectedRoleCd === role.athrtyComCd ? '#fff' : 'var(--text-primary)',
                                        cursor: 'pointer', fontSize: '12px'
                                    }}
                                >
                                    {role.athrtyNm}
                                </button>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>아이디/이름:</span>
                        <input type="text" className="admin-input" style={{ padding: '4px 8px', width: '160px' }} placeholder="아이디" value={searchForm.searchUserId} onChange={(e) => handleSearchChange('searchUserId', e.target.value)} />
                        <input type="text" className="admin-input" style={{ padding: '4px 8px', width: '160px' }} placeholder="이름" value={searchForm.searchUserNm} onChange={(e) => handleSearchChange('searchUserNm', e.target.value)} />
                        <CommonCodePicker grpCd="USER_STAT_CD" type="select" name="searchUserStatCd" value={searchForm.searchUserStatCd} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} defaultOption="전체 상태" />
                        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleSearchReset} className="admin-btn admin-btn-secondary">초기화</button>
                    </form>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title">
                        회원 목록 (총 {userList.length}건)
                        {selectedRoleCd && <span style={{ color: '#3498db', marginLeft: '8px', fontSize: '13px' }}>[{roleLabel(selectedRoleCd)}]</span>}
                    </span>
                    {rgstYn === 'Y' && (
                        <button onClick={() => navigate(`/admin/user/write?sysSectCd=${sysSectCd}`)} className="admin-btn admin-btn-primary" style={{ padding: '6px 16px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 회원 등록</button>
                    )}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px' }}>아이디</th>
                                <th style={{ padding: '12px' }}>이름</th>
                                <th style={{ padding: '12px' }}>사번</th>
                                <th style={{ padding: '12px' }}>권한</th>
                                <th style={{ padding: '12px' }}>등록기간</th>
                                <th style={{ padding: '12px' }}>연락처</th>
                                <th style={{ padding: '12px' }}>상태</th>
                                {delYn === 'Y' && <th style={{ padding: '12px' }}>관리</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map(u => (
                                <tr key={u.userId} onClick={() => navigate(`/admin/user/write?sysSectCd=${sysSectCd}&userId=${u.userId}`)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color, #eee)' }} className="admin-table-row-hover">
                                    <td style={{ padding: '12px', color: '#2980b9', textDecoration: 'underline' }}>{u.userId}</td>
                                    <td style={{ padding: '12px' }}>{u.userNm}</td>
                                    <td style={{ padding: '12px' }}>{u.empNo || '-'}</td>
                                    <td style={{ padding: '12px' }}>{roleLabel(u.athrtyCd)}</td>
                                    <td style={{ padding: '12px', fontSize: '13px' }}>
                                        {u.rgstBgngDt || u.rgstEndDt ? `${(u.rgstBgngDt || '').substring(0, 10)} ~ ${(u.rgstEndDt || '').substring(0, 10)}` : '-'}
                                    </td>
                                    <td style={{ padding: '12px' }}>{u.mblTelno || '미등록'}</td>
                                    <td style={{ padding: '12px', color: u.userStatCd === 'ACTV' ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{u.userStatCd === 'ACTV' ? '정상 활성' : '정지/휴면'}</td>
                                    {delYn === 'Y' && (
                                        <td style={{ padding: '12px' }}>
                                            <button onClick={(e) => handleUserDelete(e, u.userId)} className="admin-btn admin-btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>제거</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {userList.length === 0 && (
                                <tr><td colSpan={delYn === 'Y' ? 8 : 7} style={{ padding: '30px', textAlign: 'center', color: '#95a5a6' }}>조건에 일치하는 소속 인원이 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManage;
