import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useUserManage = (defaultSysId, sysSectCd, inqireYn) => {
    const [roleList, setRoleList] = useState([]);      
    const [userList, setUserList] = useState([]);      
    const [selectedRoleCd, setSelectedRoleCd] = useState(''); 
    const [selectedUserId, setSelectedUserId] = useState('');

    const [searchForm, setSearchForm] = useState({ searchUserId: '', searchUserNm: '', searchUserStatCd: '' });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialUserForm = {
        sysId: defaultSysId, userId: '', pswd: '', userNm: '', athrtyCd: '', userStatCd: 'ACTV',
        email: '', mblTelno: '', zipCd: '', baseAddr: '', dtlAddr: '',
        rgstBgngDt: '', rgstEndDt: '', imgFileSn: null, rmrk: '',
        empNo: '', deptCd: '', positionCd: '', empStatCd: '', hireDt: '', resignDt: ''
    };
    
    const [userForm, setUserForm] = useState(initialUserForm);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchRoleList();
        }
    }, [inqireYn, sysSectCd]);

    const fetchRoleList = async () => {
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
        fetchUserList(roleCd, searchForm);
        setUserForm(prev => ({ ...prev, athrtyCd: roleCd })); 
    };

    const fetchUserList = async (roleCd, searchData) => {
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

    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);

    const fetchExistingFile = async (fileSn) => {
        if (!fileSn) {
            setExistingFiles([]);
            return;
        }
        // Use download endpoint trick or if we have a file list endpoint, we can use it.
        // Actually, commonFileService.getFileList requires fileGrpId. For a single fileSn, we don't have a direct endpoint returning its metadata easily except if we know the fileGrpId.
        // Wait, AdminUserController doesn't return fileOrgnlNm for imgFileSn. Let's just pass imgFileSn to existingFiles if needed, but since we don't have its metadata, we can just show a preview image using fileSn directly.
        setExistingFiles([{ fileSn: fileSn, fileOrgnlNm: '업로드된 이미지', fileSize: 0, fileType: 'image/jpeg' }]);
    };

    const saveUser = async () => {
        try {
            const formData = new FormData();
            Object.keys(userForm).forEach(key => {
                if (userForm[key] !== null && userForm[key] !== undefined) {
                    formData.append(key, userForm[key]);
                }
            });

            uploadFiles.forEach(file => {
                formData.append('files', file);
            });

            const res = await apiClient('/admin/api/user/save', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                alert("사용자 계정 정보가 정상 처리되었습니다.");
                fetchUserList(selectedRoleCd, searchForm);
                closeModal();
                return true;
            } else {
                const errorMsg = await res.text();
                alert(errorMsg || "계정 정보 저장 실패");
            }
        } catch (err) {
            alert("계정 정보 저장 실패");
        }
        return false;
    };

    const deleteUser = async (userId) => {
        try {
            const res = await apiClient(`/admin/api/user/delete/${defaultSysId}/${userId}`, { method: 'DELETE' });
            if (res.ok) {
                alert("삭제 완료되었습니다.");
                fetchUserList(selectedRoleCd, searchForm);
                resetForm();
                return true;
            }
        } catch (err) { 
            alert("계정 제거 통신 실패"); 
        }
        return false;
    };

    const handleSearchChange = (name, value) => {
        setSearchForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUserList(selectedRoleCd, searchForm);
    };

    const handleSearchReset = () => {
        const resetSearch = { searchUserId: '', searchUserNm: '', searchUserStatCd: '' };
        setSearchForm(resetSearch);
        fetchUserList(selectedRoleCd, resetSearch);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setUserForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setUserForm({ ...initialUserForm, athrtyCd: selectedRoleCd || '' });
        setSelectedUserId('');
        setUploadFiles([]);
        setExistingFiles([]);
    };

    const selectUserForEdit = (user) => {
        setSelectedUserId(user.userId);
        
        // 날짜 포맷 변환 로직 (DB DATETIME -> date YYYY-MM-DD)
        const formatDateTime = (dtStr) => {
            if (!dtStr) return '';
            return dtStr.substring(0, 10);
        };
        
        setUserForm({
            ...user,
            pswd: '',
            rgstBgngDt: formatDateTime(user.rgstBgngDt),
            rgstEndDt: formatDateTime(user.rgstEndDt),
            hireDt: formatDateTime(user.hireDt),
            resignDt: formatDateTime(user.resignDt)
        });
        
        fetchExistingFile(user.imgFileSn);
        setUploadFiles([]);
        openModal();
    };

    const handleFileDelete = async (fileSn) => {
        if (!window.confirm("파일을 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/comn/file/delete/${fileSn}`, { method: 'DELETE' });
        if (res.ok) {
            setExistingFiles([]);
            setUserForm(prev => ({ ...prev, imgFileSn: null }));
        }
    };

    const handleFileDownload = async (fileSn, originalName) => {
        try {
            const res = await apiClient(`/admin/api/comn/file/download/${fileSn}`, { method: 'GET' });
            if (!res.ok) return alert("파일 다운로드 실패");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) { alert("다운로드 오류"); }
    };

    return {
        roleList,
        userList,
        selectedRoleCd,
        selectedUserId,
        searchForm,
        userForm,
        handleRoleClick,
        handleSearchChange,
        handleSearchSubmit,
        handleSearchReset,
        handleFormChange,
        saveUser,
        deleteUser,
        resetForm,
        selectUserForEdit,
        isModalOpen,
        openModal,
        closeModal,
        uploadFiles,
        setUploadFiles,
        existingFiles,
        handleFileDelete,
        handleFileDownload,
        setUserForm
    };
};
