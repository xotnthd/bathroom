import React, { useState } from 'react';

const MOVE_TYPE_LABEL = { IN: '입고', OUT: '출고', ADJUST: '조정', RETURN: '반품' };

const StockPanel = ({ prdIdx, skuList, stockList, stockSummary, stockHistory, locationList, supplierList, onProcessMove, rgstYn }) => {
    const [showTotal, setShowTotal] = useState(false);
    const [moveForm, setMoveForm] = useState({ skuIdx: '', locIdx: '', moveTypeCd: 'IN', qty: 0, supIdx: '', unitCost: '', mvRsn: '' });

    const skuLabel = (skuIdx) => {
        const s = skuList.find(x => x.idx === Number(skuIdx));
        return s ? `${s.skuCd} (${s.optLabel})` : skuIdx;
    };

    const handleMoveSubmit = async (e) => {
        e.preventDefault();
        if (!moveForm.skuIdx || !moveForm.locIdx) return alert('SKU와 지점을 선택해주세요.');
        if (!moveForm.qty || Number(moveForm.qty) === 0) return alert('수량을 입력해주세요.');
        const param = {
            skuIdx: Number(moveForm.skuIdx), locIdx: Number(moveForm.locIdx), moveTypeCd: moveForm.moveTypeCd,
            qty: Number(moveForm.qty),
            supIdx: moveForm.moveTypeCd === 'IN' && moveForm.supIdx ? Number(moveForm.supIdx) : null,
            unitCost: moveForm.moveTypeCd === 'IN' && moveForm.unitCost ? Number(moveForm.unitCost) : null,
            mvRsn: moveForm.mvRsn
        };
        const ok = await onProcessMove(param, prdIdx);
        if (ok) setMoveForm({ skuIdx: '', locIdx: '', moveTypeCd: 'IN', qty: 0, supIdx: '', unitCost: '', mvRsn: '' });
    };

    return (
        <>
            {/* 재고 현황 */}
            <div className="admin-card" style={{ marginTop: '16px' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">재고</span>
                    <label style={{ fontSize: '13px' }}>
                        <input type="checkbox" checked={showTotal} onChange={e => setShowTotal(e.target.checked)} style={{ marginRight: '5px' }} />
                        SKU 총합으로 보기
                    </label>
                </div>
                <div className="admin-card-body" style={{ overflowX: 'auto' }}>
                    {showTotal ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead><tr style={{ background: 'var(--table-header-bg, #f4f7f6)' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>SKU</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>총 재고</th>
                            </tr></thead>
                            <tbody>
                                {stockSummary.map(s => (
                                    <tr key={s.skuIdx} style={{ borderBottom: '1px solid var(--border-color, #eee)' }}>
                                        <td style={{ padding: '8px' }}>{skuLabel(s.skuIdx)}</td>
                                        <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{s.totalQty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead><tr style={{ background: 'var(--table-header-bg, #f4f7f6)' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>SKU</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>지점</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>재고 수량</th>
                            </tr></thead>
                            <tbody>
                                {stockList.map((s, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color, #eee)' }}>
                                        <td style={{ padding: '8px' }}>{s.skuCd}</td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>{s.locNm}</td>
                                        <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{s.curQty}</td>
                                    </tr>
                                ))}
                                {stockList.length === 0 && <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>SKU를 먼저 등록해주세요.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* 입출고 처리 */}
            {rgstYn === 'Y' && (
                <div className="admin-card" style={{ marginTop: '16px' }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">입출고 처리</span>
                        <button type="submit" form="stockMoveForm" className="admin-btn admin-btn-primary">처리</button>
                    </div>
                    <div className="admin-card-body">
                        <form id="stockMoveForm" onSubmit={handleMoveSubmit}>
                            <div className="admin-form-row">
                                <label className="admin-form-label">SKU</label>
                                <div className="admin-form-control">
                                    <select className="admin-input" value={moveForm.skuIdx} onChange={e => setMoveForm({ ...moveForm, skuIdx: e.target.value })} required>
                                        <option value="">SKU 선택</option>
                                        {skuList.map(s => <option key={s.idx} value={s.idx}>{s.skuCd} ({s.optLabel})</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label className="admin-form-label">지점</label>
                                <div className="admin-form-control">
                                    <select className="admin-input" value={moveForm.locIdx} onChange={e => setMoveForm({ ...moveForm, locIdx: e.target.value })} required>
                                        <option value="">지점 선택</option>
                                        {locationList.map(l => <option key={l.idx} value={l.idx}>{l.locNm}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label className="admin-form-label">구분</label>
                                <div className="admin-form-control">
                                    <select className="admin-input" value={moveForm.moveTypeCd} onChange={e => setMoveForm({ ...moveForm, moveTypeCd: e.target.value })}>
                                        <option value="IN">입고</option>
                                        <option value="OUT">출고</option>
                                        <option value="ADJUST">조정(+/-)</option>
                                        <option value="RETURN">반품</option>
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label className="admin-form-label">{moveForm.moveTypeCd === 'ADJUST' ? '증감 수량(+/-)' : '수량'}</label>
                                <div className="admin-form-control">
                                    <input type="number" className="admin-input" value={moveForm.qty} onChange={e => setMoveForm({ ...moveForm, qty: e.target.value })} required />
                                </div>
                            </div>
                            {moveForm.moveTypeCd === 'IN' && (
                                <>
                                    <div className="admin-form-row">
                                        <label className="admin-form-label">매입처</label>
                                        <div className="admin-form-control">
                                            <select className="admin-input" value={moveForm.supIdx} onChange={e => setMoveForm({ ...moveForm, supIdx: e.target.value })}>
                                                <option value="">선택 안함</option>
                                                {supplierList.map(s => <option key={s.idx} value={s.idx}>{s.supNm}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="admin-form-row">
                                        <label className="admin-form-label">매입단가</label>
                                        <div className="admin-form-control">
                                            <input type="number" className="admin-input" value={moveForm.unitCost} onChange={e => setMoveForm({ ...moveForm, unitCost: e.target.value })} />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="admin-form-row">
                                <label className="admin-form-label">사유</label>
                                <div className="admin-form-control">
                                    <input type="text" className="admin-input" value={moveForm.mvRsn} onChange={e => setMoveForm({ ...moveForm, mvRsn: e.target.value })} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 입출고 이력 */}
            <div className="admin-card" style={{ marginTop: '16px' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">입출고 이력</span>
                </div>
                <div className="admin-card-body" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead><tr style={{ background: 'var(--table-header-bg, #f4f7f6)' }}>
                            <th style={{ padding: '8px', textAlign: 'center' }}>일시</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>SKU</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>지점</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>구분</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>수량</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>매입처</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>매입단가</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>사유</th>
                        </tr></thead>
                        <tbody>
                            {stockHistory.map(h => (
                                <tr key={h.idx} style={{ borderBottom: '1px solid var(--border-color, #eee)' }}>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{h.frstRegDt ? new Date(h.frstRegDt).toLocaleString() : '-'}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{h.skuCd}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{h.locNm}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{MOVE_TYPE_LABEL[h.moveTypeCd] || h.moveTypeCd}</td>
                                    <td style={{ padding: '8px', textAlign: 'center', color: h.qty < 0 ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }}>{h.qty > 0 ? `+${h.qty}` : h.qty}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{h.supNm || '-'}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{h.unitCost ? Number(h.unitCost).toLocaleString('ko-KR') : '-'}</td>
                                    <td style={{ padding: '8px', textAlign: 'left' }}>{h.mvRsn || '-'}</td>
                                </tr>
                            ))}
                            {stockHistory.length === 0 && <tr><td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>입출고 이력이 없습니다.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default StockPanel;
