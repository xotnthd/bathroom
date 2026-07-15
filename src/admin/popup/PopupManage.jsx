import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import CommonCodePicker from '../../components/CommonCodePicker';
import SurveySearchModal from './SurveySearchModal';
import { useMenuAuth } from '../hooks/useMenuAuth';

const PopupManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();
    const today = new Date().toISOString().split('T')[0];

    // --- 등�단 검색확인�태 ---
    const initialSearch = { searchSysSeCd: '', searchStDate: '', searchEdDate: '' };
    const [searchForm, setSearchForm] = useState(initialSearch);

    // --- 등�록/등�정 확인�태 ---
    const initialForm = {
        popIdx: '',
        sysId: defaultSysId,
        sysSeCd: 'MG',
        popTitl: '',
        popCn: '',
        bgngYmd: today,
        endYmd: today,
        useYn: 'Y',
        survId: '',
        survNm: '', // 등�택확인�문 등�목 등�시삭제
        fileGrpId: ''
    };
    const [formData, setFormData] = useState(initialForm);
    const [popupList, setPopupList] = useState([]);
    const [showSurveyModal, setShowSurveyModal] = useState(false);

    // --- 등�일 등�들�삭제�태 ---
    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [surveyList, setSurveyList] = useState([]);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchPopupList(initialSearch);
        } else if (inqireYn === 'N') {
            alert('조회 권한명삭제�습등�다. 관리자등�게 문의등�세삭제');
        }
    }, [inqireYn]);

    // fetchSurveys 삭제��삭제(모달등�서 직접 등�출)

    // 등�� 등�업 리스삭제조회 (검색조건 등�함)
    const fetchPopupList = async (searchParams) => {
        try {
            const query = new URLSearchParams({ sysId: defaultSysId, ...searchParams }).toString();
            const res = await apiClient(`/admin/api/popup/list취소${query}`);
            if (res.ok) setPopupList(await res.json());
        } catch (error) {
            console.error("등�업 리스삭제조회 등�러", error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (inqireYn !== 'Y') {
            alert('조회 권한명삭제�습등�다.');
            return;
        }
        fetchPopupList(searchForm);
    };

    const handleSearchReset = () => {
        setSearchForm(initialSearch);
        fetchPopupList(initialSearch);
    };

    // 등�� 목록등�서 등�세 등�릭 (등�정 모드 진입)
    const handleRowClick = async (item) => {
        setFormData({
            popIdx: item.popIdx,
            sysId: defaultSysId,
            sysSeCd: item.sysSeCd,
            popTitl: item.popTitl,
            popCn: item.popCn || '',
            bgngYmd: item.bgngYmd,
            endYmd: item.endYmd,
            useYn: item.useYn,
            survId: item.survId || '',
            survNm: item.survNm || '', // 백엔등�에삭제쪼인등�서 주거확인�으�등ID�삭제�시
            fileGrpId: item.fileGrpId || ''
        });

        setUploadFiles([]);
        setExistingFiles([]);
        const fileInput = document.getElementById("popupFileInput");
        if(fileInput) fileInput.value = "";

        // 등�록확인�일 목록 불러등�기
        if (item.fileGrpId) {
            const fRes = await apiClient(`/admin/api/comn/file/list/${item.fileGrpId}?sysId=${defaultSysId}`);
            if (fRes.ok) setExistingFiles(await fRes.json());
        }
    };

    const handleResetForm = () => {
        setFormData({
            popIdx: '', sysSeCd: 'MG', popTitl: '', popCn: '', bgngYmd: today, endYmd: today, useYn: 'Y', survId: '', survNm: '', fileGrpId: ''
        });
        setUploadFiles([]);
        setExistingFiles([]);
        const fileInput = document.getElementById("popupFileInput");
        if(fileInput) fileInput.value = "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setUploadFiles(Array.from(e.target.files));
    };

    // 등���삭제�면등�서 등�세 등�릭 등정보이확인�로확인�일 삭제�� 처리
    const handleFileDelete = async (fileSn) => {
        if (delYn !== 'Y') { alert('권한명삭제�습등�다.'); return; }
        if (!window.confirm("등�일삭제즉시 삭제��등�시겠습등�까등")) return;
        const res = await apiClient(`/admin/api/comn/file/delete/${fileSn}`, { method: 'DELETE' });
        if (res.ok) {
            // 삭제�� 등항목록 바로 갱신
            const fRes = await apiClient(`/admin/api/comn/file/list/${formData.fileGrpId}?sysId=${defaultSysId}`);
            if (fRes.ok) setExistingFiles(await fRes.json());
        }
    };

    const handleFileDownload = async (fileSn, originalName) => {
        try {
            const res = await apiClient(`/admin/api/comn/file/download/${fileSn}`, { method: 'GET' });
            if (!res.ok) return alert("등�일 등�운로드 등�패");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) { alert("등�운로드 등�류"); }
    };

    // 등�� 등�규/등�정 등�합 등�삭제로직
    const handleSave = async (e) => {
        e.preventDefault();
        if (formData.popIdx ? (mdfcnYn !== 'Y') : (rgstYn !== 'Y')) {
            alert("등�삭제권한명삭제�습등�다.");
            return;
        }
        if (formData.bgngYmd > formData.endYmd) return alert("종료등�이 등�작등�보삭제빠�등 확인�습등�다.");

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            // [등�류 방�등 등�심] popIdx가 비어등�다�삭제�예 등�송등��등 등�아삭제백엔확인��등록�러�삭제�천 차단
            if (key === 'popIdx' && !formData[key]) return;
            submitData.append(key, formData[key] || '');
        });

        uploadFiles.forEach(file => { submitData.append('files', file); });

        try {
            const res = await apiClient('/admin/api/popup/save', {
                method: 'POST',
                body: submitData
            });

            if (res.ok) {
                alert(formData.popIdx ? "등�업확인�정등�었등�니삭제" : "확인�업확인�록등�었등�니삭제");
                handleResetForm();
                fetchPopupList(searchForm); // 등�재 검색조건 등��삭제�며 갱신
            }
        } catch (error) {
            console.error("등�업 등�확인�러", error);
            alert("등�삭제�삭제�스확인�러가 발생등�습등�다.");
        }
    };

    const handleDelete = async () => {
        if (delYn !== 'Y') { alert('권한명삭제�습등�다.'); return; }
        if (!window.confirm("등�말 확인�업등록��등�시겠습등�까등")) return;
        try {
            const res = await apiClient(`/admin/api/popup/delete/${formData.popIdx}`, { method: 'DELETE' });
            if (res.ok) {
                alert("삭제��등�었등�니삭제");
                handleResetForm();
                fetchPopupList(searchForm);
            }
        } catch (error) {
            console.error("등�업 삭제�� 등�러", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>

            {/* ======================= 등�단: 등�합 검색삭제======================= */}
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>등�� 등�업 등�터:</span>

                    {/* 등�스확인�역 검색(공통코드 컴포등�트 등�용) */}
                    <div style={{ width: '180px' }}>
                        <CommonCodePicker
                            grpCd="SYS_SE_CD"
                            type="select"
                            name="searchSysSeCd"
                            value={searchForm.searchSysSeCd}
                            onChange={(e) => setSearchForm({...searchForm, searchSysSeCd: e.target.value})}
                            defaultOption="등�체 등�스삭제구분"
                        />
                    </div>

                    {/* 기간 검색*/}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input type="date" value={searchForm.searchStDate} onChange={(e) => setSearchForm({...searchForm, searchStDate: e.target.value})} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <span>~</span>
                        <input type="date" value={searchForm.searchEdDate} onChange={(e) => setSearchForm({...searchForm, searchEdDate: e.target.value})} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>

                    <button type="submit" style={{ padding: '6px 15px', background: '#2c3e50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>검색</button>
                    <button type="button" onClick={handleSearchReset} style={{ padding: '6px 15px', background: '#ecf0f1', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>검색</button>
                </form>
            </div>

            {/* ======================= 등�단: 삭제& 리스확인�역 ======================= */}
            <div style={{ display: 'flex', gap: '1.2rem', flex: 1, minHeight: 0 }}>

                {/* 좌측: 등�록/등�정 삭제*/}
                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>
                        <h4 style={{ margin: 0 }}>
                            {formData.popIdx ? `등�업 등�정 (ID: ${formData.popIdx})` : '확인�업 등�록'}
                        </h4>
                        <button onClick={handleResetForm} style={{ padding: '5px 10px', cursor: 'pointer', background: '#ecf0f1', border: '1px solid #bdc3c7', borderRadius: '4px' }}>
                            등�로 등�성
                        </button>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ width: '100px', fontWeight: 'bold' }}>등�스삭제구분</label>
                            <CommonCodePicker grpCd="SYS_SE_CD" type="radio" name="sysSeCd" value={formData.sysSeCd} onChange={handleChange} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ width: '100px', fontWeight: 'bold' }}>등�출 기간</label>
                            <input type="date" name="bgngYmd" value={formData.bgngYmd} onChange={handleChange} style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} required />
                            <span style={{ margin: '0 10px' }}>~</span>
                            <input type="date" name="endYmd" value={formData.endYmd} onChange={handleChange} style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }} required />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ width: '100px', fontWeight: 'bold' }}>등�업 등�목</label>
                            <input name="popTitl" style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} type="text" value={formData.popTitl} onChange={handleChange} required />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <label style={{ width: '100px', fontWeight: 'bold', paddingTop: '8px' }}>등�업 등�용</label>
                            <textarea name="popCn" style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} rows="6" value={formData.popCn} onChange={handleChange} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ width: '100px', fontWeight: 'bold' }}>등�문 매핑</label>
                            <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
                                <input type="text" value={formData.survNm ? `[${formData.survId}] ${formData.survNm}` : formData.survId} placeholder="설문을 선택하세요" readOnly style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#f9f9f9' }} />
                                <button type="button" onClick={() => setShowSurveyModal(true)} style={{ padding: '8px 16px', background: '#8e44ad', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>검색</button>
                                <button type="button" onClick={() => setFormData({...formData, survId: '', survNm: ''})} style={{ padding: '8px 16px', background: '#bdc3c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>초기화</button>
                            </div>
                        </div>

                        {/* 등�일 등�로확인�어 등�역 */}
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <label style={{ width: '100px', fontWeight: 'bold', paddingTop: '8px' }}>첨�등 등�일</label>
                            <div style={{ flex: 1, background: '#fff8f0', padding: '10px', borderRadius: '4px', border: '1px solid #f39c12', fontSize: '12px' }}>
                                <input id="popupFileInput" type="file" multiple onChange={handleFileChange} style={{ display: 'block', width: '100%' }} />

                                {existingFiles.length > 0 && (
                                    <div style={{ marginTop: '10px', padding: '8px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#2980b9' }}>[보�등록�일 목록 - 등�릭 등록�� 가삭제</span>
                                        <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', color: '#333' }}>
                                            {existingFiles.map(f => (
                                                <li key={f.fileSn} style={{ marginBottom: '5px', fontSize: '12px' }}>
                                                    {f.fileOrgnlNm}
                                                    <span onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)}
                                                          style={{ fontSize: '11px', color: '#e67e22', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', margin: '0 10px' }}>등�� 등�운로드</span>
                                                    {delYn === 'Y' && (
                                                        <button type="button" onClick={() => handleFileDelete(f.fileSn)}
                                                                style={{ fontSize: '10px', background: '#ff7675', border: 'none', color: '#fff', cursor: 'pointer' }}>검색</button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ width: '100px', fontWeight: 'bold' }}>등�용 등��등</label>
                            <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
                                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <input type="radio" name="useYn" value="Y" checked={formData.useYn === 'Y'} onChange={handleChange} /> 등�용 (Y)
                                </label>
                                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <input type="radio" name="useYn" value="N" checked={formData.useYn === 'N'} onChange={handleChange} /> 미사용(N)
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            {((!formData.popIdx && rgstYn === 'Y') || (formData.popIdx && mdfcnYn === 'Y')) && (
                                <button type="submit" style={{ flex: 1, padding: '12px', background: '#2c3e50', color: '#fff', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                                    {formData.popIdx ? '옵션1' : '확인�업 등�록'}
                                </button>
                            )}
                            {formData.popIdx && delYn === 'Y' && (
                                <button type="button" onClick={handleDelete} style={{ flex: 1, padding: '12px', background: '#e74c3c', color: '#fff', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                                    삭제��
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 등�측: 등�업 리스삭제*/}
                <div style={{ flex: 1.5, background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginTop: 0, borderBottom: '2px solid #2c3e50', paddingBottom: '10px', margin: 0 }}>등�록확인�업 목록 (등�릭등�여 등�세 조회/등�일 삭제��)</h4>

                    <div style={{ flex: 1, overflowY: 'auto', marginTop: '15px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#ecf0f1' }}>
                            <tr>
                                <th style={{ padding: '12px', borderBottom: '1px solid #bdc3c7' }}>ID</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #bdc3c7' }}>등�목</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #bdc3c7' }}>등�출 기간</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #bdc3c7' }}>등�일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {popupList.map(item => (
                                <tr
                                    key={item.popIdx}
                                    onClick={() => handleRowClick(item)}
                                    style={{ borderBottom: '1px solid #eee', cursor: 'pointer', background: formData.popIdx === item.popIdx ? '#f5f5f5' : 'none' }}
                                >
                                    <td style={{ padding: '12px' }}>{item.popIdx}</td>
                                    <td style={{ padding: '12px', textAlign: 'left' }}>
                                        <div style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '12px' }}>
                                            [{item.sysSeCd === 'US' ? '옵션1' : '관리자'}]
                                        </div>
                                        {item.popTitl}
                                    </td>
                                    <td style={{ padding: '12px' }}>{item.bgngYmd} <br/>~ {item.endYmd}</td>
                                    <td style={{ padding: '12px' }}>{item.fileGrpId ? '취소��' : '-'}</td>
                                </tr>
                            ))}
                            {popupList.length === 0 && (
                                <tr><td colSpan="4" style={{ padding: '30px', color: '#7f8c8d' }}>등�록확인�업확인�습등�다.</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showSurveyModal && (
                <SurveySearchModal 
                    sysSeCd={formData.sysSeCd}
                    onClose={() => setShowSurveyModal(false)}
                    onSelect={(survey) => {
                        setFormData({ ...formData, survId: survey.survId, survNm: survey.survNm });
                        setShowSurveyModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default PopupManage;
