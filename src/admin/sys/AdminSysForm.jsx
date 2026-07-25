import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import CommonCodePicker from '../../components/CommonCodePicker';
import CommonCodePreview from '../../components/CommonCodePreview';

const AdminSysForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sysId = queryParams.get('sysId');
    const mode = sysId ? 'EDIT' : 'CREATE';
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        sysId: '', sysNm: '', useYn: 'Y', serviceBgnde: today, serviceEndde: '',
        adminThemeCd: 'MODERN', userThemeCd: 'MODERN', logoFileGrpId: '', positionSchemeCd: '', deptSchemeCd: '', planCd: '',
        masterId: '', masterPw: '', masterNm: '', masterEmail: ''
    });
    const [logoFiles, setLogoFiles] = useState(null);
    const [existingLogo, setExistingLogo] = useState(null);
    const [idCheckStatus, setIdCheckStatus] = useState('NONE'); // NONE, SUCCESS, FAIL

    // 요금제(권한코드 템플릿) 목록 - 신규 생성 시에만 선택
    const [planList, setPlanList] = useState([]);

    useEffect(() => {
        if (mode === 'CREATE') {
            fetchPlanList();
        }

        if (mode === 'EDIT' && sysId) {
            fetchSystemDetail(sysId);
        } else {
            // 초기화
            setLogoFiles(null);
            setExistingLogo(null);
            setIdCheckStatus('NONE');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, sysId]);

    const fetchPlanList = async () => {
        const res = await apiClient('/admin/api/auth-template/plan/list', { method: 'POST' });
        if (res.ok) setPlanList(await res.json());
    };

    const fetchSystemDetail = async (id) => {
        const res = await apiClient(`/admin/api/sys/detail/${id}`);
        if (res.ok) {
            const data = await res.json();
            setFormData(data);

            if (data.logoFileGrpId) {
                const fRes = await apiClient(`/admin/api/comn/file/list/${data.logoFileGrpId}?sysId=${id}`);
                if (fRes.ok) {
                    const files = await fRes.json();
                    setExistingLogo(files.length > 0 ? files[0] : null);
                }
            } else {
                setExistingLogo(null);
            }
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

    const handleSave = async () => {
        if (!formData.sysId) return alert("System ID를 입력하세요.");
        if (!formData.sysNm) return alert("시스템 명칭을 입력하세요.");

        if (mode === 'CREATE') {
            if (idCheckStatus !== 'SUCCESS') return alert("ID 중복 확인을 해주세요.");
            if (!formData.masterPw) return alert("마스터 계정 비밀번호를 입력하세요.");
            if (!formData.masterNm) return alert("마스터 계정 이름을 입력하세요.");
            if (!formData.planCd) return alert("요금제를 선택하세요.");
        }

        const payload = new FormData();
        payload.append('sysData', JSON.stringify(formData));
        if (logoFiles && logoFiles.length > 0) {
            payload.append('logoFiles', logoFiles[0]);
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
            alert('요청에 실패했습니다.');
        }
    };

    const handleCancel = () => {
        navigate('/admin/sys');
    };

    return (
        <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>{mode === 'CREATE' ? '신규 시스템 프로비저닝(생성)' : '시스템 설정 상세'}</h3>
                <button onClick={handleCancel} style={{ padding: '5px 10px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>목록으로</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>System ID</label>
                        <input type="text" value={formData.sysId} onChange={e => {setFormData({...formData, sysId: e.target.value}); setIdCheckStatus('NONE');}} readOnly={mode === 'EDIT'} placeholder="예) CP01" style={{ width: '100%', padding: '8px', background: mode === 'EDIT' ? '#f1f1f1' : '#fff', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>시스템 명칭</label>
                        <input type="text" value={formData.sysNm} onChange={e => setFormData({...formData, sysNm: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                </div>

                {mode === 'CREATE' && (
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>요금제</label>
                        <select value={formData.planCd} onChange={e => setFormData({...formData, planCd: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value="">요금제 선택</option>
                            {planList.map(p => (
                                <option key={p.planCd} value={p.planCd}>{p.planNm} ({p.planCd})</option>
                            ))}
                        </select>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '5px', marginBottom: 0 }}>
                            * 선택한 요금제의 부서/역할/메뉴 권한 구조(권한코드 템플릿 관리에서 설정)가 그대로 복제됩니다. 마스터 계정(A001)의 메뉴 권한도 여기서 자동으로 결정됩니다.
                        </p>
                    </div>
                )}

                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#34495e' }}>마스터 계정 정보</h4>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>마스터 ID</label>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input type="text" value={formData.masterId || ''} onChange={e => {setFormData({...formData, masterId: e.target.value}); setIdCheckStatus('NONE');}} readOnly={mode === 'EDIT'} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', background: mode === 'EDIT' ? '#e9ecef' : '#fff' }} />
                                {mode === 'CREATE' && (
                                    <button onClick={handleIdCheck} style={{ padding: '0 15px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>중복확인</button>
                                )}
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>비밀번호 {mode === 'EDIT' && '(변경시에만 입력)'}</label>
                            <input type="password" value={formData.masterPw || ''} onChange={e => setFormData({...formData, masterPw: e.target.value})} placeholder={mode === 'EDIT' ? "변경할 비밀번호 입력" : ""} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>관리자 이름</label>
                            <input type="text" value={formData.masterNm || ''} onChange={e => setFormData({...formData, masterNm: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>이메일</label>
                            <input type="email" value={formData.masterEmail || ''} onChange={e => setFormData({...formData, masterEmail: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>사용 여부</label>
                    <select value={formData.useYn} onChange={e => setFormData({...formData, useYn: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <option value="Y">사용 (Y)</option>
                        <option value="N">미사용 (N)</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>서비스 시작일</label>
                        <input type="date" value={formData.serviceBgnde || ''} onChange={e => setFormData({...formData, serviceBgnde: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>서비스 종료일</label>
                        <input type="date" value={formData.serviceEndde || ''} onChange={e => setFormData({...formData, serviceEndde: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>관리자 디자인 테마</label>
                        <select value={formData.adminThemeCd || 'MODERN'} onChange={e => setFormData({...formData, adminThemeCd: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value="MODERN">모던 미니멀리스트 (Modern Minimalist)</option>
                            <option value="GLASS">글래스모피즘 (Glassmorphism)</option>
                            <option value="DARK">다크 모드 (Sleek Dark)</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>사용자 디자인 테마</label>
                        <select value={formData.userThemeCd || 'MODERN'} onChange={e => setFormData({...formData, userThemeCd: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value="MODERN">모던 미니멀리스트 (Modern Minimalist)</option>
                            <option value="GLASS">글래스모피즘 (Glassmorphism)</option>
                            <option value="DARK">다크 모드 (Sleek Dark)</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>부서 체계</label>
                        <CommonCodePicker
                            grpCd="DEPT_CD"
                            uprComCd="ROOT"
                            type="select"
                            name="deptSchemeCd"
                            value={formData.deptSchemeCd}
                            onChange={e => setFormData({ ...formData, deptSchemeCd: e.target.value })}
                            defaultOption="부서 체계 선택"
                        />
                        <div style={{ marginTop: '8px' }}>
                            <CommonCodePreview grpCd="DEPT_CD" uprComCd={formData.deptSchemeCd} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '5px', marginBottom: 0 }}>
                            * 선택한 체계에 속한 부서들이 직원 관리 화면의 "부서" 드롭다운에 노출됩니다. 체계/부서 항목은 공통코드 관리(DEPT_CD)에서 추가·수정할 수 있습니다.
                        </p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>직급 체계</label>
                        <CommonCodePicker
                            grpCd="POSITION_CD"
                            uprComCd="ROOT"
                            type="select"
                            name="positionSchemeCd"
                            value={formData.positionSchemeCd}
                            onChange={e => setFormData({ ...formData, positionSchemeCd: e.target.value })}
                            defaultOption="직급 체계 선택"
                        />
                        <div style={{ marginTop: '8px' }}>
                            <CommonCodePreview grpCd="POSITION_CD" uprComCd={formData.positionSchemeCd} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '5px', marginBottom: 0 }}>
                            * 선택한 체계에 속한 직급들이 직원 관리 화면의 "직급" 드롭다운에 노출됩니다. 체계/직급 항목은 공통코드 관리(POSITION_CD)에서 추가·수정할 수 있습니다.
                        </p>
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>서비스 로고 이미지</label>
                    {existingLogo && mode === 'EDIT' && (
                        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={`/admin/api/comn/file/download/${existingLogo.fileSn}`} alt="logo" style={{ height: '50px', border: '1px solid #ddd', borderRadius: '4px', padding: '2px' }} />
                            <span style={{ fontSize: '12px', color: '#555' }}>현재 등록된 로고</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={e => setLogoFiles(e.target.files)} style={{ width: '100%', padding: '8px', border: '1px dashed #aaa', borderRadius: '4px' }} />
                </div>

                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <button onClick={handleSave} style={{ padding: '10px 20px', background: mode === 'CREATE' ? '#2980b9' : '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {mode === 'CREATE' ? '시스템 생성' : '수정'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSysForm;
