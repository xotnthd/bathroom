import React, { useEffect } from 'react';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useAuthManage } from './hooks/useAuthManage';
import CommonCodePicker from '../../components/CommonCodePicker';
import DataTable from '../../components/common/DataTable';

const AuthManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    // 임시로 세션에서 현재 로그인된 사용자의 권한 레벨을 가져온다고 가정 (없으면 0: 최고관리자)
    const currentUserLevel = parseInt(sessionStorage.getItem('currentUserLevel') || '0', 10);

    const {
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
        toggleMatrixHeader
    } = useAuthManage(defaultSysId);

    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    useEffect(() => { 
        if (inqireYn === 'Y') {
            fetchRoleList(sysSectCd); 
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
    }, [inqireYn, sysSectCd, fetchRoleList]);

    const openRoleModal = (role = null) => {
        if (role) setRoleForm({ ...role, oldAthrtyComCd: role.athrtyComCd });
        else setRoleForm({ sysId: defaultSysId, sysSeCd: sysSectCd, oldAthrtyComCd: '', athrtyComCd: '', athrtyNm: '', cdExpl: '', useYn: 'Y', athrtyLevel: '' });
        setIsModalOpen(true);
    };

    const handleRoleSubmit = async (e) => {
        e.preventDefault();
        await saveRole(roleForm, currentUserLevel);
    };

    if (inqireYn === 'N') {
        return <div className="p-8 text-center text-gray-500 font-semibold">조회 권한이 없습니다.</div>;
    }

    const roleColumns = [
        { key: 'athrtyComCd', label: '권한코드', width: '80px' },
        { key: 'athrtyLevel', label: '레벨', width: '60px' },
        { 
            key: 'athrtyNm', 
            label: '권한명',
            render: (row) => <div style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>{row.athrtyNm}</div>
        },
        { 
            key: 'useYn', 
            label: '상태', 
            width: '80px',
            render: (row) => {
                if (row.delYn === 'Y') return <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>삭제됨</span>;
                return row.useYn === 'Y' ? <span style={{ color: '#2ecc71' }}>사용</span> : <span style={{ color: '#95a5a6' }}>미사용</span>;
            }
        },
        {
            key: 'manage',
            label: '관리',
            width: '120px',
            render: (row) => (
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    {mdfcnYn === 'Y' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); openRoleModal(row); }}
                            style={{ padding: '4px 10px', fontSize: '12px', border: '1px solid #3498db', background: 'transparent', color: '#3498db', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            수정
                        </button>
                    )}
                    {delYn === 'Y' && row.delYn !== 'Y' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteRole(row.athrtyComCd); }}
                            style={{ padding: '4px 10px', fontSize: '12px', border: '1px solid #e74c3c', background: 'transparent', color: '#e74c3c', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            삭제
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '20px', padding: '20px', background: '#f4f7f6', boxSizing: 'border-box' }}>
            {/* 상단 컨트롤러 */}
            <div style={{ background: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#2c3e50' }}>권한 시스템 구분</span>
                <CommonCodePicker 
                    grpCd="SYS_SE_CD" 
                    type="radio" 
                    name="globalSect" 
                    value={sysSectCd} 
                    onChange={(e) => setSysSectCd(e.target.value)} 
                />
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
                {/* 좌측: 권한 리스트 */}
                <div style={{ width: '600px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbfc' }}>
                        <h4 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>전체 권한 그룹</h4>
                        {rgstYn === 'Y' && (
                            <button 
                                onClick={() => openRoleModal()} 
                                style={{ background: '#3498db', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s' }}
                            >
                                신규 권한 등록
                            </button>
                        )}
                    </div>
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                        <DataTable 
                            columns={roleColumns} 
                            data={roleList} 
                            onRowClick={handleRoleClick}
                            rowKey="athrtyComCd"
                            selectedKey={selectedRoleCd}
                        />
                    </div>
                </div>

                {/* 우측: 매트릭스 */}
                <div style={{ flex: 1, background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbfc' }}>
                        <h4 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>
                            상세 메뉴 접근 권한 
                            {selectedRoleCd && <span style={{ color: '#e74c3c', marginLeft: '10px' }}>[{selectedRoleCd}]</span>}
                        </h4>
                        {(mdfcnYn === 'Y' || rgstYn === 'Y') && selectedRoleCd && (
                            <button 
                                onClick={saveMatrix} 
                                style={{ background: '#2c3e50', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s' }}
                            >
                                수정 일괄 적용
                            </button>
                        )}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#f1f4f6', color: '#34495e' }}>
                                <tr>
                                    <th style={{ padding: '12px 20px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>시스템 메뉴명</th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Show<br/><input type="checkbox" onChange={() => toggleMatrixHeader('menuShowYn', sysSectCd)}/></th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>조회(R)<br/><input type="checkbox" onChange={() => toggleMatrixHeader('inqireYn', sysSectCd)}/></th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>등록(C)<br/><input type="checkbox" onChange={() => toggleMatrixHeader('rgstYn', sysSectCd)}/></th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>수정(U)<br/><input type="checkbox" onChange={() => toggleMatrixHeader('mdfcnYn', sysSectCd)}/></th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>삭제(D)<br/><input type="checkbox" onChange={() => toggleMatrixHeader('delYn', sysSectCd)}/></th>
                                </tr>
                            </thead>
                            <tbody>
                                {matrixList.filter(m => m.sysSectCd === sysSectCd).map((m) => (
                                    <tr key={m.menuId} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s', '&:hover': { background: '#f9f9f9' } }}>
                                        <td style={{ textAlign: 'left', padding: '12px 20px', fontWeight: m.depth === 0 ? 'bold' : 'normal', color: m.depth === 0 ? '#2c3e50' : '#7f8c8d' }}>
                                            {m.displayNm}
                                        </td>
                                        <td><input type="checkbox" checked={m.menuShowYn === 'Y'} onChange={() => updateMatrixCheckbox(m.menuId, 'menuShowYn')}/></td>
                                        <td><input type="checkbox" checked={m.inqireYn === 'Y'} onChange={() => updateMatrixCheckbox(m.menuId, 'inqireYn')}/></td>
                                        <td><input type="checkbox" checked={m.rgstYn === 'Y'} onChange={() => updateMatrixCheckbox(m.menuId, 'rgstYn')}/></td>
                                        <td><input type="checkbox" checked={m.mdfcnYn === 'Y'} onChange={() => updateMatrixCheckbox(m.menuId, 'mdfcnYn')}/></td>
                                        <td><input type="checkbox" checked={m.delYn === 'Y'} onChange={() => updateMatrixCheckbox(m.menuId, 'delYn')}/></td>
                                    </tr>
                                ))}
                                {matrixList.filter(m => m.sysSectCd === sysSectCd).length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '50px', color: '#95a5a6', fontSize: '14px' }}>해당 구분(관리/사용자)의 메뉴가 없거나 권한 그룹을 선택하지 않았습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 권한 등록/수정 모달 */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>{roleForm.oldAthrtyComCd ? '권한 수정' : '신규 권한 등록'}</h3>
                        <form onSubmit={handleRoleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d' }}>시스템 구분</label>
                                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                                    <CommonCodePicker 
                                        grpCd="SYS_SE_CD" 
                                        type="radio" 
                                        name="modalSysSeCd" 
                                        value={roleForm.sysSeCd} 
                                        onChange={e => setRoleForm({...roleForm, sysSeCd: e.target.value})} 
                                    />
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d' }}>권한 코드</label>
                                    <input 
                                        type="text" 
                                        placeholder="예: A001" 
                                        value={roleForm.athrtyComCd} 
                                        onChange={e => setRoleForm({...roleForm, athrtyComCd: e.target.value.toUpperCase()})} 
                                        required 
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d' }}>권한 레벨 (숫자)</label>
                                    <input 
                                        type="number" 
                                        placeholder="권한 레벨" 
                                        value={roleForm.athrtyLevel} 
                                        onChange={e => setRoleForm({...roleForm, athrtyLevel: e.target.value})} 
                                        required 
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d' }}>권한명</label>
                                <input 
                                    type="text" 
                                    placeholder="권한명" 
                                    value={roleForm.athrtyNm} 
                                    onChange={e => setRoleForm({...roleForm, athrtyNm: e.target.value})} 
                                    required 
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d' }}>권한 설명</label>
                                <textarea 
                                    placeholder="설명" 
                                    value={roleForm.cdExpl} 
                                    onChange={e => setRoleForm({...roleForm, cdExpl: e.target.value})} 
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', height: '80px', resize: 'none' }} 
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#7f8c8d' }}>사용 여부</label>
                                <select 
                                    value={roleForm.useYn} 
                                    onChange={e => setRoleForm({...roleForm, useYn: e.target.value})}
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                                >
                                    <option value="Y">사용</option>
                                    <option value="N">미사용</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f4f6', color: '#7f8c8d', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>취소</button>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>저장 (수정)</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthManage;
