import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import CommonCodePicker from '../../components/CommonCodePicker';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useUserManage } from './hooks/useUserManage';
import DataTable from '../../components/common/DataTable';
import SearchForm from '../../components/common/SearchForm';
import UserModal from './components/UserModal';

const UserManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();
    const { sysConfig } = useOutletContext();
    const [sysSectCd, setSysSectCd] = useState('MG');

    // 커스텀 훅을 통한 비즈니스 로직 및 상태 분리
    const {
        roleList, userList, selectedRoleCd, selectedUserId, searchForm, userForm,
        handleRoleClick, handleSearchChange, handleSearchSubmit, handleSearchReset,
        handleFormChange, saveUser, deleteUser, resetForm, selectUserForEdit,
        isModalOpen, openModal, closeModal,
        uploadFiles, setUploadFiles, existingFiles,
        handleFileDelete, handleFileDownload, setUserForm
    } = useUserManage(defaultSysId, sysSectCd, inqireYn);

    const handleUserSave = async (e) => {
        e.preventDefault();
        await saveUser();
    };

    const handleUserDelete = async (userId) => {
        if (delYn !== 'Y') {
            alert('삭제 권한이 없습니다.');
            return;
        }
        if (!window.confirm(`계정 [ ${userId} ] 정보를 완전 영구 삭제 처리하시겠습니까?`)) return;
        await deleteUser(userId);
    };

    // DataTable 컬럼 정의
    const columns = [
        { key: 'userId', label: '아이디', isKey: true, align: 'center' },
        { key: 'userNm', label: '이름', align: 'center' },
        { key: 'empNo', label: '사번', align: 'center', render: (row) => row.empNo || '-' },
        { key: 'athrtyCd', label: '권한', align: 'center', render: (row) => {
            const role = roleList.find(r => r.athrtyComCd === row.athrtyCd);
            return role ? role.athrtyNm : row.athrtyCd;
        }},
        { key: 'rgstDt', label: '등록기간', align: 'center', render: (row) => {
            if (!row.rgstBgngDt && !row.rgstEndDt) return '-';
            const start = row.rgstBgngDt ? row.rgstBgngDt.substring(0, 10) : '';
            const end = row.rgstEndDt ? row.rgstEndDt.substring(0, 10) : '';
            return `${start} ~ ${end}`;
        }},
        { key: 'mblTelno', label: '연락처', align: 'center', render: (row) => row.mblTelno || '미등록' },
        { key: 'userStatCd', label: '상태', align: 'center', render: (row) => row.userStatCd === 'ACTV' ? '정상 활성' : '정지/휴면' },
    ];

    if (delYn === 'Y') {
        columns.push({
            key: 'action',
            label: '제거',
            align: 'center',
            render: (row) => (
                <button onClick={(e) => { e.stopPropagation(); handleUserDelete(row.userId); }} className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }}>
                    제거
                </button>
            )
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                
                {/* 상단 검색 영역 */}
                <SearchForm 
                    title="시스템 회원관리"
                    topContent={
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d', width: '90px' }}>시스템 구분</span>
                                <CommonCodePicker 
                                    grpCd="SYS_SE_CD" 
                                    type="radio" 
                                    name="sysSectFilter" 
                                    value={sysSectCd}  
                                    onChange={(e) => setSysSectCd(e.target.value)} 
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d', width: '90px' }}>소속 권한 목록</span>
                                <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {roleList.map(role => (
                                        <button 
                                            key={role.athrtyComCd}
                                            type="button"
                                            onClick={() => handleRoleClick(role.athrtyComCd)}
                                            style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                border: '1px solid #ddd',
                                                background: selectedRoleCd === role.athrtyComCd ? '#3498db' : '#f8f9fa',
                                                color: selectedRoleCd === role.athrtyComCd ? '#fff' : '#333',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {role.athrtyNm}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                    searchData={searchForm} 
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit} 
                    onReset={handleSearchReset}
                >
                    <input type="text" name="searchUserId" placeholder="아이디" value={searchForm.searchUserId} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <input type="text" name="searchUserNm" placeholder="이름" value={searchForm.searchUserNm} onChange={(e) => handleSearchChange(e.target.name, e.target.value)} style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <div style={{ width: '150px', display: 'flex' }}>
                        <CommonCodePicker 
                            grpCd="USER_STAT_CD" 
                            type="select" 
                            name="searchUserStatCd" 
                            value={searchForm.searchUserStatCd} 
                            onChange={(e) => handleSearchChange(e.target.name, e.target.value)} 
                            defaultOption="전체 상태" 
                        />
                    </div>
                </SearchForm>

                {/* 중앙 유저 목록 패널 */}
                <div style={{ flex: 1, background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0 }}>
                            해당 권한 소속 인원 명단 현황 
                            {selectedRoleCd && <span style={{ color: '#3498db', marginLeft: '5px' }}>[{roleList.find(r => r.athrtyComCd === selectedRoleCd)?.athrtyNm || selectedRoleCd}]</span>}
                        </h4>
                        {rgstYn === 'Y' && (
                            <button type="button" onClick={() => openModal()} className="admin-btn admin-btn-primary">
                                신규 등록
                            </button>
                        )}
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {/* 공통 DataTable 컴포넌트 사용 */}
                        <DataTable 
                            columns={columns}
                            data={userList}
                            onRowClick={selectUserForEdit}
                            selectedKey={selectedUserId}
                            rowKey="userId"
                            emptyMessage="조건에 일치하는 소속 인원이 없습니다."
                        />
                    </div>
                </div>

            </div>

            {/* 모달 폼 컴포넌트 */}
            <UserModal
                isOpen={isModalOpen}
                onClose={closeModal}
                userForm={userForm}
                handleFormChange={handleFormChange}
                handleUserSave={handleUserSave}
                selectedUserId={selectedUserId}
                roleList={roleList}
                rgstYn={rgstYn}
                mdfcnYn={mdfcnYn}
                setUploadFiles={setUploadFiles}
                existingFiles={existingFiles}
                handleFileDelete={handleFileDelete}
                handleFileDownload={handleFileDownload}
                setUserForm={setUserForm}
                sysSectCd={sysSectCd}
                sysConfig={sysConfig}
            />

        </div>
    );
};

export default UserManage;

