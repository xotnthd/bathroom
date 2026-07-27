import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const usePopupManage = (defaultSysId) => {
    const today = new Date().toISOString().split('T')[0];

    const initialSearch = { searchSysSeCd: '', searchStDate: '', searchEdDate: '' };
    const [searchForm, setSearchForm] = useState(initialSearch);
    const [popupList, setPopupList] = useState([]);

    const fetchPopupList = useCallback(async (searchParams) => {
        try {
            const query = new URLSearchParams({ sysId: defaultSysId, ...searchParams }).toString();
            const res = await apiClient(`/admin/api/popup/list?${query}`);
            if (res.ok) setPopupList(await res.json());
        } catch (error) {
            console.error("팝업 리스트 조회 에러", error);
        }
    }, [defaultSysId]);

    const fetchPopupInfo = useCallback(async (popIdx) => {
        const res = await apiClient(`/admin/api/popup/detail/${defaultSysId}/${popIdx}`);
        if (res.ok) return await res.json();
        return null;
    }, [defaultSysId]);

    const handleFileDelete = async (fileSn, currentGrpId, setExistingFiles) => {
        if (!window.confirm("파일을 삭제하시겠습니까?")) return false;
        const res = await apiClient(`/admin/api/comn/file/delete/${fileSn}`, { method: 'DELETE' });
        if (res.ok) {
            const fRes = await apiClient(`/admin/api/comn/file/list/${currentGrpId}?sysId=${defaultSysId}`);
            if (fRes.ok) {
                setExistingFiles(await fRes.json());
                return true;
            }
        }
        return false;
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

    const savePopup = async (formData, uploadFiles) => {
        if (formData.bgngYmd > formData.endYmd) {
            alert("종료일이 시작일보다 빠를 수 없습니다.");
            return false;
        }

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'popIdx' && !formData[key]) return;
            submitData.append(key, formData[key] || '');
        });

        uploadFiles.forEach(file => { submitData.append('files', file); });

        try {
            const res = await apiClient('/admin/api/popup/save', {
                method: 'POST',
                body: submitData
            });

            if (res.ok) {
                alert(formData.popIdx ? "팝업이 수정되었습니다." : "팝업이 등록되었습니다.");
                return await res.json();
            }
        } catch (error) {
            console.error("팝업 저장 에러", error);
            alert("서버 통신 중 에러가 발생했습니다.");
        }
        return null;
    };

    const deletePopup = async (popIdx) => {
        if (!window.confirm("정말 팝업을 삭제하시겠습니까?")) return false;
        try {
            const res = await apiClient(`/admin/api/popup/delete/${popIdx}`, { method: 'DELETE' });
            if (res.ok) {
                alert("삭제되었습니다.");
                fetchPopupList(searchForm);
                return true;
            }
        } catch (error) {
            console.error("팝업 삭제 에러", error);
        }
        return false;
    };

    return {
        today,
        searchForm, setSearchForm, initialSearch,
        popupList, fetchPopupList, fetchPopupInfo,
        savePopup, deletePopup,
        handleFileDelete, handleFileDownload
    };
};
