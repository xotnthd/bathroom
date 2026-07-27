import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import CommonCodePicker from '../../components/CommonCodePicker';

const AdminSysManage = () => {
    const navigate = useNavigate();
    const [systemList, setSystemList] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const [payPlanList, setPayPlanList] = useState([]);
    const [assignModal, setAssignModal] = useState({ isOpen: false, sysId: '', sysNm: '' });
    const [assignForm, setAssignForm] = useState({ payIdx: '', chgRsn: '' });
    const [payFilterSeCd, setPayFilterSeCd] = useState('');
    const filteredPayPlanList = payFilterSeCd ? payPlanList.filter(p => p.paySeCd === payFilterSeCd) : payPlanList;

    const [searchPaySeCd, setSearchPaySeCd] = useState('');
    const [searchPayIdx, setSearchPayIdx] = useState('');
    const searchPayPlanOptions = searchPaySeCd ? payPlanList.filter(p => p.paySeCd === searchPaySeCd) : payPlanList;

    useEffect(() => {
        fetchSystemList();
        fetchPayPlanList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSystemList = async (keyword = searchKeyword, payIdx = searchPayIdx) => {
        const res = await apiClient('/admin/api/sys/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchKeyword: keyword, payIdx })
        });
        if (res.ok) setSystemList(await res.json());
    };

    const handleSearchReset = () => {
        setSearchKeyword('');
        setSearchPaySeCd('');
        setSearchPayIdx('');
        fetchSystemList('', '');
    };

    const fetchPayPlanList = async () => {
        const res = await apiClient('/admin/api/pay/list', { method: 'POST' });
        if (res.ok) {
            const list = (await res.json()).filter(p => p.useYn === 'Y');
            setPayPlanList(list);
            return list;
        }
        return [];
    };

    const handleCreateNew = () => {
        navigate('/admin/sys/write');
    };

    const handleSelectRow = (sysId) => {
        navigate(`/admin/sys/write?sysId=${sysId}`);
    };

    const openAssignModal = async (e, sys) => {
        e.stopPropagation();
        setAssignForm({ payIdx: sys.currentPayIdx || '', chgRsn: '' });
        setAssignModal({ isOpen: true, sysId: sys.sysId, sysNm: sys.sysNm });
        const list = await fetchPayPlanList();
        const currentPlan = list.find(p => p.idx === sys.currentPayIdx);
        setPayFilterSeCd(currentPlan ? currentPlan.paySeCd : '');
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        if (!assignForm.payIdx) return alert('요금제를 선택하세요.');
        const res = await apiClient('/admin/api/pay/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: assignModal.sysId, payIdx: assignForm.payIdx, chgRsn: assignForm.chgRsn })
        });
        if (res.ok) {
            alert('요금제가 변경되었습니다.');
            setAssignModal({ isOpen: false, sysId: '', sysNm: '' });
            fetchSystemList();
        } else {
            alert('요금제 변경에 실패했습니다.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            {/* 상단 검색 섹션 (게시판 관리 화면 스타일 통일) */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '10px 24px' }}>
                    <span className="admin-card-title">업체 관리</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>시스템 명칭:</span>
                        <input
                            type="text"
                            className="admin-input"
                            style={{ padding: '4px 8px', width: '220px' }}
                            placeholder="시스템 명칭 검색"
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && fetchSystemList()}
                        />
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }}></div>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>결제 구분:</span>
                        <CommonCodePicker
                            grpCd="PAY_SE_CD"
                            type="select"
                            name="searchPaySeCd"
                            value={searchPaySeCd}
                            onChange={e => { setSearchPaySeCd(e.target.value); setSearchPayIdx(''); }}
                            defaultOption="전체"
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>요금제:</span>
                        <select className="admin-input" style={{ padding: '4px 8px', width: '200px' }} value={searchPayIdx} onChange={e => setSearchPayIdx(e.target.value ? parseInt(e.target.value) : '')}>
                            <option value="">전체</option>
                            {searchPayPlanOptions.map(p => (
                                <option key={p.payPlanCd} value={p.idx}>{p.payPlanNm} ({p.payPlanCd})</option>
                            ))}
                        </select>
                        <button type="button" onClick={fetchSystemList} className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleSearchReset} className="admin-btn admin-btn-secondary">초기화</button>
                    </div>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title">업체 목록</span>
                    <button onClick={handleCreateNew} className="admin-btn admin-btn-primary" style={{ padding: '6px 16px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 신규 시스템</button>
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px' }}>System ID</th>
                                <th style={{ padding: '12px' }}>시스템 명칭</th>
                                <th style={{ padding: '12px' }}>요금제 구분</th>
                                <th style={{ padding: '12px' }}>현재 요금제</th>
                                <th style={{ padding: '12px' }}>사용 여부</th>
                                <th style={{ padding: '12px' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {systemList.map(sys => (
                                <tr key={sys.sysId} onClick={() => handleSelectRow(sys.sysId)} style={{ borderBottom: '1px solid var(--border-color, #eee)', cursor: 'pointer' }} className="admin-table-row-hover">
                                    <td style={{ padding: '12px' }}>{sys.sysId}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ color: '#2980b9', textDecoration: 'underline' }}>
                                            {sys.sysNm}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>{sys.currentPaySeCdNm || '-'}</td>
                                    <td style={{ padding: '12px' }}>{sys.currentPayPlanNm || '미지정'}</td>
                                    <td style={{ padding: '12px', color: sys.useYn === 'Y' ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>{sys.useYn}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button onClick={e => openAssignModal(e, sys)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>요금제 변경</button>
                                    </td>
                                </tr>
                            ))}
                            {systemList.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#95a5a6' }}>조회된 시스템이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {assignModal.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', width: '420px' }}>
                        <h3 style={{ marginTop: 0 }}>요금제 변경 - {assignModal.sysNm}</h3>
                        <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>결제 구분</label>
                                <CommonCodePicker
                                    grpCd="PAY_SE_CD"
                                    type="select"
                                    name="payFilterSeCd"
                                    value={payFilterSeCd}
                                    onChange={e => setPayFilterSeCd(e.target.value)}
                                    defaultOption="결제 구분 전체"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>요금제</label>
                                <select value={assignForm.payIdx} onChange={e => setAssignForm({ ...assignForm, payIdx: e.target.value ? parseInt(e.target.value) : '' })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <option value="">요금제 선택</option>
                                    {filteredPayPlanList.map(p => (
                                        <option key={p.payPlanCd} value={p.idx}>{p.payPlanNm} ({p.payPlanCd}) - {Number(p.discountPrice).toLocaleString('ko-KR')}원</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>변경 사유</label>
                                <textarea rows="3" value={assignForm.chgRsn} onChange={e => setAssignForm({ ...assignForm, chgRsn: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="button" onClick={() => setAssignModal({ isOpen: false, sysId: '', sysNm: '' })} style={{ flex: 1, padding: '10px', background: '#f1f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>취소</button>
                                <button type="submit" style={{ flex: 1, padding: '10px', background: '#8e44ad', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>변경 적용</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSysManage;
