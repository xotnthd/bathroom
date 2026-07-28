import React from 'react';

const ProductFormPanel = ({ form, setForm, categoryLeafList, optGroupMasterList, onSave, mode, rgstYn, mdfcnYn }) => {
    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    const toggleOptGrp = (optGrpIdx) => {
        const cur = form.optGrpIdxList || [];
        const next = cur.includes(optGrpIdx) ? cur.filter(i => i !== optGrpIdx) : [...cur, optGrpIdx];
        setForm({ ...form, optGrpIdxList: next });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await onSave(form);
    };

    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <span className="admin-card-title">{mode === 'INSERT' ? '제품 등록' : '제품 정보'}</span>
                {canEdit && <button type="submit" form="productForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '등록' : '수정'}</button>}
            </div>
            <div className="admin-card-body">
                <form id="productForm" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="admin-form-row">
                        <label className="admin-form-label">제품 코드</label>
                        <div className="admin-form-control">
                            <input type="text" className="admin-input" value={form.prdCd || ''} onChange={e => setForm({ ...form, prdCd: e.target.value.toUpperCase() })} required disabled={mode === 'UPDATE' || !canEdit} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">제품명</label>
                        <div className="admin-form-control">
                            <input type="text" className="admin-input" value={form.prdNm || ''} onChange={e => setForm({ ...form, prdNm: e.target.value })} required disabled={!canEdit} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">카테고리</label>
                        <div className="admin-form-control">
                            <select className="admin-input" value={form.cteIdx || ''} onChange={e => setForm({ ...form, cteIdx: e.target.value ? Number(e.target.value) : null })} disabled={!canEdit}>
                                <option value="">선택 안함</option>
                                {categoryLeafList.map(c => <option key={c.idx} value={c.idx}>{c.cteNm}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">설명</label>
                        <div className="admin-form-control">
                            <textarea className="admin-textarea" rows="3" value={form.prdExpl || ''} onChange={e => setForm({ ...form, prdExpl: e.target.value })} disabled={!canEdit} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">사용할 옵션 그룹</label>
                        <div className="admin-form-control" style={{ flexWrap: 'wrap', gap: '10px' }}>
                            {optGroupMasterList.map(g => (
                                <label key={g.idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input type="checkbox" checked={(form.optGrpIdxList || []).includes(g.idx)} onChange={() => toggleOptGrp(g.idx)} disabled={!canEdit} />
                                    {g.optGrpNm}
                                </label>
                            ))}
                            {optGroupMasterList.length === 0 && <span style={{ fontSize: '12px', color: '#95a5a6' }}>등록된 옵션 그룹이 없습니다 (옵션 없는 단순 제품으로 진행 가능).</span>}
                        </div>
                    </div>
                    {form.useYn !== undefined && (
                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <label style={{ marginRight: '15px' }}><input type="radio" name="prdUseYn" value="Y" checked={form.useYn === 'Y'} onChange={() => setForm({ ...form, useYn: 'Y' })} disabled={!canEdit} style={{ marginRight: '5px' }} />사용</label>
                                <label><input type="radio" name="prdUseYn" value="N" checked={form.useYn === 'N'} onChange={() => setForm({ ...form, useYn: 'N' })} disabled={!canEdit} style={{ marginRight: '5px' }} />중지</label>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProductFormPanel;
