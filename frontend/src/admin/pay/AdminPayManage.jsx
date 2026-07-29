import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useAdminPayManage } from './hooks/useAdminPayManage';

const AdminPayManage = () => {
    const navigate = useNavigate();
    const { inqireYn, rgstYn, delYn } = useMenuAuth(MENU_IDS.PAY);
    const { payList, fetchPayList, deletePay } = useAdminPayManage();

    const [searchKeyword, setSearchKeyword] = useState('');
    const [appliedKeyword, setAppliedKeyword] = useState('');

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchPayList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleSearch = () => setAppliedKeyword(searchKeyword);
    const handleReset = () => { setSearchKeyword(''); setAppliedKeyword(''); };

    const displayList = appliedKeyword
        ? payList.filter(p => p.payPlanNm.includes(appliedKeyword) || p.payPlanCd.includes(appliedKeyword.toUpperCase()))
        : payList;

    const fmtMoney = (v) => (v == null ? '-' : Number(v).toLocaleString('ko-KR'));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            {/* 상단 검색 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '10px 24px' }}>
                    <span className="admin-card-title">요금제 관리</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>요금제명/코드:</span>
                        <input
                            type="text"
                            className="admin-input"
                            style={{ padding: '4px 8px', width: '220px' }}
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button type="button" onClick={handleSearch} className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleReset} className="admin-btn admin-btn-secondary">초기화</button>
                    </div>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title">요금제 목록 (총 {displayList.length}건)</span>
                    {rgstYn === 'Y' && (
                        <button onClick={() => navigate('/admin/pay/write')} className="admin-btn admin-btn-primary" style={{ padding: '6px 16px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 요금제 등록</button>
                    )}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px' }}>코드</th>
                                <th style={{ padding: '12px' }}>명칭</th>
                                <th style={{ padding: '12px' }}>결제구분</th>
                                <th style={{ padding: '12px' }}>권한 템플릿</th>
                                <th style={{ padding: '12px' }}>정가</th>
                                <th style={{ padding: '12px' }}>할인율</th>
                                <th style={{ padding: '12px' }}>실 결제금액</th>
                                <th style={{ padding: '12px' }}>사용</th>
                                {delYn === 'Y' && <th style={{ padding: '12px' }}>관리</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {displayList.map(p => (
                                <tr key={p.payPlanCd} onClick={() => navigate(`/admin/pay/write?payPlanCd=${p.payPlanCd}`)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color, #eee)' }} className="admin-table-row-hover">
                                    <td style={{ padding: '12px' }}>{p.payPlanCd}</td>
                                    <td style={{ padding: '12px', color: '#2980b9', textDecoration: 'underline' }}>{p.payPlanNm}</td>
                                    <td style={{ padding: '12px' }}>{p.paySeCd}</td>
                                    <td style={{ padding: '12px' }}>{p.tplNm || '-'}</td>
                                    <td style={{ padding: '12px' }}>{fmtMoney(p.price)}</td>
                                    <td style={{ padding: '12px' }}>{p.discountRate}%</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{fmtMoney(p.discountPrice)}</td>
                                    <td style={{ padding: '12px', color: p.useYn === 'Y' ? '#2ecc71' : '#95a5a6', fontWeight: 'bold' }}>{p.useYn}</td>
                                    {delYn === 'Y' && (
                                        <td style={{ padding: '12px' }}>
                                            <button className="admin-btn admin-btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); deletePay(p.payPlanCd); }}>삭제</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {displayList.length === 0 && (
                                <tr><td colSpan={delYn === 'Y' ? 9 : 8} style={{ padding: '30px', textAlign: 'center', color: '#95a5a6' }}>등록된 요금제가 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPayManage;
