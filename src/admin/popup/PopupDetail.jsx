import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CommonCodePicker from '../../components/CommonCodePicker';
import SurveySearchModal from './SurveySearchModal';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { usePopupManage } from './hooks/usePopupManage';
import { apiClient } from '../../utils/apiClient';

const PopupDetail = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const popIdx = new URLSearchParams(routerLocation.search).get('popIdx');
    const mode = popIdx ? 'UPDATE' : 'INSERT';

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();
    const { today, fetchPopupInfo, savePopup, deletePopup, handleFileDelete, handleFileDownload } = usePopupManage(defaultSysId);

    const initialForm = {
        popIdx: '', sysId: defaultSysId, sysSeCd: 'MG', popTitl: '', popCn: '',
        bgngYmd: today, endYmd: today, useYn: 'Y', survId: '', survNm: '', fileGrpId: ''
    };
    const [form, setForm] = useState(initialForm);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [showSurveyModal, setShowSurveyModal] = useState(false);

    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';
    const isStarted = mode === 'UPDATE' && form.bgngYmd && today >= form.bgngYmd;

    useEffect(() => {
        if (mode === 'UPDATE') {
            fetchPopupInfo(popIdx).then(info => {
                if (info) {
                    setForm(info);
                    if (info.fileGrpId) fetchExistingFiles(info.fileGrpId);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [popIdx]);

    const fetchExistingFiles = async (grpId) => {
        const fRes = await apiClient(`/admin/api/comn/file/list/${grpId}?sysId=${defaultSysId}`);
        if (fRes.ok) setExistingFiles(await fRes.json());
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const saved = await savePopup(form, uploadFiles);
        if (saved) {
            setUploadFiles([]);
            if (mode === 'INSERT') navigate(`/admin/popup/write?popIdx=${saved.popIdx}`);
            else fetchPopupInfo(popIdx).then(info => { if (info) setForm(info); });
        }
    };

    const onFileDelete = async (fileSn) => {
        if (delYn !== 'Y') { alert('삭제 권한이 없습니다.'); return; }
        await handleFileDelete(fileSn, form.fileGrpId, setExistingFiles);
    };

    const onDelete = async () => {
        if (delYn !== 'Y') { alert('삭제 권한이 없습니다.'); return; }
        const ok = await deletePopup(form.popIdx);
        if (ok) navigate('/admin/popup');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '팝업 등록' : `팝업 상세 (ID: ${form.popIdx})`}</h2>
                <button onClick={() => navigate('/admin/popup')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">팝업 정보</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {mode === 'UPDATE' && delYn === 'Y' && !isStarted && (
                            <button type="button" onClick={onDelete} className="admin-btn admin-btn-danger">삭제</button>
                        )}
                        {canEdit && !isStarted && (
                            <button type="submit" form="popupForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '등록' : '수정'}</button>
                        )}
                    </div>
                </div>
                <div className="admin-card-body">
                    {isStarted && (
                        <div style={{ background: '#fff3cd', color: '#856404', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px', border: '1px solid #ffeeba' }}>
                            이미 노출이 시작되거나 종료된 팝업은 수정할 수 없습니다. (신규 팝업으로 등록해주세요)
                        </div>
                    )}
                    <form id="popupForm" onSubmit={onSubmit}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">시스템 구분</label>
                            <div className="admin-form-control">
                                <CommonCodePicker grpCd="SYS_SE_CD" type="radio" name="sysSeCd" value={form.sysSeCd} onChange={handleChange} disabled={mode === 'UPDATE' || isStarted} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">노출 기간</label>
                            <div className="admin-form-control">
                                <input type="date" name="bgngYmd" value={form.bgngYmd} onChange={handleChange} className="admin-input" required disabled={isStarted} />
                                <span style={{ margin: '0 5px', color: 'var(--text-secondary)' }}>~</span>
                                <input type="date" name="endYmd" value={form.endYmd} onChange={handleChange} className="admin-input" required disabled={isStarted} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">팝업 제목</label>
                            <div className="admin-form-control">
                                <input name="popTitl" className="admin-input" type="text" value={form.popTitl} onChange={handleChange} required placeholder="팝업 제목을 입력하세요" disabled={isStarted} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">팝업 내용</label>
                            <div className="admin-form-control">
                                <textarea name="popCn" className="admin-textarea" rows="6" value={form.popCn} onChange={handleChange} placeholder="팝업 내용을 입력하세요" disabled={isStarted} />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">설문 매핑</label>
                            <div className="admin-form-control">
                                <input type="text" className="admin-input" value={form.survNm ? `[${form.survId}] ${form.survNm}` : form.survId} placeholder="설문을 선택하세요" readOnly />
                                {!isStarted && (
                                    <>
                                        <button type="button" onClick={() => setShowSurveyModal(true)} className="admin-btn admin-btn-secondary" style={{ whiteSpace: 'nowrap' }}>설문 검색</button>
                                        <button type="button" onClick={() => setForm({ ...form, survId: '', survNm: '' })} className="admin-btn admin-btn-danger" style={{ whiteSpace: 'nowrap' }}>초기화</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">첨부 파일</label>
                            <div className="admin-form-control">
                                <div className="admin-file-box">
                                    {!isStarted && (
                                        <input id="popupFileInput" type="file" multiple onChange={(e) => setUploadFiles(Array.from(e.target.files))} style={{ display: 'block', width: '100%', marginBottom: existingFiles.length > 0 ? '12px' : '0' }} />
                                    )}

                                    {existingFiles.length > 0 && (
                                        <div style={{ padding: '12px', background: 'var(--content-bg)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '12px' }}>[보유 파일 목록 - 클릭 시 다운로드]</span>
                                            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: 'var(--text-primary)' }}>
                                                {existingFiles.map(f => (
                                                    <li key={f.fileSn} style={{ marginBottom: '8px', fontSize: '13px' }}>
                                                        {f.fileOrgnlNm}
                                                        <span onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)}
                                                              style={{ fontSize: '12px', color: '#e67e22', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', margin: '0 10px' }}>다운로드</span>
                                                        {delYn === 'Y' && !isStarted && (
                                                            <button type="button" onClick={() => onFileDelete(f.fileSn)}
                                                                    className="admin-btn admin-btn-danger" style={{ padding: '2px 8px', fontSize: '11px' }}>삭제</button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <label className="admin-form-label">사용 여부</label>
                            <div className="admin-form-control">
                                <CommonCodePicker grpCd="USE_YN" type="radio" name="useYn" value={form.useYn} onChange={handleChange} disabled={isStarted} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {showSurveyModal && (
                <SurveySearchModal
                    sysSeCd={form.sysSeCd}
                    onClose={() => setShowSurveyModal(false)}
                    onSelect={(survey) => {
                        setForm({ ...form, survId: survey.survId, survNm: survey.survNm });
                        setShowSurveyModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default PopupDetail;
