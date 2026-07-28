import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAuthTplManage = () => {
    const [tplList, setTplList] = useState([]);
    const [deptList, setDeptList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [menuMapList, setMenuMapList] = useState([]);

    const [selTplIdx, setSelTplIdx] = useState('');
    const [selTplCd, setSelTplCd] = useState('');
    const [selDeptIdx, setSelDeptIdx] = useState('');
    const [selAthrtyIdx, setSelAthrtyIdx] = useState('');
    const [sysSectCd, setSysSectCd] = useState('MG');

    const fetchTplList = useCallback(async () => {
        const res = await apiClient('/admin/api/auth-template/tpl/list', { method: 'POST' });
        if (res.ok) setTplList(await res.json());
    }, []);

    const fetchDeptList = useCallback(async (tplIdx) => {
        const res = await apiClient('/admin/api/auth-template/dept/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tplIdx })
        });
        if (res.ok) setDeptList(await res.json());
    }, []);

    const fetchRoleList = useCallback(async (deptIdx) => {
        const res = await apiClient('/admin/api/auth-template/role/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deptIdx })
        });
        if (res.ok) setRoleList(await res.json());
    }, []);

    const indentMenus = (list) => {
        const menuMap = {};
        const roots = [];

        list.forEach(m => { menuMap[m.menuId] = { ...m, children: [] }; });
        list.forEach(m => {
            if (m.uprMenuId === 'ROOT') roots.push(menuMap[m.menuId]);
            else if (menuMap[m.uprMenuId]) menuMap[m.uprMenuId].children.push(menuMap[m.menuId]);
            else roots.push(menuMap[m.menuId]);
        });

        const result = [];
        const traverse = (node, depth) => {
            const prefix = depth === 1 ? 'ㄴ ' : depth === 2 ? 'ㄴㄴ ' : '';
            result.push({ ...node, displayNm: prefix + node.menuNm, depth });
            node.children.forEach(child => traverse(child, depth + 1));
        };
        roots.forEach(r => traverse(r, 0));
        return result;
    };

    const fetchMenuMap = useCallback(async (athrtyIdx, sectCd = sysSectCd) => {
        const res = await apiClient('/admin/api/auth-template/menu-map/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ athrtyIdx, sysSectCd: sectCd })
        });
        if (res.ok) setMenuMapList(indentMenus(await res.json()));
    }, [sysSectCd]);

    const handleTplClick = useCallback((tpl) => {
        setSelTplIdx(tpl.idx);
        setSelTplCd(tpl.tplCd);
        setSelDeptIdx('');
        setSelAthrtyIdx('');
        setDeptList([]);
        setRoleList([]);
        setMenuMapList([]);
        fetchDeptList(tpl.idx);
    }, [fetchDeptList]);

    const handleDeptClick = useCallback((dept) => {
        setSelDeptIdx(dept.idx);
        setSelAthrtyIdx('');
        setRoleList([]);
        setMenuMapList([]);
        fetchRoleList(dept.idx);
    }, [fetchRoleList]);

    const handleRoleClick = useCallback((role) => {
        setSelAthrtyIdx(role.idx);
        fetchMenuMap(role.idx, sysSectCd);
    }, [fetchMenuMap, sysSectCd]);

    const reportError = async (res) => {
        const msg = await res.text();
        alert('오류: ' + msg);
    };

    const saveTpl = useCallback(async (form) => {
        const res = await apiClient('/admin/api/auth-template/tpl/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            alert('저장되었습니다.');
            fetchTplList();
            return true;
        }
        await reportError(res);
        return false;
    }, [fetchTplList]);

    const deleteTpl = useCallback(async (tplCd) => {
        if (!window.confirm('템플릿 삭제 시 속한 모든 부서/역할/메뉴권한이 함께 삭제됩니다. 진행하시겠습니까?')) return;
        const res = await apiClient(`/admin/api/auth-template/tpl/delete/${tplCd}`, { method: 'DELETE' });
        if (res.ok) {
            fetchTplList();
            if (selTplCd === tplCd) {
                setSelTplIdx(''); setSelTplCd(''); setSelDeptIdx(''); setSelAthrtyIdx('');
                setDeptList([]); setRoleList([]); setMenuMapList([]);
            }
        } else {
            await reportError(res);
        }
    }, [fetchTplList, selTplCd]);

    const saveDept = useCallback(async (form) => {
        const res = await apiClient('/admin/api/auth-template/dept/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            alert('저장되었습니다.');
            fetchDeptList(selTplIdx);
            return true;
        }
        await reportError(res);
        return false;
    }, [fetchDeptList, selTplIdx]);

    const deleteDept = useCallback(async (deptIdx) => {
        if (!window.confirm('부서 삭제 시 속한 모든 역할/메뉴권한이 함께 삭제됩니다. 진행하시겠습니까?')) return;
        const res = await apiClient(`/admin/api/auth-template/dept/delete/${deptIdx}`, { method: 'DELETE' });
        if (res.ok) {
            fetchDeptList(selTplIdx);
            if (selDeptIdx === deptIdx) {
                setSelDeptIdx(''); setSelAthrtyIdx('');
                setRoleList([]); setMenuMapList([]);
            }
        } else {
            await reportError(res);
        }
    }, [fetchDeptList, selTplIdx, selDeptIdx]);

    const saveRole = useCallback(async (form) => {
        const res = await apiClient('/admin/api/auth-template/role/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            alert('저장되었습니다.');
            fetchRoleList(selDeptIdx);
            return true;
        }
        await reportError(res);
        return false;
    }, [fetchRoleList, selDeptIdx]);

    const deleteRole = useCallback(async (athrtyIdx) => {
        if (!window.confirm('해당 역할과 메뉴권한을 삭제하시겠습니까?')) return;
        const res = await apiClient(`/admin/api/auth-template/role/delete/${athrtyIdx}`, { method: 'DELETE' });
        if (res.ok) {
            fetchRoleList(selDeptIdx);
            if (selAthrtyIdx === athrtyIdx) { setSelAthrtyIdx(''); setMenuMapList([]); }
        } else {
            await reportError(res);
        }
    }, [fetchRoleList, selDeptIdx, selAthrtyIdx]);

    const saveMenuMap = useCallback(async () => {
        const res = await apiClient('/admin/api/auth-template/menu-map/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuMapList)
        });
        if (res.ok) {
            alert('메뉴 권한이 반영되었습니다.');
        } else {
            await reportError(res);
        }
    }, [menuMapList]);

    const updateMenuMapCheckbox = useCallback((menuId, field) => {
        setMenuMapList(prev => {
            const index = prev.findIndex(m => m.menuId === menuId);
            if (index === -1) return prev;
            const updated = [...prev];
            const newItem = { ...updated[index] };
            const val = newItem[field] === 'Y' ? 'N' : 'Y';
            newItem[field] = val;
            if (field === 'menuShowYn' && val === 'N') {
                newItem.inqireYn = 'N'; newItem.rgstYn = 'N'; newItem.mdfcnYn = 'N'; newItem.delYn = 'N';
            }
            if (field !== 'menuShowYn' && val === 'Y') { newItem.menuShowYn = 'Y'; }
            updated[index] = newItem;
            return updated;
        });
    }, []);

    const toggleMenuMapHeader = useCallback((field) => {
        setMenuMapList(prev => {
            const allChecked = prev.length > 0 && prev.every(m => m[field] === 'Y');
            const nextVal = allChecked ? 'N' : 'Y';
            return prev.map(m => {
                const newItem = { ...m, [field]: nextVal };
                if (field === 'menuShowYn' && nextVal === 'N') {
                    newItem.inqireYn = 'N'; newItem.rgstYn = 'N'; newItem.mdfcnYn = 'N'; newItem.delYn = 'N';
                }
                if (field !== 'menuShowYn' && nextVal === 'Y') { newItem.menuShowYn = 'Y'; }
                return newItem;
            });
        });
    }, []);

    return {
        tplList, deptList, roleList, menuMapList,
        selTplIdx, selTplCd, selDeptIdx, selAthrtyIdx, sysSectCd, setSysSectCd,
        fetchTplList, fetchDeptList, fetchRoleList, fetchMenuMap,
        handleTplClick, handleDeptClick, handleRoleClick,
        saveTpl, deleteTpl, saveDept, deleteDept, saveRole, deleteRole,
        saveMenuMap, updateMenuMapCheckbox, toggleMenuMapHeader
    };
};
