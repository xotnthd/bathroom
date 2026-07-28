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

    // 3. 순서 변경 감지용 스냅샷 (조회 직후의 menuId 순서 - 위/아래 재정렬과 비교해 "변경됨" 여부 판단)
    const [mainOrderSnapshot, setMainOrderSnapshot] = useState([]);
    const [midOrderSnapshot, setMidOrderSnapshot] = useState([]);
    const [subOrderSnapshot, setSubOrderSnapshot] = useState([]);

    const fetchMainMenu = useCallback(async (sect) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: 'ROOT' })
        });
        if (res.ok) {
            const data = await res.json();
            setMainMenuList(data);
            setMainOrderSnapshot(data.map(m => m.menuId));
        }
    }, [defaultSysId]);

    const fetchMidMenu = useCallback(async (sect, parentId) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: parentId })
        });
        if (res.ok) {
            const data = await res.json();
            setMidMenuList(data);
            setMidOrderSnapshot(data.map(m => m.menuId));
        }
    }, [defaultSysId]);

    const fetchSubMenu = useCallback(async (sect, parentId) => {
        const res = await apiClient('/admin/api/menu/hierarchical/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, sysSectCd: sect, uprMenuId: parentId })
        });
        if (res.ok) {
            const data = await res.json();
            setSubMenuList(data);
            setSubOrderSnapshot(data.map(m => m.menuId));
        }
    }, [defaultSysId]);

    // 목록 내에서 항목을 한 칸 위(-1)/아래(+1)로 옮기는 공용 헬퍼
    const moveItem = (list, setList, index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= list.length) return;
        const newList = [...list];
        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
        setList(newList);
    };

    const moveMainItem = (index, direction) => moveItem(mainMenuList, setMainMenuList, index, direction);
    const moveMidItem = (index, direction) => moveItem(midMenuList, setMidMenuList, index, direction);
    const moveSubItem = (index, direction) => moveItem(subMenuList, setSubMenuList, index, direction);

    // 순서 저장 공용 헬퍼: 스냅샷과 비교해 바뀐 게 없으면 알림만, 바뀌었으면 인덱스 기준으로 sort_ord 일괄 재지정 후 저장
    const saveOrder = async (list, snapshot, refetch) => {
        const currentOrder = list.map(m => m.menuId);
        const isSame = currentOrder.length === snapshot.length && currentOrder.every((id, i) => id === snapshot[i]);
        if (isSame) {
            alert('변경된 내용이 없습니다.');
            return;
        }
        const items = list.map((m, i) => ({ menuId: m.menuId, sortOrd: i + 1 }));
        const res = await apiClient('/admin/api/menu/sort/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, items })
        });
        if (res.ok) {
            alert('순서가 저장되었습니다.');
            refetch();
        } else {
            alert('순서 저장에 실패했습니다.');
        }
    };

    const saveMainOrder = () => saveOrder(mainMenuList, mainOrderSnapshot, () => fetchMainMenu(sysSectCd));
    const saveMidOrder = () => saveOrder(midMenuList, midOrderSnapshot, () => fetchMidMenu(sysSectCd, selMainId));
    const saveSubOrder = () => saveOrder(subMenuList, subOrderSnapshot, () => fetchSubMenu(sysSectCd, selMidId));

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
        handleMenuLogicalDelete, saveMenu,
        moveMainItem, moveMidItem, moveSubItem,
        saveMainOrder, saveMidOrder, saveSubOrder
    };
};
