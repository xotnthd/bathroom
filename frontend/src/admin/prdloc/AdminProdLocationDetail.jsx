import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useAdminPrdLocManage } from './hooks/useAdminPrdLocManage';

const AdminProdLocationDetail = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const idx = new URLSearchParams(routerLocation.search).get('idx');
    const mode = idx ? 'UPDATE' : 'INSERT';

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth(MENU_IDS.PRD_LOCATION);
    const { fetchLocationInfo, saveLocation } = useAdminPrdLocManage(defaultSysId);

    const [form, setForm] = useState({ locNm: '', useYn: 'Y' });
    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    useEffect(() => {
        if (mode === 'UPDATE') {
            fetchLocationInfo(idx).then(info => { if (info) setForm(info); });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const saved = await saveLocation(form);
        if (saved) {
            if (mode === 'INSERT') navigate(`/admin/prd/location/write?idx=${saved.idx}`);
            else fetchLocationInfo(idx).then(info => { if (info) setForm(info); });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '지점 등록' : '지점 상세'}</h2>
                <button onClick={() => navigate('/admin/prd/location')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">지점 정보</span>
                    {canEdit && <button type="submit" form="locationForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '등록' : '수정'}</button>}
                </div>
                <div className="admin-card-body">
                    <form id="locationForm" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">지점/창고명</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" placeholder="예) 본사, 부산창고" value={form.locNm || ''} onChange={e => setForm({ ...form, locNm: e.target.value })} required disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <label style={{ marginRight: '15px' }}><input type="radio" name="locUseYn" value="Y" checked={form.useYn === 'Y'} onChange={() => setForm({ ...form, useYn: 'Y' })} disabled={!canEdit} style={{ marginRight: '5px' }} />사용</label>
                                <label><input type="radio" name="locUseYn" value="N" checked={form.useYn === 'N'} onChange={() => setForm({ ...form, useYn: 'N' })} disabled={!canEdit} style={{ marginRight: '5px' }} />중지</label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProdLocationDetail;
