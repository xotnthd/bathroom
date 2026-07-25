import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAuthManage = (defaultSysId) => {
    const [roleList, setRoleList] = useState([]);
    const [matrixList, setMatrixList] = useState([]);
    const [selectedRoleCd, setSelectedRoleCd] = useState('');
    const [sysSectCd, setSysSectCd] = useState('MG');

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleForm, setRoleForm] = useState({ sysId: defaultSysId, sysSeCd: 'MG', oldAthrtyComCd: '', athrtyComCd: '', athrtyNm: '', cdExpl: '', useYn: 'Y' });

    // 레벨 위아래 버튼 조정용 스냅샷 (메뉴관리 순서변경과 동일한 패턴)
    const [roleLevelSnapshot, setRoleLevelSnapshot] = useState({});

    const fetchRoleList = useCallback(async (sectCd = sysSectCd) => {
        try {
            const res = await apiClient(`/admin/api/auth/role/list?sysId=${defaultSysId}&sysSeCd=${sectCd}`);
            if (res.ok) {
                const data = await res.json();
                setRoleList(data);
                const snapshot = {};
                data.forEach(r => { snapshot[r.athrtyComCd] = r.athrtyLevel; });
                setRoleLevelSnapshot(snapshot);
            }
        } catch (error) {
            console.error("Failed to fetch role list", error);
        }
    }, [defaultSysId, sysSectCd]);

    // 레벨을 한 단계 강하게(-1)/약하게(+1) 조정 - 실제 방어(자신보다 강하게 못 만듦)는 서버가 최종 검증
    const moveRoleLevel = useCallback((athrtyComCd, delta) => {
        setRoleList(prev => prev.map(r => {
            if (r.athrtyComCd !== athrtyComCd) return r;
            const nextLevel = Math.max(1, (r.athrtyLevel ?? 99) + delta);
            return { ...r, athrtyLevel: nextLevel };
        }));
    }, []);

    const saveRoleLevels = useCallback(async () => {
        const changed = roleList.filter(r => roleLevelSnapshot[r.athrtyComCd] !== r.athrtyLevel);
        if (changed.length === 0) {
            alert('변경된게 없습니다.');
            return;
        }
        try {
            const items = changed.map(r => ({ sysId: r.sysId, athrtyComCd: r.athrtyComCd, athrtyLevel: r.athrtyLevel }));
            const res = await apiClient('/admin/api/auth/role/level/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(items)
            });
            if (res.ok) {
                alert('레벨이 저장되었습니다.');
                fetchRoleList();
            } else {
                const errorMsg = await res.text();
                alert('오류: ' + errorMsg);
            }
        } catch (error) {
            console.error("Failed to save role levels", error);
            alert('레벨 저장 중 오류가 발생했습니다.');
        }
    }, [roleList, roleLevelSnapshot, fetchRoleList]);

    const sortAndIndentMenus = (list) => {
        const menuMap = {};
        const roots = [];

        list.forEach(m => { menuMap[m.menuId] = { ...m, children: [] }; });

        list.forEach(m => {
            if (m.uprMenuId === 'ROOT') {
                roots.push(menuMap[m.menuId]);
            } else if (menuMap[m.uprMenuId]) {
                menuMap[m.uprMenuId].children.push(menuMap[m.menuId]);
            } else {
                roots.push(menuMap[m.menuId]); // fallback
            }
        });

        const result = [];
        const traverse = (node, depth) => {
            let prefix = '';
            if (depth === 1) prefix = 'ㄴ ';
            if (depth === 2) prefix = 'ㄴㄴ ';
            
            result.push({ ...node, displayNm: prefix + node.menuNm, depth });
            if (node.children) {
                node.children.forEach(child => traverse(child, depth + 1));
            }
        };

        roots.sort((a, b) => {
            if (a.sysSectCd !== b.sysSectCd) return a.sysSectCd.localeCompare(b.sysSectCd);
            return 0;
        });

        roots.forEach(r => traverse(r, 0));
        return result;
    };

    const fetchMatrix = useCallback(async (roleCd) => {
        try {
            const res = await apiClient(`/admin/api/auth/matrix?sysId=${defaultSysId}&athrtyComCd=${roleCd}`);
            if (res.ok) {
                const rawData = await res.json();
                setMatrixList(sortAndIndentMenus(rawData));
            }
        } catch (error) {
            console.error("Failed to fetch matrix", error);
        }
    }, [defaultSysId]);

    const handleRoleClick = useCallback((role) => {
        setSelectedRoleCd(role.athrtyComCd);
        fetchMatrix(role.athrtyComCd);
    }, [fetchMatrix]);

    const saveRole = useCallback(async (form) => {
        try {
            // currentUserLevel/isTrueSuperAdmin은 더 이상 클라이언트가 보내지 않는다 - 서버가 세션에서 직접 계산한다
            const res = await apiClient('/admin/api/auth/role/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) { 
                alert("저장되었습니다.");
                setIsModalOpen(false); 
                fetchRoleList(); 
                if (selectedRoleCd === form.oldAthrtyComCd) {
                    setSelectedRoleCd(form.athrtyComCd);
                    fetchMatrix(form.athrtyComCd);
                }
                return true;
            } else {
                const errorMsg = await res.text();
                alert("오류: " + errorMsg);
                return false;
            }
        } catch (error) {
            console.error("Failed to save role", error);
            alert("저장 중 오류가 발생했습니다.");
            return false;
        }
    }, [fetchRoleList, selectedRoleCd, fetchMatrix]);

    const deleteRole = useCallback(async (roleCd) => {
        if (roleCd === 'S001') {
            alert("최고 관리자(S001)는 삭제할 수 없습니다.");
            return;
        }
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await apiClient(`/admin/api/auth/role/delete/${defaultSysId}/${roleCd}`, {
                method: 'DELETE'
            });
            if (res.ok) { 
                alert("삭제되었습니다.");
                fetchRoleList(); 
                if (selectedRoleCd === roleCd) {
                    setSelectedRoleCd('');
                    setMatrixList([]);
                }
            } else {
                const errorMsg = await res.text();
                alert("오류: " + errorMsg);
            }
        } catch (error) {
            console.error("Failed to delete role", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    }, [defaultSysId, fetchRoleList, selectedRoleCd]);

    const saveMatrix = useCallback(async () => {
        try {
            const res = await apiClient('/admin/api/auth/matrix/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matrixList)
            });
            if (res.ok) {
                alert("매트릭스가 반영되었습니다.");
            } else {
                const errorMsg = await res.text();
                alert("오류: " + errorMsg);
            }
        } catch (error) {
            console.error("Failed to save matrix", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    }, [matrixList]);

    const updateMatrixCheckbox = useCallback((menuId, field) => {
        setMatrixList(prev => {
            const index = prev.findIndex(m => m.menuId === menuId);
            if (index === -1) return prev;
            
            const updated = [...prev];
            const newItem = { ...updated[index] };
            
            const val = newItem[field] === 'Y' ? 'N' : 'Y';
            newItem[field] = val;

            if (field === 'menuShowYn' && val === 'N') {
                newItem.inqireYn = 'N'; newItem.rgstYn = 'N';
                newItem.mdfcnYn = 'N'; newItem.delYn = 'N';
            }
            if (field !== 'menuShowYn' && val === 'Y') {
                newItem.menuShowYn = 'Y';
            }
            
            updated[index] = newItem;
            return updated;
        });
    }, []);

    const toggleMatrixHeader = useCallback((field, sectCd) => {
        setMatrixList(prev => {
            const visibleItems = prev.filter(m => m.sysSectCd === sectCd);
            const allChecked = visibleItems.length > 0 && visibleItems.every(m => m[field] === 'Y');
            const nextVal = allChecked ? 'N' : 'Y';
            
            return prev.map(m => {
                if (m.sysSectCd !== sectCd) return m;
                const newItem = { ...m, [field]: nextVal };
                if (field === 'menuShowYn' && nextVal === 'N') {
                    newItem.inqireYn = 'N'; newItem.rgstYn = 'N'; newItem.mdfcnYn = 'N'; newItem.delYn = 'N';
                }
                if (field !== 'menuShowYn' && nextVal === 'Y') {
                    newItem.menuShowYn = 'Y';
                }
                return newItem;
            });
        });
    }, []);

    return {
        roleList,
        matrixList,
        selectedRoleCd,
        sysSectCd,
        setSysSectCd,
        isModalOpen,
        setIsModalOpen,
        roleForm,
        setRoleForm,
        fetchRoleList,
        handleRoleClick,
        saveRole,
        deleteRole,
        saveMatrix,
        updateMatrixCheckbox,
        toggleMatrixHeader,
        moveRoleLevel,
        saveRoleLevels
    };
};
