import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useAdminPrdSupManage } from './hooks/useAdminPrdSupManage';

const AdminProdSupplierDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const idx = new URLSearchParams(location.search).get('idx');
    const mode = idx ? 'UPDATE' : 'INSERT';

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth();
    const { fetchSupplierInfo, saveSupplier } = useAdminPrdSupManage(defaultSysId);

    const [form, setForm] = useState({ supNm: '', bizNo: '', mgrNm: '', telno: '', addr: '', rmrk: '', useYn: 'Y' });
    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    useEffect(() => {
        if (mode === 'UPDATE') {
            fetchSupplierInfo(idx).then(info => { if (info) setForm(info); });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const saved = await saveSupplier(form);
        if (saved) {
            if (mode === 'INSERT') navigate(`/admin/prd/supplier/write?idx=${saved.idx}`);
            else fetchSupplierInfo(idx).then(info => { if (info) setForm(info); });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '매입처 등록' : '매입처 상세'}</h2>
                <button onClick={() => navigate('/admin/prd/supplier')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">매입처 정보</span>
                    {canEdit && <button type="submit" form="supplierForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '등록' : '수정'}</button>}
                </div>
                <div className="admin-card-body">
                    <form id="supplierForm" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">매입처명</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.supNm || ''} onChange={e => setForm({ ...form, supNm: e.target.value })} required disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">사업자번호</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.bizNo || ''} onChange={e => setForm({ ...form, bizNo: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">담당자명</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.mgrNm || ''} onChange={e => setForm({ ...form, mgrNm: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">연락처</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.telno || ''} onChange={e => setForm({ ...form, telno: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">주소</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.addr || ''} onChange={e => setForm({ ...form, addr: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">비고</label>
                            <div className="admin-form-control">
                                <textarea className="admin-textarea" rows="3" value={form.rmrk || ''} onChange={e => setForm({ ...form, rmrk: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <label style={{ marginRight: '15px' }}><input type="radio" name="supUseYn" value="Y" checked={form.useYn === 'Y'} onChange={() => setForm({ ...form, useYn: 'Y' })} disabled={!canEdit} style={{ marginRight: '5px' }} />사용</label>
                                <label><input type="radio" name="supUseYn" value="N" checked={form.useYn === 'N'} onChange={() => setForm({ ...form, useYn: 'N' })} disabled={!canEdit} style={{ marginRight: '5px' }} />중지</label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProdSupplierDetail;
