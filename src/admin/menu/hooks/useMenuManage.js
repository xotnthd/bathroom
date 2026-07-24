import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useMenuManage = (defaultSysId) => {
    // 1. 관리 섹션 분할 상태 변수
    const [sysSectCd, setSysSectCd] = useState('MG');
    const [mainMenuList, setMainMenuList] = useState([]);
    const [midMenuList, setMidMenuList] = useState([]);
    const [subMenuList, setSubMenuList] = useState([]);

    // 2. 계층 추적 부모 ID 식별 변수
    const [selMainId, setSelMainId] = useState('');
    const [selMidId, setSelMidId] = useState('');

    const fetchMainMenu = useCallback(async (sect) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: 'ROOT' })
        });
        if (res.ok) setMainMenuList(await res.json());
    }, [defaultSysId]);

    const fetchMidMenu = useCallback(async (sect, parentId) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: parentId })
        });
        if (res.ok) setMidMenuList(await res.json());
    }, [defaultSysId]);

    const fetchSubMenu = useCallback(async (sect, parentId) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: parentId })
        });
        if (res.ok) setSubMenuList(await res.json());
    }, [defaultSysId]);

    const handleMenuLogicalDelete = useCallback(async (targetType, menuId) => {
        if (!window.confirm("선택 메뉴를 논리 삭제(마킹) 처리하시겠습니까?\n하위 상세 계층도 시스템에서 제외 처리됩니다.")) return;
        const res = await apiClient(`/admin/api/menu/delete/${defaultSysId}/${menuId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("메뉴가 논리 삭제(del_yn='Y') 되었습니다.");
            if (targetType === 'MAIN') { fetchMainMenu(sysSectCd); setMidMenuList([]); setSubMenuList([]); setSelMainId(''); setSelMidId(''); }
            else if (targetType === 'MID') { fetchMidMenu(sysSectCd, selMainId); setSubMenuList([]); setSelMidId(''); }
            else { fetchSubMenu(sysSectCd, selMidId); }
        }
    }, [defaultSysId, sysSectCd, selMainId, selMidId, fetchMainMenu, fetchMidMenu, fetchSubMenu]);

    const saveMenu = useCallback(async (menuForm, modalType) => {
        const res = await apiClient('/admin/api/menu/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuForm)
        });

        if (res.ok) {
            alert("메뉴 아키텍처 정보가 성공적으로 저장되었습니다.");
            if (modalType === 'MAIN') fetchMainMenu(sysSectCd);
            else if (modalType === 'MID') fetchMidMenu(sysSectCd, selMainId);
            else fetchSubMenu(sysSectCd, selMidId);
            return true;
        }
        return false;
    }, [sysSectCd, selMainId, selMidId, fetchMainMenu, fetchMidMenu, fetchSubMenu]);

    return {
        sysSectCd, setSysSectCd,
        mainMenuList, midMenuList, subMenuList,
        selMainId, setSelMainId,
        selMidId, setSelMidId,
        setMidMenuList, setSubMenuList,
        fetchMainMenu, fetchMidMenu, fetchSubMenu,
        handleMenuLogicalDelete, saveMenu
    };
};
