import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import CommonCodePicker from '../../components/CommonCodePicker';
import CommonCodePreview from '../../components/CommonCodePreview';
import CorpPickerModal from '../../components/common/CorpPickerModal';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';

const AdminSysForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sysId = queryParams.get('sysId');
    const mode = sysId ? 'EDIT' : 'CREATE';
    const today = new Date().toISOString().split('T')[0];

    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth(MENU_IDS.SYS);
    const canEdit = mode === 'CREATE' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    const [formData, setFormData] = useState({
        sysId: '', sysNm: '', useYn: 'Y', serviceBgnde: today, serviceEndde: '',
        adminThemeCd: 'MODERN', userThemeCd: 'MODERN', userMenuLayoutCd: 'HEADER', logoFileGrpId: '', bannerFileGrpId: '', positionSchemeCd: '', deptSchemeCd: '', payPlanIdx: '',
        masterId: '', masterPw: '', masterNm: '', masterEmail: '', corpIdx: ''
    });
    const [logoFiles, setLogoFiles] = useState(null);
    const [existingLogo, setExistingLogo] = useState(null);
    const [bannerFiles, setBannerFiles] = useState(null);
    const [existingBanner, setExistingBanner] = useState(null);
    const [idCheckStatus, setIdCheckStatus] = useState('NONE'); // NONE, SUCCESS, FAIL

    const [mappedCorp, setMappedCorp] = useState(null); // 매핑된 업체의 상세정보 (읽기 전용 노출용)
    const [showCorpPicker, setShowCorpPicker] = useState(false);

    const [payPlanList, setPayPlanList] = useState([]);
    const [payHistory, setPayHistory] = useState([]);
    const [assignForm, setAssignForm] = useState({ payIdx: '', chgRsn: '' });
    const [payFilterSeCd, setPayFilterSeCd] = useState('');
    const filteredPayPlanList = payFilterSeCd ? payPlanList.filter(p => p.paySeCd === payFilterSeCd) : payPlanList;

    useEffect(() => {
        fetchPayPlanList();

        if (mode === 'EDIT' && sysId) {
            fetchSystemDetail(sysId);
            fetchPayHistory(sysId);
        } else {
            // 초기화
            setLogoFiles(null);
            setExistingLogo(null);
            setBannerFiles(null);
            setExistingBanner(null);
            setIdCheckStatus('NONE');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, sysId]);

    // 업체 매핑이 선택/로드되면 그 업체의 상세정보를 읽기 전용으로 가져와 노출한다.
    useEffect(() => {
        if (formData.corpIdx) {
            fetchMappedCorpDetail(formData.corpIdx);
        } else {
            setMappedCorp(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.corpIdx]);

    // 요금제 목록과 현재 시스템의 요금제 정보가 둘 다 준비되면(비동기 로딩 순서 무관) 결제 구분 필터를 현재 요금제에 맞춰 채운다.
    useEffect(() => {
        if (mode === 'EDIT' && formData.currentPayIdx && payPlanList.length > 0) {
            const currentPlan = payPlanList.find(p => p.idx === formData.currentPayIdx);
            if (currentPlan) setPayFilterSeCd(currentPlan.paySeCd);
        }
    }, [payPlanList, formData.currentPayIdx, mode]);

    const fetchPayPlanList = async () => {
        const res = await apiClient('/admin/api/pay/list', { method: 'POST' });
        if (res.ok) setPayPlanList((await res.json()).filter(p => p.useYn === 'Y'));
    };

    const fetchPayHistory = async (id) => {
        const res = await apiClient(`/admin/api/pay/history/${id}`);
        if (res.ok) setPayHistory(await res.json());
    };

    const fetchSystemDetail = async (id) => {
        const res = await apiClient(`/admin/api/sys/detail/${id}`);
        if (res.ok) {
            const data = await res.json();
            setFormData(data);
            setAssignForm({ payIdx: data.currentPayIdx || '', chgRsn: '' });

            if (data.logoFileGrpId) {
                const fRes = await apiClient(`/admin/api/comn/file/list/${data.logoFileGrpId}?sysId=${id}`);
                if (fRes.ok) {
                    const files = await fRes.json();
                    setExistingLogo(files.length > 0 ? files[0] : null);
                }
            } else {
                setExistingLogo(null);
            }

            if (data.bannerFileGrpId) {
                const bRes = await apiClient(`/admin/api/comn/file/list/${data.bannerFileGrpId}?sysId=${id}`);
                if (bRes.ok) {
                    const files = await bRes.json();
                    setExistingBanner(files.length > 0 ? files[0] : null);
                }
            } else {
                setExistingBanner(null);
            }
        }
    };

    const fetchMappedCorpDetail = async (idx) => {
        const res = await apiClient(`/admin/api/corp/detail/${idx}`);
        if (res.ok) {
            const data = await res.json();
            setMappedCorp(data && data.idx ? data : null);
        }
    };

    const handleIdCheck = async () => {
        if (!formData.sysId) {
            alert('System ID를 입력하세요.');
            return;
        }
        if (!formData.masterId) {
            alert('마스터 계정 ID를 입력하세요.');
            return;
        }

        const res = await apiClient(`/admin/api/sys/check-id?sysId=${formData.sysId}&masterId=${formData.masterId}`);
        if (res.ok) {
            const data = await res.json();
            if (data.isAvailable) {
                setIdCheckStatus('SUCCESS');
                alert('사용 가능한 ID입니다.');
            } else {
                setIdCheckStatus('FAIL');
                alert('이미 사용 중인 ID입니다.');
            }
        }
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        if (!assignForm.payIdx) return alert('요금제를 선택하세요.');
        if (assignForm.payIdx === formData.currentPayIdx) return alert('현재와 동일한 요금제입니다.');
        const res = await apiClient('/admin/api/pay/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId, payIdx: assignForm.payIdx, chgRsn: assignForm.chgRsn })
        });
        if (res.ok) {
            alert('요금제가 변경되었습니다.');
            fetchSystemDetail(sysId);
            fetchPayHistory(sysId);
        } else {
            alert('요금제 변경에 실패했습니다.');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.sysId) return alert("System ID를 입력하세요.");
        if (!formData.sysNm) return alert("시스템 명칭을 입력하세요.");

        if (mode === 'CREATE') {
            if (idCheckStatus !== 'SUCCESS') return alert("ID 중복 확인을 해주세요.");
            if (!formData.masterPw) return alert("마스터 계정 비밀번호를 입력하세요.");
            if (!formData.masterNm) return alert("마스터 계정 이름을 입력하세요.");
            if (!formData.payPlanIdx) return alert("요금제를 선택하세요.");
        }

        const payload = new FormData();
        payload.append('sysData', JSON.stringify(formData));
        if (logoFiles && logoFiles.length > 0) {
            payload.append('logoFiles', logoFiles[0]);
        }
        if (bannerFiles && bannerFiles.length > 0) {
            payload.append('bannerFiles', bannerFiles[0]);
        }

        const url = mode === 'CREATE' ? '/admin/api/sys/create' : '/admin/api/sys/save';

        const res = await apiClient(url, {
            method: 'POST',
            body: payload
        });

        if (res.ok) {
            alert(mode === 'CREATE' ? '시스템이 성공적으로 생성되었습니다.' : '수정되었습니다.');
            navigate('/admin/sys');
        } else {
            const errMsg = await res.text().catch(() => '');
            alert(errMsg || '요청에 실패했습니다.');
        }
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'CREATE' ? '신규 시스템 프로비저닝(생성)' : '시스템 설정 상세'}</h2>
                <button onClick={() => navigate('/admin/sys')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">시스템 정보</span>
                    {canEdit && <button type="submit" form="sysForm" className="admin-btn admin-btn-primary">{mode === 'CREATE' ? '시스템 생성' : '수정'}</button>}
                </div>
                <div className="admin-card-body">
                    <form id="sysForm" onSubmit={handleSave}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">System ID *</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={formData.sysId} onChange={e => { setFormData({ ...formData, sysId: e.target.value }); setIdCheckStatus('NONE'); }} readOnly={mode === 'EDIT'} placeholder="예) CP01" disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">시스템 명칭 *</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={formData.sysNm} onChange={e => setFormData({ ...formData, sysNm: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>

                        {mode === 'CREATE' && (
                            <div className="admin-form-row">
                                <label className="admin-form-label">요금제 *</label>
                                <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                    <CommonCodePicker
                                        grpCd="PAY_SE_CD"
                                        type="select"
                                        name="payFilterSeCd"
                                        value={payFilterSeCd}
                                        onChange={e => setPayFilterSeCd(e.target.value)}
                                        defaultOption="결제 구분 전체"
                                        disabled={!canEdit}
                                    />
                                    <select className="admin-input" style={{ marginTop: '8px' }} value={formData.payPlanIdx} onChange={e => setFormData({ ...formData, payPlanIdx: e.target.value ? parseInt(e.target.value) : '' })} disabled={!canEdit}>
                                        <option value="">요금제 선택</option>
                                        {filteredPayPlanList.map(p => (
                                            <option key={p.payPlanCd} value={p.idx}>
                                                {p.payPlanNm} ({p.payPlanCd}) - {Number(p.discountPrice).toLocaleString('ko-KR')}원
                                                {p.discountRate > 0 ? ` (${p.discountRate}% 할인)` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>
                                        * 선택한 요금제가 연결된 권한 템플릿의 부서/역할/메뉴 권한 구조가 그대로 복제됩니다. 마스터 계정(A001)의 메뉴 권한도 여기서 자동으로 결정됩니다. 요금제 자체는 "요금제 관리" 화면에서 등록/수정합니다.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <select className="admin-input" value={formData.useYn} onChange={e => setFormData({ ...formData, useYn: e.target.value })} disabled={!canEdit}>
                                    <option value="Y">사용 (Y)</option>
                                    <option value="N">미사용 (N)</option>
                                </select>
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">서비스 기간</label>
                            <div className="admin-form-control">
                                <input type="date" className="admin-input" value={formData.serviceBgnde || ''} onChange={e => setFormData({ ...formData, serviceBgnde: e.target.value })} disabled={!canEdit} />
                                <span>~</span>
                                <input type="date" className="admin-input" value={formData.serviceEndde || ''} onChange={e => setFormData({ ...formData, serviceEndde: e.target.value })} disabled={!canEdit} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: '16px' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">마스터 계정 정보</span>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-row">
                        <label className="admin-form-label">마스터 ID *</label>
                        <div className="admin-form-control">
                            <input type="text" form="sysForm" className="admin-input" value={formData.masterId || ''} onChange={e => { setFormData({ ...formData, masterId: e.target.value }); setIdCheckStatus('NONE'); }} readOnly={mode === 'EDIT'} disabled={!canEdit} />
                            {mode === 'CREATE' && canEdit && (
                                <button type="button" onClick={handleIdCheck} className="admin-btn admin-btn-secondary" style={{ flexShrink: 0 }}>중복확인</button>
                            )}
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">비밀번호 {mode === 'EDIT' && '(변경시에만 입력)'}</label>
                        <div className="admin-form-control">
                            <input type="password" form="sysForm" className="admin-input" value={formData.masterPw || ''} onChange={e => setFormData({ ...formData, masterPw: e.target.value })} placeholder={mode === 'EDIT' ? "변경할 비밀번호 입력" : ""} disabled={!canEdit} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">관리자 이름</label>
                        <div className="admin-form-control">
                            <input type="text" form="sysForm" className="admin-input" value={formData.masterNm || ''} onChange={e => setFormData({ ...formData, masterNm: e.target.value })} disabled={!canEdit} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">이메일</label>
                        <div className="admin-form-control">
                            <input type="email" form="sysForm" className="admin-input" value={formData.masterEmail || ''} onChange={e => setFormData({ ...formData, masterEmail: e.target.value })} disabled={!canEdit} />
                        </div>
                    </div>
                </div>
            </div>

            {mode === 'EDIT' && (
                <div className="admin-card" style={{ marginTop: '16px' }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">업체 정보</span>
                    </div>
                    <div className="admin-card-body">
                        <div className="admin-form-row">
                            <label className="admin-form-label">업체 정보</label>
                            <div className="admin-form-control">
                                <span>{mappedCorp ? mappedCorp.corpNm : '매핑 안 함'}</span>
                                {canEdit && (
                                    <button type="button" onClick={() => setShowCorpPicker(true)} className="admin-btn admin-btn-secondary" style={{ flexShrink: 0 }}>업체 검색</button>
                                )}
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '5px 0 0 0', flexBasis: '100%' }}>
                                    * "업체 검색"으로 이 시스템에 해당하는 업체를 선택하세요. 선택 후 위쪽 "수정" 버튼으로 저장해야 반영됩니다. 업체 정보 자체(사업자등록번호, 담당자 등)의 등록/수정은 "업체 관리" 화면에서 합니다.
                                </p>
                            </div>
                        </div>

                        {mappedCorp && (
                            <>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">사업자등록번호</label>
                                    <div className="admin-form-control">{mappedCorp.bizRegNo || '-'}</div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">대표자명</label>
                                    <div className="admin-form-control">{mappedCorp.ceoNm || '-'}</div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">사업장 주소</label>
                                    <div className="admin-form-control">
                                        {mappedCorp.baseAddr ? `${mappedCorp.baseAddr} ${mappedCorp.dtlAddr || ''}`.trim() : '-'}
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">대표 전화번호</label>
                                    <div className="admin-form-control">{mappedCorp.corpTelno || '-'}</div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">정담당자</label>
                                    <div className="admin-form-control">
                                        {mappedCorp.mgr1Nm ? `${mappedCorp.mgr1Nm} ${mappedCorp.mgr1Position || ''} (${mappedCorp.mgr1Dept || '-'}) · ${mappedCorp.mgr1MblTelno || '-'} · ${mappedCorp.mgr1Email || '-'}` : '-'}
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">부담당자</label>
                                    <div className="admin-form-control">
                                        {mappedCorp.mgr2Nm ? `${mappedCorp.mgr2Nm} ${mappedCorp.mgr2Position || ''} (${mappedCorp.mgr2Dept || '-'}) · ${mappedCorp.mgr2MblTelno || '-'} · ${mappedCorp.mgr2Email || '-'}` : '-'}
                                    </div>
                                </div>
                                <div className="admin-form-row">
                                    <label className="admin-form-label">비고</label>
                                    <div className="admin-form-control">{mappedCorp.rmrk || '-'}</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <CorpPickerModal
                isOpen={showCorpPicker}
                onClose={() => setShowCorpPicker(false)}
                initialSelected={formData.corpIdx || null}
                onConfirm={(idx) => setFormData({ ...formData, corpIdx: idx || '' })}
            />

            <div className="admin-card" style={{ marginTop: '16px' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">디자인 및 체계 설정</span>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-row">
                        <label className="admin-form-label">관리자 디자인 테마</label>
                        <div className="admin-form-control">
                            <select form="sysForm" className="admin-input" value={formData.adminThemeCd || 'MODERN'} onChange={e => setFormData({ ...formData, adminThemeCd: e.target.value })} disabled={!canEdit}>
                                <option value="MODERN">모던 미니멀리스트 (Modern Minimalist)</option>
                                <option value="GLASS">글래스모피즘 (Glassmorphism)</option>
                                <option value="DARK">다크 모드 (Sleek Dark)</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">사용자 디자인 테마</label>
                        <div className="admin-form-control">
                            <select form="sysForm" className="admin-input" value={formData.userThemeCd || 'MODERN'} onChange={e => setFormData({ ...formData, userThemeCd: e.target.value })} disabled={!canEdit}>
                                <option value="MODERN">모던 미니멀리스트 (Modern Minimalist)</option>
                                <option value="GLASS">글래스모피즘 (Glassmorphism)</option>
                                <option value="DARK">다크 모드 (Sleek Dark)</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                        <label className="admin-form-label">부서 체계</label>
                        <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            <CommonCodePicker
                                grpCd="DEPT_CD"
                                uprComCd="ROOT"
                                type="select"
                                name="deptSchemeCd"
                                value={formData.deptSchemeCd}
                                onChange={e => setFormData({ ...formData, deptSchemeCd: e.target.value })}
                                defaultOption="부서 체계 선택"
                                disabled={!canEdit}
                            />
                            <div style={{ marginTop: '8px' }}>
                                <CommonCodePreview grpCd="DEPT_CD" uprComCd={formData.deptSchemeCd} />
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>
                                * 선택한 체계에 속한 부서들이 직원 관리 화면의 "부서" 드롭다운에 노출됩니다. 체계/부서 항목은 공통코드 관리(DEPT_CD)에서 추가·수정할 수 있습니다.
                            </p>
                        </div>
                    </div>
                    <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                        <label className="admin-form-label">직급 체계</label>
                        <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            <CommonCodePicker
                                grpCd="POSITION_CD"
                                uprComCd="ROOT"
                                type="select"
                                name="positionSchemeCd"
                                value={formData.positionSchemeCd}
                                onChange={e => setFormData({ ...formData, positionSchemeCd: e.target.value })}
                                defaultOption="직급 체계 선택"
                                disabled={!canEdit}
                            />
                            <div style={{ marginTop: '8px' }}>
                                <CommonCodePreview grpCd="POSITION_CD" uprComCd={formData.positionSchemeCd} />
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>
                                * 선택한 체계에 속한 직급들이 직원 관리 화면의 "직급" 드롭다운에 노출됩니다. 체계/직급 항목은 공통코드 관리(POSITION_CD)에서 추가·수정할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: '16px' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">서비스 로고 이미지</span>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                        <label className="admin-form-label">로고 파일</label>
                        <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            {existingLogo && mode === 'EDIT' && (
                                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={`/admin/api/comn/file/download/${existingLogo.fileSn}`} alt="logo" style={{ height: '50px', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>현재 등록된 로고</span>
                                </div>
                            )}
                            {canEdit && (
                                <input type="file" accept="image/*" onChange={e => setLogoFiles(e.target.files)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: '16px' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">사용자 화면 구성</span>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                        <label className="admin-form-label">메뉴 레이아웃</label>
                        <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {[
                                    { cd: 'HEADER', title: '상단메뉴형', desc: '배너 - 상단메뉴 - 콘텐츠 - 푸터' },
                                    { cd: 'SIDEBAR', title: '좌측메뉴형', desc: '배너 - (좌측메뉴 + 콘텐츠) - 푸터' }
                                ].map(opt => {
                                    const selected = (formData.userMenuLayoutCd || 'HEADER') === opt.cd;
                                    return (
                                        <div
                                            key={opt.cd}
                                            onClick={() => canEdit && setFormData({ ...formData, userMenuLayoutCd: opt.cd })}
                                            style={{
                                                border: selected ? '2px solid var(--primary-color, #3498db)' : '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                width: '180px',
                                                cursor: canEdit ? 'pointer' : 'default',
                                                background: selected ? 'rgba(52, 152, 219, 0.06)' : 'transparent'
                                            }}
                                        >
                                            {opt.cd === 'HEADER' ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', height: '110px' }}>
                                                    <div style={{ flex: '0 0 22px', background: '#f39c12', borderRadius: '3px', fontSize: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>배너/홍보</div>
                                                    <div style={{ flex: '0 0 16px', background: '#3498db', borderRadius: '3px', fontSize: '9px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>상단메뉴</div>
                                                    <div style={{ flex: 1, background: 'var(--bg-color, #ecf0f1)', borderRadius: '3px', fontSize: '9px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>콘텐츠</div>
                                                    <div style={{ flex: '0 0 14px', background: '#2c3e50', borderRadius: '3px', fontSize: '9px', color: '#bdc3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>푸터</div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', height: '110px' }}>
                                                    <div style={{ flex: '0 0 22px', background: '#f39c12', borderRadius: '3px', fontSize: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>배너/홍보</div>
                                                    <div style={{ flex: 1, display: 'flex', gap: '3px' }}>
                                                        <div style={{ flex: '0 0 34px', background: '#3498db', borderRadius: '3px', fontSize: '9px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl' }}>메뉴</div>
                                                        <div style={{ flex: 1, background: 'var(--bg-color, #ecf0f1)', borderRadius: '3px', fontSize: '9px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>콘텐츠</div>
                                                    </div>
                                                    <div style={{ flex: '0 0 14px', background: '#2c3e50', borderRadius: '3px', fontSize: '9px', color: '#bdc3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>푸터</div>
                                                </div>
                                            )}
                                            <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '13px' }}>{opt.title}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '10px 0 0 0' }}>
                                * 사용자(공개 홈페이지) 화면 상단에는 항상 배너/홍보 영역이 노출되며, 그 아래 메뉴 배치를 상단(가로) 또는 좌측(세로) 중에서 선택할 수 있습니다.
                            </p>
                        </div>
                    </div>
                    <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                        <label className="admin-form-label">배너/홍보 이미지</label>
                        <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            {existingBanner && mode === 'EDIT' && (
                                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={`/admin/api/comn/file/download/${existingBanner.fileSn}`} alt="banner" style={{ maxHeight: '80px', maxWidth: '100%', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>현재 등록된 배너</span>
                                </div>
                            )}
                            {canEdit && (
                                <input type="file" accept="image/*" onChange={e => setBannerFiles(e.target.files)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {mode === 'EDIT' && (
                <div className="admin-card" style={{ marginTop: '16px' }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">요금제 변경</span>
                        {mdfcnYn === 'Y' && <button type="submit" form="payAssignForm" className="admin-btn admin-btn-primary">변경 적용</button>}
                    </div>
                    <div className="admin-card-body">
                        <form id="payAssignForm" onSubmit={handleAssignSubmit}>
                            <div className="admin-form-row">
                                <label className="admin-form-label">현재 요금제</label>
                                <div className="admin-form-control">
                                    <span>{formData.currentPayPlanNm || '미지정'}</span>
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label className="admin-form-label">결제 구분</label>
                                <div className="admin-form-control">
                                    <CommonCodePicker
                                        grpCd="PAY_SE_CD"
                                        type="select"
                                        name="payFilterSeCd"
                                        value={payFilterSeCd}
                                        onChange={e => setPayFilterSeCd(e.target.value)}
                                        defaultOption="결제 구분 전체"
                                        disabled={mdfcnYn !== 'Y'}
                                    />
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label className="admin-form-label">변경할 요금제 *</label>
                                <div className="admin-form-control">
                                    <select className="admin-input" value={assignForm.payIdx} onChange={e => setAssignForm({ ...assignForm, payIdx: e.target.value ? parseInt(e.target.value) : '' })} disabled={mdfcnYn !== 'Y'}>
                                        <option value="">요금제 선택</option>
                                        {filteredPayPlanList.map(p => (
                                            <option key={p.payPlanCd} value={p.idx}>{p.payPlanNm} ({p.payPlanCd}) - {Number(p.discountPrice).toLocaleString('ko-KR')}원</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                                <label className="admin-form-label">변경 사유</label>
                                <div className="admin-form-control">
                                    <textarea className="admin-textarea" rows="2" value={assignForm.chgRsn} onChange={e => setAssignForm({ ...assignForm, chgRsn: e.target.value })} disabled={mdfcnYn !== 'Y'} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mode === 'EDIT' && (
                <div className="admin-card" style={{ marginTop: '16px' }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">요금제 변경 이력</span>
                    </div>
                    <div className="admin-card-body" style={{ padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                            <thead>
                                <tr style={{ background: 'var(--table-header-bg)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '10px' }}>요금제</th>
                                    <th style={{ padding: '10px' }}>가격</th>
                                    <th style={{ padding: '10px' }}>적용 시작</th>
                                    <th style={{ padding: '10px' }}>적용 종료</th>
                                    <th style={{ padding: '10px' }}>상태</th>
                                    <th style={{ padding: '10px' }}>변경 사유</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payHistory.map(h => {
                                    const isActive = !h.appliedEndDt;
                                    return (
                                        <tr key={h.idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '10px' }}>{h.payPlanNm || '-'}</td>
                                            <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                                                {h.discountPrice != null ? (
                                                    <>
                                                        {Number(h.discountPrice).toLocaleString('ko-KR')}원
                                                        {h.discountRate > 0 && <span style={{ marginLeft: '4px', fontSize: '11px', color: '#e74c3c' }}>({h.discountRate}% 할인)</span>}
                                                    </>
                                                ) : '-'}
                                            </td>
                                            <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{h.appliedStartDt ? h.appliedStartDt.substring(0, 10) : '-'}</td>
                                            <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{h.appliedEndDt ? h.appliedEndDt.substring(0, 10) : '-'}</td>
                                            <td style={{ padding: '10px' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                                                    background: isActive ? 'rgba(46, 204, 113, 0.1)' : 'rgba(149, 165, 166, 0.15)',
                                                    color: isActive ? '#2ecc71' : '#7f8c8d'
                                                }}>
                                                    {isActive ? '사용중' : '종료'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'left' }}>{h.chgRsn || '-'}</td>
                                        </tr>
                                    );
                                })}
                                {payHistory.length === 0 && (
                                    <tr><td colSpan="6" style={{ padding: '20px', color: 'var(--text-secondary)' }}>요금제 변경 이력이 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSysForm;
