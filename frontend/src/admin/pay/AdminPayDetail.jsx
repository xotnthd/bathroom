import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useAdminPayManage } from './hooks/useAdminPayManage';
import CommonCodePicker from '../../components/CommonCodePicker';

const AdminPayDetail = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const payPlanCd = new URLSearchParams(routerLocation.search).get('payPlanCd');
    const mode = payPlanCd ? 'UPDATE' : 'INSERT';

    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth(MENU_IDS.PAY);
    const { tplList, fetchTplList, fetchPayInfo, savePay } = useAdminPayManage();

    const [form, setForm] = useState({ payPlanCd: '', payPlanNm: '', paySeCd: '', athTplIdx: null, price: 0, discountRate: 0, payPlanExpl: '', sortOrd: 0, useYn: 'Y' });
    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    useEffect(() => {
        fetchTplList();
        if (mode === 'UPDATE') {
            fetchPayInfo(payPlanCd).then(info => { if (info) setForm(info); });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payPlanCd]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const price = parseFloat(form.price) || 0;
    const discountRate = parseFloat(form.discountRate) || 0;
    const previewDiscountPrice = (price * (1 - discountRate / 100)).toFixed(2);

    const onSubmit = async (e) => {
        e.preventDefault();
        const ok = await savePay(form);
        if (ok) {
            if (mode === 'INSERT') navigate(`/admin/pay/write?payPlanCd=${form.payPlanCd}`);
            else fetchPayInfo(payPlanCd).then(info => { if (info) setForm(info); });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '요금제 등록' : '요금제 상세'}</h2>
                <button onClick={() => navigate('/admin/pay')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">요금제 정보</span>
                    {canEdit && <button type="submit" form="payForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '등록' : '수정'}</button>}
                </div>
                <div className="admin-card-body">
                    <form id="payForm" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">요금제 코드</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" placeholder="예) STANDARD_MONTHLY" value={form.payPlanCd || ''} onChange={e => setForm({ ...form, payPlanCd: e.target.value.toUpperCase() })} required disabled={mode === 'UPDATE' || !canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">요금제 명칭</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.payPlanNm || ''} onChange={e => setForm({ ...form, payPlanNm: e.target.value })} required disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">결제 구분</label>
                            <div className="admin-form-control">
                                <CommonCodePicker
                                    grpCd="PAY_SE_CD"
                                    sysId="CORE"
                                    type="select"
                                    name="paySeCd"
                                    value={form.paySeCd}
                                    onChange={e => setForm({ ...form, paySeCd: e.target.value })}
                                    defaultOption="선택하세요"
                                    disabled={!canEdit}
                                />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">적용 권한 템플릿</label>
                            <div className="admin-form-control">
                                <select className="admin-input" value={form.athTplIdx || ''} onChange={e => setForm({ ...form, athTplIdx: e.target.value ? parseInt(e.target.value) : null })} disabled={!canEdit}>
                                    <option value="">템플릿 선택 안함</option>
                                    {tplList.map(t => (
                                        <option key={t.idx} value={t.idx}>{t.tplNm} ({t.tplCd})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">정가</label>
                            <div className="admin-form-control">
                                <input type="number" className="admin-input" min="0" step="0.01" value={form.price ?? 0} onChange={e => setForm({ ...form, price: e.target.value })} required disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">할인율(%)</label>
                            <div className="admin-form-control">
                                <input type="number" className="admin-input" min="0" max="100" step="0.01" value={form.discountRate ?? 0} onChange={e => setForm({ ...form, discountRate: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">실 결제금액(미리보기)</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={previewDiscountPrice} readOnly style={{ background: '#f8f9fa', fontWeight: 'bold' }} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">비고</label>
                            <div className="admin-form-control">
                                <textarea className="admin-textarea" rows="3" placeholder="어떤 의도로 만든 요금제인지 (프로모션/이벤트 등)" value={form.payPlanExpl || ''} onChange={e => setForm({ ...form, payPlanExpl: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">표시 순서</label>
                            <div className="admin-form-control">
                                <input type="number" className="admin-input" value={form.sortOrd ?? 0} onChange={e => setForm({ ...form, sortOrd: parseInt(e.target.value) || 0 })} required disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <label style={{ marginRight: '15px' }}><input type="radio" name="payUseYn" value="Y" checked={form.useYn === 'Y'} onChange={() => setForm({ ...form, useYn: 'Y' })} disabled={!canEdit} style={{ marginRight: '5px' }} />사용</label>
                                <label><input type="radio" name="payUseYn" value="N" checked={form.useYn === 'N'} onChange={() => setForm({ ...form, useYn: 'N' })} disabled={!canEdit} style={{ marginRight: '5px' }} />중지</label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPayDetail;
