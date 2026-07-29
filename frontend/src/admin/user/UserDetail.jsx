import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import CommonCodePicker from '../../components/CommonCodePicker';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useUserManage } from './hooks/useUserManage';

const UserDetail = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const queryParams = new URLSearchParams(routerLocation.search);
    const userId = queryParams.get('userId');
    const sysSectCd = queryParams.get('sysSectCd') || 'MG';
    const mode = userId ? 'UPDATE' : 'INSERT';
    const isStaff = sysSectCd === 'MG';

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth(MENU_IDS.USER);
    const { sysConfig } = useOutletContext();

    const {
        roleList, fetchUserDetail, saveUser,
        uploadFiles, setUploadFiles, existingFiles, setExistingFiles,
        handleFileDelete
    } = useUserManage(defaultSysId, sysSectCd, inqireYn);

    const initialForm = {
        sysId: defaultSysId, userId: '', pswd: '', userNm: '', athrtyCd: '', userStatCd: 'ACTV',
        email: '', mblTelno: '', zipCd: '', baseAddr: '', dtlAddr: '',
        rgstBgngDt: '', rgstEndDt: '', imgFileSn: null, rmrk: '',
        empNo: '', deptCd: '', positionCd: '', empStatCd: 'ACTV', hireDt: '', resignDt: ''
    };
    const [form, setForm] = useState(initialForm);
    const [pswdConfirm, setPswdConfirm] = useState('');
    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    useEffect(() => {
        if (mode === 'UPDATE') {
            fetchUserDetail(userId).then(info => {
                if (info) {
                    const formatDateTime = (dtStr) => dtStr ? dtStr.substring(0, 10) : '';
                    setForm({
                        ...info,
                        pswd: '',
                        rgstBgngDt: formatDateTime(info.rgstBgngDt),
                        rgstEndDt: formatDateTime(info.rgstEndDt),
                        hireDt: formatDateTime(info.hireDt),
                        resignDt: formatDateTime(info.resignDt)
                    });
                    if (info.imgFileSn) {
                        setExistingFiles([{ fileSn: info.imgFileSn }]);
                    } else {
                        setExistingFiles([]);
                    }
                }
            });
        } else {
            setForm({ ...initialForm, athrtyCd: '' });
            setExistingFiles([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const isPswdMismatch = form.pswd && pswdConfirm && form.pswd !== pswdConfirm;

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onDeleteImage = async (fileSn) => {
        await handleFileDelete(fileSn);
        setForm(prev => ({ ...prev, imgFileSn: null }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (isPswdMismatch) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        const ok = await saveUser(form, uploadFiles);
        if (ok) {
            if (mode === 'INSERT') navigate(`/admin/user/write?sysSectCd=${sysSectCd}&userId=${form.userId}`);
            else navigate(`/admin/user?sysSectCd=${sysSectCd}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '회원 신규 등록' : '회원 상세'}</h2>
                <button onClick={() => navigate('/admin/user')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">회원 정보</span>
                    {canEdit && <button type="submit" form="userForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '신규 회원 등록' : '회원 정보 수정'}</button>}
                </div>
                <div className="admin-card-body">
                    <form id="userForm" onSubmit={onSubmit}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">아이디 *</label>
                            <div className="admin-form-control">
                                <input type="text" name="userId" className="admin-input" placeholder="아이디" value={form.userId} onChange={handleFormChange} required disabled={mode === 'UPDATE'} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">비밀번호 *</label>
                            <div className="admin-form-control">
                                <input type="password" name="pswd" className="admin-input" placeholder={mode === 'UPDATE' ? "변경시에만 입력 (기존유지)" : "비밀번호 입력"} value={form.pswd} onChange={handleFormChange} required={mode === 'INSERT'} disabled={!canEdit} style={isPswdMismatch ? { backgroundColor: '#fdecea' } : {}} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">비밀번호 확인 *</label>
                            <div className="admin-form-control">
                                <input type="password" placeholder="비밀번호 재입력" className="admin-input" value={pswdConfirm} onChange={(e) => setPswdConfirm(e.target.value)} required={!!form.pswd} disabled={!canEdit} style={isPswdMismatch ? { backgroundColor: '#fdecea' } : {}} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">이름 *</label>
                            <div className="admin-form-control">
                                <input type="text" name="userNm" className="admin-input" placeholder="이름" value={form.userNm} onChange={handleFormChange} required disabled={!canEdit} />
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">이미지 파일</label>
                            <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                {existingFiles && existingFiles.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                        {existingFiles.map(f => (
                                            <div key={f.fileSn} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <img
                                                    src={`/admin/api/comn/file/download/${f.fileSn}`}
                                                    alt="프로필 이미지"
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                                />
                                                {canEdit && (
                                                    <button type="button" onClick={() => onDeleteImage(f.fileSn)} className="admin-btn admin-btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>삭제</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {canEdit && (
                                    <input type="file" accept="image/*" onChange={(e) => setUploadFiles(Array.from(e.target.files))} />
                                )}
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">인적 정보</label>
                            <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                                <input type="email" name="email" className="admin-input" placeholder="이메일 주소" value={form.email || ''} onChange={handleFormChange} disabled={!canEdit} />
                                <input type="text" name="mblTelno" className="admin-input" placeholder="휴대전화 번호" value={form.mblTelno || ''} onChange={handleFormChange} disabled={!canEdit} />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" name="zipCd" className="admin-input" placeholder="우편번호" value={form.zipCd || ''} onChange={handleFormChange} style={{ width: '120px' }} disabled={!canEdit} />
                                    <input type="text" name="baseAddr" className="admin-input" placeholder="기본 주소" value={form.baseAddr || ''} onChange={handleFormChange} style={{ flex: 1 }} disabled={!canEdit} />
                                </div>
                                <input type="text" name="dtlAddr" className="admin-input" placeholder="상세 주소" value={form.dtlAddr || ''} onChange={handleFormChange} disabled={!canEdit} />
                            </div>
                        </div>

                        {!isStaff && (
                            <div className="admin-form-row">
                                <label className="admin-form-label">등록 기간</label>
                                <div className="admin-form-control">
                                    <input type="date" name="rgstBgngDt" className="admin-input" value={form.rgstBgngDt || ''} onChange={handleFormChange} disabled={!canEdit} />
                                    <span>~</span>
                                    <input type="date" name="rgstEndDt" className="admin-input" value={form.rgstEndDt || ''} onChange={handleFormChange} disabled={!canEdit} />
                                </div>
                            </div>
                        )}

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">비고</label>
                            <div className="admin-form-control" style={{ background: '#fff' }}>
                                <ReactQuill
                                    theme="snow"
                                    value={form.rmrk || ''}
                                    onChange={val => setForm({ ...form, rmrk: val })}
                                    readOnly={!canEdit}
                                    style={{ height: '200px', marginBottom: '40px', width: '100%' }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: '16px' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">권한 및 {isStaff ? '직원 정보' : '상태'}</span>
                </div>
                <div className="admin-card-body">
                    <div className="admin-form-row">
                        <label className="admin-form-label">권한 *</label>
                        <div className="admin-form-control">
                            <select form="userForm" name="athrtyCd" className="admin-input" value={form.athrtyCd} onChange={handleFormChange} required disabled={!canEdit}>
                                <option value="">권한 선택</option>
                                {roleList.map(role => (
                                    <option key={role.athrtyComCd} value={role.athrtyComCd}>{role.athrtyNm}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <label className="admin-form-label">상태</label>
                        <div className="admin-form-control">
                            {isStaff ? (
                                <CommonCodePicker grpCd="EMP_STAT_CD" type="select" name="empStatCd" value={form.empStatCd} onChange={handleFormChange} disabled={!canEdit} />
                            ) : (
                                <CommonCodePicker grpCd="USER_STAT_CD" type="select" name="userStatCd" value={form.userStatCd} onChange={handleFormChange} disabled={!canEdit} />
                            )}
                        </div>
                    </div>

                    {isStaff && (
                        <>
                            <div className="admin-form-row">
                                <label className="admin-form-label">사번</label>
                                <div className="admin-form-control">
                                    <input type="text" name="empNo" className="admin-input" placeholder="비워두면 자동 생성됩니다" value={form.empNo || ''} onChange={handleFormChange} disabled={!canEdit} />
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label className="admin-form-label">부서</label>
                                <div className="admin-form-control">
                                    <CommonCodePicker grpCd="DEPT_CD" uprComCd={sysConfig?.deptSchemeCd} type="select" name="deptCd" value={form.deptCd} onChange={handleFormChange} defaultOption="부서 선택" disabled={!canEdit} />
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label className="admin-form-label">직급</label>
                                <div className="admin-form-control">
                                    <CommonCodePicker grpCd="POSITION_CD" uprComCd={sysConfig?.positionSchemeCd} type="select" name="positionCd" value={form.positionCd} onChange={handleFormChange} defaultOption="직급 선택" disabled={!canEdit} />
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label className="admin-form-label">입사/퇴사일</label>
                                <div className="admin-form-control">
                                    <input type="date" form="userForm" name="hireDt" className="admin-input" value={form.hireDt || ''} onChange={handleFormChange} disabled={!canEdit} />
                                    <span>~</span>
                                    <input type="date" form="userForm" name="resignDt" className="admin-input" value={form.resignDt || ''} onChange={handleFormChange} disabled={!canEdit} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
