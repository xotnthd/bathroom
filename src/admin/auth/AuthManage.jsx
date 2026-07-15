import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';
import CommonCodePicker from '../../components/CommonCodePicker';

const AuthManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const [roleList, setRoleList] = useState([]);
    const [matrixList, setMatrixList] = useState([]);
    const [selectedRoleCd, setSelectedRoleCd] = useState('');
    const [sysSectCd, setSysSectCd] = useState('MG');

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleForm, setRoleForm] = useState({ sysId: defaultSysId, sysSeCd: 'MG', oldAthrtyComCd: '', athrtyComCd: '', athrtyNm: '', cdExpl: '', useYn: 'Y' });

    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    useEffect(() => { 
        if (inqireYn === 'Y') {
            fnFetchRoleList(); 
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [inqireYn, sysSectCd]);

    const fnFetchRoleList = async () => {
        const res = await apiClient(`/admin/api/auth/role/list?sysId=${defaultSysId}&sysSeCd=${sysSectCd}`);
        if (res.ok) setRoleList(await res.json());
    };

    const handleRoleClick = (role) => {
        setSelectedRoleCd(role.athrtyComCd);
        fnFetchMatrix(role.athrtyComCd);
    };

    const fnFetchMatrix = async (roleCd) => {
        const res = await apiClient(`/admin/api/auth/matrix?sysId=${defaultSysId}&athrtyComCd=${roleCd}`);
        if (res.ok) {
            const rawData = await res.json();
            const sortedFlattened = sortAndIndentMenus(rawData);
            setMatrixList(sortedFlattened);
        }
    };

    const sortAndIndentMenus = (list) => {
        const menuMap = {};
        const roots = [];

        list.forEach(m => {
            menuMap[m.menuId] = { ...m, children: [] };
        });

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

        // 분리해서 그릴 때도 상단 MG, USER 모두 하나로 처리하므로 
        // sysSectCd따라 1차 정렬 후 순회
        roots.sort((a, b) => {
            if (a.sysSectCd !== b.sysSectCd) return a.sysSectCd.localeCompare(b.sysSectCd);
            return 0;
        });

        roots.forEach(r => traverse(r, 0));
        return result;
    };

    const openRoleModal = (role = null) => {
        if (role) setRoleForm({ ...role, oldAthrtyComCd: role.athrtyComCd });
        else setRoleForm({ sysId: defaultSysId, sysSeCd: sysSectCd, oldAthrtyComCd: '', athrtyComCd: '', athrtyNm: '', cdExpl: '', useYn: 'Y' });
        setIsModalOpen(true);
    };

    const handleRoleSave = async (e) => {
        e.preventDefault();
        const res = await apiClient('/admin/api/auth/role/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roleForm)
        });
        if (res.ok) { 
            alert("저장되었습니다.");
            setIsModalOpen(false); 
            fnFetchRoleList(); 
            if (selectedRoleCd === roleForm.oldAthrtyComCd) {
                setSelectedRoleCd(roleForm.athrtyComCd);
                fnFetchMatrix(roleForm.athrtyComCd);
            }
        } else {
            const errorMsg = await res.text();
            alert("오류: " + errorMsg);
        }
    };

    const handleRoleDelete = async (roleCd) => {
        if (roleCd === 'S001') {
            alert("최고 관리자(S001)는 삭제할 수 없습니다.");
            return;
        }
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        const res = await apiClient(`/admin/api/auth/role/delete/${defaultSysId}/${roleCd}`, {
            method: 'DELETE'
        });
        if (res.ok) { 
            alert("삭제되었습니다.");
            fnFetchRoleList(); 
            if (selectedRoleCd === roleCd) {
                setSelectedRoleCd(null);
                setMatrixList([]);
            }
        } else {
            const errorMsg = await res.text();
            alert("오류: " + errorMsg);
        }
    };

    // --- 매트릭스 로직 ---
    const handleCheckboxChange = (menuId, field) => {
        const updated = [...matrixList];
        const index = updated.findIndex(m => m.menuId === menuId);
        if (index === -1) return;
        const val = updated[index][field] === 'Y' ? 'N' : 'Y';
        updated[index][field] = val;

        // 로직: Show가 꺼지면 나머지 N
        if (field === 'menuShowYn' && val === 'N') {
            updated[index].inqireYn = 'N'; updated[index].rgstYn = 'N';
            updated[index].mdfcnYn = 'N'; updated[index].delYn = 'N';
        }
        // 로직: CRUD가 켜지면 Show 자동 Y
        if (field !== 'menuShowYn' && val === 'Y') {
            updated[index].menuShowYn = 'Y';
        }
        setMatrixList(updated);
    };

    // 헤더 전체 선택
    const handleHeaderToggle = (field) => {
        const visibleItems = matrixList.filter(m => m.sysSectCd === sysSectCd);
        const allChecked = visibleItems.length > 0 && visibleItems.every(m => m[field] === 'Y');
        const nextVal = allChecked ? 'N' : 'Y';
        
        const updated = matrixList.map(m => {
            if (m.sysSectCd !== sysSectCd) return m;
            const newItem = { ...m, [field]: nextVal };
            if (field === 'menuShowYn' && nextVal === 'N') {
                newItem.inqireYn = 'N'; newItem.rgstYn = 'N'; newItem.mdfcnYn = 'N'; newItem.delYn = 'N';
            }
            if (field !== 'menuShowYn' && nextVal === 'Y') {
                newItem.menuShowYn = 'Y';
            }
            return newItem;
        });
        setMatrixList(updated);
    };

    const handleMatrixSave = async () => {
        const res = await apiClient('/admin/api/auth/matrix/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matrixList)
        });
        if (res.ok) alert("매트릭스가 반영되었습니다.");
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)' }}>
            {/* 전역 시스템 구분 필터 */}
            <div style={{ background: '#fff', padding: '15px 20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>전체 권한 시스템구분:</span>
                <CommonCodePicker 
                    grpCd="SYS_SE_CD" 
                    type="radio" 
                    name="globalSect" 
                    value={sysSectCd} 
                    onChange={(e) => {
                        setSysSectCd(e.target.value);
                        setSelectedRoleCd('');
                        setMatrixList([]);
                    }} 
                />
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
                {/* 좌측 권한 리스트 */}
                <div style={{ width: '350px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', display:'flex', flexDirection:'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h4 style={{margin:0}}>전체 권한 그룹 관리 ({sysSectCd})</h4>
                    {rgstYn === 'Y' && <button onClick={() => openRoleModal()} style={{background:'#2ecc71', color:'#fff', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}>+ 권한등록</button>}
                </div>
                <div style={{flex:1, overflowY:'auto'}}>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead><tr style={{background:'#f8f9fa'}}><th>코드</th><th>권한명</th><th>관리</th></tr></thead>
                        <tbody>
                        {roleList.map(r => (
                            <tr key={r.athrtyComCd} onClick={() => handleRoleClick(r)} style={{ cursor: 'pointer', background: selectedRoleCd === r.athrtyComCd ? '#e3f2fd' : 'none' }}>
                                <td style={{padding:'8px'}}>{r.athrtyComCd}</td>
                                <td style={{padding:'8px'}}>{r.athrtyNm}</td>
                                <td style={{padding:'4px', textAlign:'center'}}>
                                    {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); openRoleModal(r); }}>수정</button>}
                                    {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); handleRoleDelete(r.athrtyComCd); }}>삭제</button>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

                {/* 우측 매트릭스 */}
                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', display:'flex', flexDirection:'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                        <h4 style={{margin:0}}>상세 메뉴 접근 기능 권한 매트릭스 {selectedRoleCd && <span style={{color:'#e74c3c'}}>({selectedRoleCd})</span>}</h4>
                        {(mdfcnYn === 'Y' || rgstYn === 'Y') && selectedRoleCd && <button onClick={handleMatrixSave} style={{background:'#34495e', color:'#fff', border:'none', padding:'8px 20px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}>수정 일괄 적용</button>}
                    </div>
                <div style={{flex:1, overflowY:'auto'}}>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                        <thead style={{position:'sticky', top:0, background:'#2c3e50', color:'#fff'}}>
                        <tr>
                            <th style={{padding:'10px', textAlign:'left'}}>시스템 메뉴명</th>
                            <th>Show<br/><input type="checkbox" onChange={() => handleHeaderToggle('menuShowYn')}/></th>
                            <th>R<br/><input type="checkbox" onChange={() => handleHeaderToggle('inqireYn')}/></th>
                            <th>C<br/><input type="checkbox" onChange={() => handleHeaderToggle('rgstYn')}/></th>
                            <th>U<br/><input type="checkbox" onChange={() => handleHeaderToggle('mdfcnYn')}/></th>
                            <th>D<br/><input type="checkbox" onChange={() => handleHeaderToggle('delYn')}/></th>
                        </tr>
                        </thead>
                        <tbody>
                        {matrixList.filter(m => m.sysSectCd === sysSectCd).map((m) => (
                            <tr key={m.menuId}>
                                <td style={{textAlign:'left', padding:'8px', fontWeight: m.depth === 0 ? 'bold' : 'normal', color: m.depth === 0 ? '#2c3e50' : '#555'}}>{m.displayNm}</td>
                                <td><input type="checkbox" checked={m.menuShowYn === 'Y'} onChange={() => handleCheckboxChange(m.menuId, 'menuShowYn')}/></td>
                                <td><input type="checkbox" checked={m.inqireYn === 'Y'} onChange={() => handleCheckboxChange(m.menuId, 'inqireYn')}/></td>
                                <td><input type="checkbox" checked={m.rgstYn === 'Y'} onChange={() => handleCheckboxChange(m.menuId, 'rgstYn')}/></td>
                                <td><input type="checkbox" checked={m.mdfcnYn === 'Y'} onChange={() => handleCheckboxChange(m.menuId, 'mdfcnYn')}/></td>
                                <td><input type="checkbox" checked={m.delYn === 'Y'} onChange={() => handleCheckboxChange(m.menuId, 'delYn')}/></td>
                            </tr>
                        ))}
                        {matrixList.filter(m => m.sysSectCd === sysSectCd).length === 0 && <tr><td colSpan="6" style={{padding:'40px', color:'#999'}}>해당 구분(관리/사용자)의 메뉴가 없거나 권한 그룹을 선택하지 않았습니다.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

                {/* 권한 등록/수정 모달 */}
                {isModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '400px' }}>
                            <h4>권한 그룹 설정</h4>
                            <form onSubmit={handleRoleSave} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 'bold', width: '80px' }}>시스템구분</span>
                                    <CommonCodePicker 
                                        grpCd="SYS_SE_CD" 
                                        type="radio" 
                                        name="modalSysSeCd" 
                                        value={roleForm.sysSeCd} 
                                        onChange={e => setRoleForm({...roleForm, sysSeCd: e.target.value})} 
                                    />
                                </div>
                                <input type="text" placeholder="권한코드 (예: A001)" value={roleForm.athrtyComCd} onChange={e => setRoleForm({...roleForm, athrtyComCd: e.target.value.toUpperCase()})} required />
                                <input type="text" placeholder="권한명" value={roleForm.athrtyNm} onChange={e => setRoleForm({...roleForm, athrtyNm: e.target.value})} required />
                                <textarea placeholder="설명" value={roleForm.cdExpl} onChange={e => setRoleForm({...roleForm, cdExpl: e.target.value})} style={{height:'80px'}} />
                                <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                                    <button type="submit" style={{flex:1, padding:'10px', background:'#2c3e50', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer'}}>저장</button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{flex:1, padding:'10px', background:'#eee', border:'none', borderRadius:'4px', cursor:'pointer'}}>취소</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthManage;
