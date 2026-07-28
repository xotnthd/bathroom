import React, { useState } from 'react';
import { apiClient } from '../../../utils/apiClient';
import { generateSkuCombinations } from '../utils/skuCombinations';

const SkuPanel = ({ prdIdx, productOptGroups, skuList, onSaveSkuList, mdfcnYn, rgstYn }) => {
    const [rows, setRows] = useState(null); // null = 편집 시작 전, skuList 그대로 표시

    const buildCombinations = async () => {
        if (productOptGroups.length === 0) {
            // 옵션 없는 단순 제품 - SKU 1건
            const existing = skuList[0];
            setRows([{
                idx: existing?.idx, skuCd: existing?.skuCd || '', label: '옵션 없음',
                price: existing?.price ?? 0, discountRate: existing?.discountRate ?? 0,
                barcode: existing?.barcode || '', useYn: existing?.useYn || 'Y', optValIdxList: []
            }]);
            return;
        }
        const valueListsByGroup = await Promise.all(productOptGroups.map(async (g) => {
            const res = await apiClient(`/admin/api/prdopt/value/list?optGrpIdx=${g.optGrpIdx}`);
            const values = res.ok ? await res.json() : [];
            return { optGrpNm: g.optGrpNm, values };
        }));
        const combos = generateSkuCombinations(valueListsByGroup);

        const newRows = combos.map(combo => {
            const matched = skuList.find(s => s.optLabel === combo.label);
            return {
                idx: matched?.idx, skuCd: matched?.skuCd || '', label: combo.label,
                price: matched?.price ?? 0, discountRate: matched?.discountRate ?? 0,
                barcode: matched?.barcode || '', useYn: matched?.useYn || 'Y',
                optValIdxList: combo.optValIdxList
            };
        });
        setRows(newRows);
    };

    const updateRow = (idx, field, value) => {
        setRows(rows.map((r, i) => i === idx ? { ...r, [field]: value } : r));
    };

    const handleSave = async () => {
        const invalid = rows.some(r => !r.skuCd || !r.skuCd.trim());
        if (invalid) return alert('모든 조합에 SKU 코드를 입력해주세요.');
        const ok = await onSaveSkuList(prdIdx, rows);
        if (ok) setRows(null);
    };

    const displayRows = rows || skuList.map(s => ({ ...s, label: s.optLabel }));

    return (
        <div className="admin-card" style={{ marginTop: '16px' }}>
            <div className="admin-card-header">
                <span className="admin-card-title">SKU (옵션 조합별 가격)</span>
                {!rows && rgstYn === 'Y' && <button className="admin-btn admin-btn-secondary" onClick={buildCombinations}>옵션 조합 불러오기</button>}
                {rows && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="admin-btn admin-btn-secondary" onClick={() => setRows(null)}>취소</button>
                        {mdfcnYn === 'Y' && <button className="admin-btn admin-btn-primary" onClick={handleSave}>SKU 일괄 저장</button>}
                    </div>
                )}
            </div>
            <div className="admin-card-body" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'var(--table-header-bg, #f4f7f6)' }}>
                            <th style={{ padding: '8px', textAlign: 'left' }}>옵션 조합</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>SKU 코드</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>정가</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>할인율(%)</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>실 판매가</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>사용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRows.map((r, i) => {
                            const price = parseFloat(r.price) || 0;
                            const discountRate = parseFloat(r.discountRate) || 0;
                            const previewPrice = (price * (1 - discountRate / 100)).toFixed(2);
                            return (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color, #eee)' }}>
                                    <td style={{ padding: '8px' }}>{r.label}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        {rows
                                            ? <input type="text" className="admin-input" style={{ width: '140px' }} value={r.skuCd} onChange={e => updateRow(i, 'skuCd', e.target.value.toUpperCase())} disabled={!!r.idx} />
                                            : r.skuCd}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        {rows
                                            ? <input type="number" className="admin-input" style={{ width: '100px' }} value={r.price} onChange={e => updateRow(i, 'price', e.target.value)} />
                                            : Number(r.price).toLocaleString('ko-KR')}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        {rows
                                            ? <input type="number" className="admin-input" style={{ width: '70px' }} value={r.discountRate} onChange={e => updateRow(i, 'discountRate', e.target.value)} />
                                            : `${r.discountRate}%`}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                                        {rows ? Number(previewPrice).toLocaleString('ko-KR') : Number(r.discountPrice).toLocaleString('ko-KR')}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        {rows
                                            ? <select className="admin-input" value={r.useYn} onChange={e => updateRow(i, 'useYn', e.target.value)}><option value="Y">사용</option><option value="N">중지</option></select>
                                            : r.useYn}
                                    </td>
                                </tr>
                            );
                        })}
                        {displayRows.length === 0 && (
                            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>"옵션 조합 불러오기"를 눌러 SKU를 생성하세요.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SkuPanel;
