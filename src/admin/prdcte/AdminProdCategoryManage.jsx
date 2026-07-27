import React, { useEffect, useState } from 'react';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useAdminPrdCteManage } from './hooks/useAdminPrdCteManage';
import CategoryModal from './components/CategoryModal';

const AdminProdCategoryManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();
    const {
        mainList, midList, subList, selMainIdx, setSelMainIdx, selMidIdx, setSelMidIdx,
        setMidList, setSubList,
        fetchMainList, fetchMidList, fetchSubList, saveCategory, deleteCategory
    } = useAdminPrdCteManage(defaultSysId);

    const [modal, setModal] = useState({ isOpen: false, type: 'MAIN', mode: 'INSERT' });
    const [form, setForm] = useState({});

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchMainList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const openInsert = (type) => {
        if (type === 'MID' && !selMainIdx) return alert('대분류를 먼저 선택해주세요.');
        if (type === 'SUB' && !selMidIdx) return alert('중분류를 먼저 선택해주세요.');
        setModal({ isOpen: true, type, mode: 'INSERT' });
        setForm({
            uprCteIdx: type === 'MAIN' ? null : (type === 'MID' ? selMainIdx : selMidIdx),
            cteNm: '', cteExpl: '', sortOrd: 0, useYn: 'Y'
        });
    };
    const openUpdate = (type, data) => {
        setModal({ isOpen: true, type, mode: 'UPDATE' });
        setForm(data);
    };

    const columns = [
        { key: 'MAIN', title: '1. 대분류', list: mainList, sel: selMainIdx,
          onSelect: (c) => { setSelMainIdx(c.idx); setMidList([]); setSubList([]); setSelMidIdx(null); fetchMidList(c.idx); } },
        { key: 'MID', title: '2. 중분류', list: midList, sel: selMidIdx,
          onSelect: (c) => { setSelMidIdx(c.idx); setSubList([]); fetchSubList(c.idx); } },
        { key: 'SUB', title: '3. 소분류', list: subList, sel: null, onSelect: () => {} },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div style={{ display: 'flex', gap: '1.2rem', height: 'calc(100vh - 200px)' }}>
                {columns.map(col => (
                    <div key={col.key} className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="admin-card-title">{col.title}</span>
                            {rgstYn === 'Y' && <button onClick={() => openInsert(col.key)} className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>+ 등록</button>}
                        </div>
                        <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                                <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)' }}>
                                    <tr>
                                        <th style={{ padding: '10px' }}>카테고리명</th>
                                        <th style={{ padding: '10px' }}>사용</th>
                                        <th style={{ padding: '10px' }}>기능</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {col.list.map(c => (
                                        <tr key={c.idx} onClick={() => col.onSelect(c)} style={{ cursor: col.key !== 'SUB' ? 'pointer' : 'default', background: col.sel === c.idx ? '#e3f2fd' : 'none' }}>
                                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>{c.cteNm}</td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', color: c.useYn === 'Y' ? '#2ecc71' : '#95a5a6' }}>{c.useYn}</td>
                                            <td style={{ padding: '4px', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                                {mdfcnYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); openUpdate(col.key, c); }} className="admin-btn admin-btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '4px' }}>수정</button>}
                                                {delYn === 'Y' && <button onClick={(e) => { e.stopPropagation(); deleteCategory(col.key, c.idx); }} className="admin-btn admin-btn-danger" style={{ padding: '2px 6px', fontSize: '11px' }}>삭제</button>}
                                            </td>
                                        </tr>
                                    ))}
                                    {col.list.length === 0 && (
                                        <tr><td colSpan="3" style={{ padding: '20px', color: 'var(--text-secondary)' }}>
                                            {col.key === 'MAIN' ? '등록된 대분류가 없습니다.' : '상위 분류를 선택하세요.'}
                                        </td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            <CategoryModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                modal={modal}
                formData={form}
                setFormData={setForm}
                handleSave={saveCategory}
            />
        </div>
    );
};

export default AdminProdCategoryManage;
