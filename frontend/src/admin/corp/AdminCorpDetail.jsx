import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CommonCodePicker from '../../components/CommonCodePicker';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useAdminCorpManage } from './hooks/useAdminCorpManage';

const AdminCorpDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const idx = queryParams.get('idx');
    const mode = idx ? 'EDIT' : 'INSERT';

    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth(MENU_IDS.CORP);
    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    const { fetchCorpDetail, saveCorp } = useAdminCorpManage();

    const [form, setForm] = useState({
        corpNm: '', bizRegNo: '', corpRegNo: '', ceoNm: '', indutyCd: '', corpStatCd: '',
        zipCd: '', baseAddr: '', dtlAddr: '', corpTelno: '', homepageUrl: '',
        mgr1Nm: '', mgr1Position: '', mgr1Dept: '', mgr1MblTelno: '', mgr1Email: '',
        mgr2Nm: '', mgr2Position: '', mgr2Dept: '', mgr2MblTelno: '', mgr2Email: '',
        rmrk: '', useYn: 'Y'
    });

    useEffect(() => {
        if (mode === 'EDIT' && idx) {
            fetchCorpDetail(idx).then(data => {
                if (data) setForm(f => ({ ...f, ...data }));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.corpNm) return alert('업체명을 입력하세요.');

        const payload = { ...form, idx: idx ? Number(idx) : undefined };
        const ok = await saveCorp(payload);
        if (ok) navigate('/admin/corp');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '업체 등록' : '업체 상세'}</h2>
                <button onClick={() => navigate('/admin/corp')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">업체 정보</span>
                    {canEdit && <button type="submit" form="corpForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '등록' : '저장'}</button>}
                </div>
                <div className="admin-card-body">
                    <form id="corpForm" onSubmit={handleSave}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">업체명 *</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.corpNm} onChange={e => setForm({ ...form, corpNm: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">사업자등록번호</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.bizRegNo} onChange={e => setForm({ ...form, bizRegNo: e.target.value })} placeholder="000-00-00000" disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">법인등록번호</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.corpRegNo} onChange={e => setForm({ ...form, corpRegNo: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">대표자명</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.ceoNm} onChange={e => setForm({ ...form, ceoNm: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">업종</label>
                            <div className="admin-form-control">
                                <CommonCodePicker grpCd="INDUTY_CD" type="select" value={form.indutyCd} onChange={e => setForm({ ...form, indutyCd: e.target.value })} defaultOption="업종 선택" disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">업체 상태</label>
                            <div className="admin-form-control">
                                <CommonCodePicker grpCd="CORP_STAT_CD" type="select" value={form.corpStatCd} onChange={e => setForm({ ...form, corpStatCd: e.target.value })} defaultOption="상태 선택" disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">사업장 주소</label>
                            <div className="admin-form-control" style={{ flexWrap: 'wrap', gap: '8px' }}>
                                <input type="text" className="admin-input" style={{ width: '120px' }} value={form.zipCd} onChange={e => setForm({ ...form, zipCd: e.target.value })} placeholder="우편번호" disabled={!canEdit} />
                                <input type="text" className="admin-input" style={{ flex: 1, minWidth: '200px' }} value={form.baseAddr} onChange={e => setForm({ ...form, baseAddr: e.target.value })} placeholder="기본주소" disabled={!canEdit} />
                                <input type="text" className="admin-input" style={{ flex: 1, minWidth: '200px' }} value={form.dtlAddr} onChange={e => setForm({ ...form, dtlAddr: e.target.value })} placeholder="상세주소" disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">대표 전화번호</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.corpTelno} onChange={e => setForm({ ...form, corpTelno: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">홈페이지</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.homepageUrl} onChange={e => setForm({ ...form, homepageUrl: e.target.value })} placeholder="https://" disabled={!canEdit} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">정담당자</label>
                            <div className="admin-form-control" style={{ flexWrap: 'wrap', gap: '8px' }}>
                                <input type="text" className="admin-input" style={{ width: '110px' }} value={form.mgr1Nm} onChange={e => setForm({ ...form, mgr1Nm: e.target.value })} placeholder="이름" disabled={!canEdit} />
                                <input type="text" className="admin-input" style={{ width: '110px' }} value={form.mgr1Position} onChange={e => setForm({ ...form, mgr1Position: e.target.value })} placeholder="직급" disabled={!canEdit} />
                                <input type="text" className="admin-input" style={{ width: '110px' }} value={form.mgr1Dept} onChange={e => setForm({ ...form, mgr1Dept: e.target.value })} placeholder="부서" disabled={!canEdit} />
                                <input type="text" className="admin-input" style={{ width: '140px' }} value={form.mgr1MblTelno} onChange={e => setForm({ ...form, mgr1MblTelno: e.target.value })} placeholder="휴대폰" disabled={!canEdit} />
                                <input type="email" className="admin-input" style={{ flex: 1, minWidth: '160px' }} value={form.mgr1Email} onChange={e => setForm({ ...form, mgr1Email: e.target.value })} placeholder="이메일" disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">부담당자</label>
                            <div className="admin-form-control" style={{ flexWrap: 'wrap', gap: '8px' }}>
                                <input type="text" className="admin-input" style={{ width: '110px' }} value={form.mgr2Nm} onChange={e => setForm({ ...form, mgr2Nm: e.target.value })} placeholder="이름" disabled={!canEdit} />
                                <input type="text" className="admin-input" style={{ width: '110px' }} value={form.mgr2Position} onChange={e => setForm({ ...form, mgr2Position: e.target.value })} placeholder="직급" disabled={!canEdit} />
                                <input type="text" className="admin-input" style={{ width: '110px' }} value={form.mgr2Dept} onChange={e => setForm({ ...form, mgr2Dept: e.target.value })} placeholder="부서" disabled={!canEdit} />
                                <input type="text" className="admin-input" style={{ width: '140px' }} value={form.mgr2MblTelno} onChange={e => setForm({ ...form, mgr2MblTelno: e.target.value })} placeholder="휴대폰" disabled={!canEdit} />
                                <input type="email" className="admin-input" style={{ flex: 1, minWidth: '160px' }} value={form.mgr2Email} onChange={e => setForm({ ...form, mgr2Email: e.target.value })} placeholder="이메일" disabled={!canEdit} />
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">비고</label>
                            <div className="admin-form-control">
                                <textarea className="admin-textarea" rows="3" value={form.rmrk} onChange={e => setForm({ ...form, rmrk: e.target.value })} placeholder="정/부 담당자 외 추가로 남길 연락처나 특이사항을 자유롭게 기록하세요." disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <select className="admin-input" value={form.useYn} onChange={e => setForm({ ...form, useYn: e.target.value })} disabled={!canEdit}>
                                    <option value="Y">사용 (Y)</option>
                                    <option value="N">미사용 (N)</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCorpDetail;
