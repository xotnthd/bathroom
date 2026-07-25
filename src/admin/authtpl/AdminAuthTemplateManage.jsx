import React, { useEffect, useState } from 'react';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useAuthTplManage } from './hooks/useAuthTplManage';
import PlanTplModal from './components/PlanTplModal';
import DeptTplModal from './components/DeptTplModal';
import RoleTplModal from './components/RoleTplModal';
import MenuMapModal from './components/MenuMapModal';

const AdminAuthTemplateManage = () => {
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    const {
        planList, deptList, roleList, menuMapList,
        selPlanIdx, selPlanCd, selDeptIdx, selAthrtyIdx, sysSectCd, setSysSectCd,
        fetchPlanList, fetchMenuMap,
        handlePlanClick, handleDeptClick, handleRoleClick,
        savePlan, deletePlan, saveDept, deleteDept, saveRole, deleteRole,
        saveMenuMap, updateMenuMapCheckbox, toggleMenuMapHeader
    } = useAuthTplManage();

    const [planModal, setPlanModal] = useState({ isOpen: false, mode: 'INSERT' });
    const [planForm, setPlanForm] = useState({});
    const [deptModal, setDeptModal] = useState({ isOpen: false, mode: 'INSERT' });
    const [deptForm, setDeptForm] = useState({});
    const [roleModal, setRoleModal] = useState({ isOpen: false, mode: 'INSERT' });
    const [roleForm, setRoleForm] = useState({});
    const [menuMapModalOpen, setMenuMapModalOpen] = useState(false);
    const [selRoleNm, setSelRoleNm] = useState('');

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchPlanList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const openPlanInsert = () => {
        setPlanModal({ isOpen: true, mode: 'INSERT' });
        setPlanForm({ planCd: '', planNm: '', planExpl: '', sortOrd: 0, useYn: 'Y' });
    };
    const openPlanUpdate = (p) => {
        setPlanModal({ isOpen: true, mode: 'UPDATE' });
        setPlanForm(p);
    };

    const openDeptInsert = () => {
        if (!selPlanIdx) return alert('좌측에서 요금제를 먼저 선택해주세요.');
        setDeptModal({ isOpen: true, mode: 'INSERT' });
        setDeptForm({ planIdx: selPlanIdx, deptTplCd: '', deptTplNm: '', deptExpl: '', sortOrd: 0, useYn: 'Y' });
    };
    const openDeptUpdate = (d) => {
        setDeptModal({ isOpen: true, mode: 'UPDATE' });
        setDeptForm(d);
    };

    const openRoleInsert = () => {
        if (!selDeptIdx) return alert('가운데에서 부서 템플릿을 먼저 선택해주세요.');
        setRoleModal({ isOpen: true, mode: 'INSERT' });
        setRoleForm({ deptIdx: selDeptIdx, athrtyTplCd: '', sysSeCd: 'MG', athrtyNm: '', cdExpl: '', athrtyLevel: 99, useYn: 'Y' });
    };
    const openRoleUpdate = (r) => {
        setRoleModal({ isOpen: true, mode: 'UPDATE' });
        setRoleForm(r);
    };

    const openMenuMap = (r) => {
        handleRoleClick(r);
        setSelRoleNm(r.athrtyNm);
        setMenuMapModalOpen(true);
    };

    const handleSysSectCdChange = (val) => {
        setSysSectCd(val);
        if (selAthrtyIdx) fetchMenuMap(selAthrtyIdx, val);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                {/* 1단: 요금제 */}
                <div className="admin-card" style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">요금제</span>
                        {rgstYn === 'Y' && <button className="admin-btn admin-btn-primary" onClick={openPlanInsert}>+ 등록</button>}
                    </div>
                    <div className="admin-card-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)' }}>
                                <tr>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>코드</th>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>명칭</th>
                                    <th style={{ padding: '8px' }}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {planList.map(p => (
                                    <tr key={p.planCd} onClick={() => handlePlanClick(p)} style={{ cursor: 'pointer', background: selPlanCd === p.planCd ? '#e3f2fd' : 'none' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)' }}>{p.planCd}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)' }}>{p.planNm}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)', whiteSpace: 'nowrap' }}>
                                            {mdfcnYn === 'Y' && <button className="admin-btn admin-btn-secondary" onClick={e => { e.stopPropagation(); openPlanUpdate(p); }}>수정</button>}
                                            {delYn === 'Y' && <button className="admin-btn admin-btn-danger" onClick={e => { e.stopPropagation(); deletePlan(p.planCd); }} style={{ marginLeft: '5px' }}>삭제</button>}
                                        </td>
                                    </tr>
                                ))}
                                {planList.length === 0 && (
                                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>등록된 요금제가 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2단: 부서 템플릿 */}
                <div className="admin-card" style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">부서 템플릿</span>
                        {rgstYn === 'Y' && <button className="admin-btn admin-btn-primary" onClick={openDeptInsert}>+ 등록</button>}
                    </div>
                    <div className="admin-card-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)' }}>
                                <tr>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>코드</th>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>명칭</th>
                                    <th style={{ padding: '8px' }}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deptList.map(d => (
                                    <tr key={d.idx} onClick={() => handleDeptClick(d)} style={{ cursor: 'pointer', background: selDeptIdx === d.idx ? '#e8f5e9' : 'none' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)' }}>{d.deptTplCd}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)' }}>{d.deptTplNm}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)', whiteSpace: 'nowrap' }}>
                                            {mdfcnYn === 'Y' && <button className="admin-btn admin-btn-secondary" onClick={e => { e.stopPropagation(); openDeptUpdate(d); }}>수정</button>}
                                            {delYn === 'Y' && <button className="admin-btn admin-btn-danger" onClick={e => { e.stopPropagation(); deleteDept(d.idx); }} style={{ marginLeft: '5px' }}>삭제</button>}
                                        </td>
                                    </tr>
                                ))}
                                {deptList.length === 0 && (
                                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>{selPlanIdx ? '등록된 부서 템플릿이 없습니다.' : '좌측에서 요금제를 선택하세요.'}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3단: 역할 템플릿 */}
                <div className="admin-card" style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">역할 템플릿</span>
                        {rgstYn === 'Y' && <button className="admin-btn admin-btn-primary" onClick={openRoleInsert}>+ 등록</button>}
                    </div>
                    <div className="admin-card-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)' }}>
                                <tr>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>코드</th>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>명칭</th>
                                    <th style={{ padding: '8px' }}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roleList.map(r => (
                                    <tr key={r.idx} style={{ background: selAthrtyIdx === r.idx ? '#fff3e0' : 'none' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)' }}>{r.athrtyTplCd}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)' }}>{r.athrtyNm}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #eee)', whiteSpace: 'nowrap' }}>
                                            <button className="admin-btn admin-btn-primary" onClick={() => openMenuMap(r)}>메뉴권한</button>
                                            {mdfcnYn === 'Y' && <button className="admin-btn admin-btn-secondary" onClick={() => openRoleUpdate(r)} style={{ marginLeft: '5px' }}>수정</button>}
                                            {delYn === 'Y' && <button className="admin-btn admin-btn-danger" onClick={() => deleteRole(r.idx)} style={{ marginLeft: '5px' }}>삭제</button>}
                                        </td>
                                    </tr>
                                ))}
                                {roleList.length === 0 && (
                                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>{selDeptIdx ? '등록된 역할 템플릿이 없습니다.' : '가운데에서 부서 템플릿을 선택하세요.'}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <PlanTplModal
                isOpen={planModal.isOpen}
                onClose={() => setPlanModal({ ...planModal, isOpen: false })}
                mode={planModal.mode}
                formData={planForm}
                setFormData={setPlanForm}
                handleSave={savePlan}
            />
            <DeptTplModal
                isOpen={deptModal.isOpen}
                onClose={() => setDeptModal({ ...deptModal, isOpen: false })}
                mode={deptModal.mode}
                formData={deptForm}
                setFormData={setDeptForm}
                handleSave={saveDept}
            />
            <RoleTplModal
                isOpen={roleModal.isOpen}
                onClose={() => setRoleModal({ ...roleModal, isOpen: false })}
                mode={roleModal.mode}
                formData={roleForm}
                setFormData={setRoleForm}
                handleSave={saveRole}
            />
            <MenuMapModal
                isOpen={menuMapModalOpen}
                onClose={() => setMenuMapModalOpen(false)}
                roleNm={selRoleNm}
                menuMapList={menuMapList}
                sysSectCd={sysSectCd}
                onSysSectCdChange={handleSysSectCdChange}
                saveMenuMap={saveMenuMap}
                updateMenuMapCheckbox={updateMenuMapCheckbox}
                toggleMenuMapHeader={toggleMenuMapHeader}
            />
        </div>
    );
};

export default AdminAuthTemplateManage;
