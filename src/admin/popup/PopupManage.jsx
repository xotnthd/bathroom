import React, { useState, useEffect } from 'react';
import CommonCodePicker from '../../components/CommonCodePicker';
import SurveySearchModal from './SurveySearchModal';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { usePopupManage } from './hooks/usePopupManage';
import PopupModal from './components/PopupModal';

const PopupManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    const {
        today,
        searchForm, setSearchForm, initialSearch,
        popupList, fetchPopupList,
        savePopup, deletePopup,
        handleFileDelete, handleFileDownload
    } = usePopupManage(defaultSysId);

    const [modal, setModal] = useState({ isOpen: false, mode: 'INSERT' });
    const [showSurveyModal, setShowSurveyModal] = useState(false);

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
        survNm: '',
        fileGrpId: ''
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchPopupList(initialSearch);
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다.');
        }
    }, [inqireYn, fetchPopupList]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (inqireYn !== 'Y') {
            alert('조회 권한이 없습니다.');
            return;
        }
        fetchPopupList(searchForm);
    };

    const handleSearchReset = () => {
        setSearchForm(initialSearch);
        fetchPopupList(initialSearch);
    };

    const handleOpenInsert = () => {
        setFormData({
            ...initialForm,
            // 검색 조건의 sysSeCd 값이 있으면 등록 폼에 기본값으로 설정
            sysSeCd: searchForm.searchSysSeCd || 'MG' 
        });
        setModal({ isOpen: true, mode: 'INSERT' });
    };

    const handleRowClick = (item) => {
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
            survNm: item.survNm || '',
            fileGrpId: item.fileGrpId || ''
        });
        setModal({ isOpen: true, mode: 'UPDATE' });
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>

            {/* 상단 검색 섹션 */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', justifyContent: 'flex-start', gap: '24px' }}>
                    <span className="admin-card-title">팝업 관리</span>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>시스템 구분:</span>
                        <CommonCodePicker
                            grpCd="SYS_SE_CD"
                            type="radio"
                            name="searchSysSeCd"
                            value={searchForm.searchSysSeCd}
                            onChange={(e) => {
                                const newForm = {...searchForm, searchSysSeCd: e.target.value};
                                setSearchForm(newForm);
                                fetchPopupList(newForm);
                            }}
                        />
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 8px' }}></div>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>노출 기간:</span>
                        <input type="date" value={searchForm.searchStDate} onChange={(e) => setSearchForm({...searchForm, searchStDate: e.target.value})} style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--content-bg)', color: 'var(--text-primary)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>~</span>
                        <input type="date" value={searchForm.searchEdDate} onChange={(e) => setSearchForm({...searchForm, searchEdDate: e.target.value})} style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--content-bg)', color: 'var(--text-primary)' }} />

                        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleSearchReset} className="admin-btn admin-btn-secondary">초기화</button>
                    </form>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="admin-card" style={{ flex: 1 }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">팝업 목록</span>
                    {rgstYn === 'Y' && <button onClick={handleOpenInsert} className="admin-btn admin-btn-success">신규 등록</button>}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        <thead>
                            <tr style={{ background: 'var(--table-header-bg)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px', width: '5%', textAlign: 'center' }}>ID</th>
                                <th style={{ padding: '10px', width: '8%', textAlign: 'center' }}>구분</th>
                                <th style={{ padding: '10px', width: '30%', textAlign: 'center' }}>팝업 제목</th>
                                <th style={{ padding: '10px', width: '12%', textAlign: 'center' }}>노출 기간</th>
                                <th style={{ padding: '10px', width: '15%', textAlign: 'center' }}>매핑된 설문</th>
                                <th style={{ padding: '10px', width: '6%', textAlign: 'center' }}>첨부파일</th>
                                <th style={{ padding: '10px', width: '6%', textAlign: 'center' }}>사용 여부</th>
                                <th style={{ padding: '10px', width: '8%', textAlign: 'center' }}>등록자</th>
                                <th style={{ padding: '10px', width: '10%', textAlign: 'center' }}>등록일자</th>
                            </tr>
                        </thead>
                        <tbody>
                        {popupList.map(item => (
                            <tr
                                key={item.popIdx}
                                onClick={() => handleRowClick(item)}
                                style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', height: '48px' }}
                            >
                                <td style={{ padding: '4px 10px' }}>{item.popIdx}</td>
                                <td style={{ padding: '4px 10px' }}>
                                    <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                        {item.sysSeCd === 'US' ? '사용자' : '관리자'}
                                    </span>
                                </td>
                                <td style={{ padding: '4px 10px', textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-all' }}>
                                    <div style={{ color: 'var(--text-primary)' }} title={item.popTitl}>{truncateText(item.popTitl, 23)}</div>
                                </td>
                                <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{item.bgngYmd} ~ {item.endYmd}</td>
                                <td style={{ padding: '4px 10px', textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-all', lineHeight: '1.4' }}>
                                    {item.survNm ? (
                                        <div style={{ color: 'var(--text-primary)' }} title={item.survNm}>
                                            {truncateText(item.survNm, 23)}<br/>
                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>[{item.survId}]</span>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--text-secondary)' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '4px 10px' }}>{item.fileGrpId ? 'O' : '-'}</td>
                                <td style={{ padding: '4px 10px' }}>
                                    <span style={{ 
                                        padding: '4px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                                        background: item.useYn === 'Y' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                        color: item.useYn === 'Y' ? '#2ecc71' : '#e74c3c'
                                    }}>
                                        {item.useYn === 'Y' ? '사용' : '미사용'}
                                    </span>
                                </td>
                                <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{item.frstRgstrId || '-'}</td>
                                <td style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}>{item.frstRegDt ? item.frstRegDt.substring(0, 10) : '-'}</td>
                            </tr>
                        ))}
                        {popupList.length === 0 && (
                            <tr><td colSpan="9" style={{ padding: '40px', color: 'var(--text-secondary)' }}>등록된 팝업이 없습니다.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PopupModal 
                isOpen={modal.isOpen} 
                onClose={() => setModal({ ...modal, isOpen: false })} 
                mode={modal.mode}
                formData={formData}
                setFormData={setFormData}
                handleSave={savePopup}
                handleDelete={deletePopup}
                handleFileDelete={handleFileDelete}
                handleFileDownload={handleFileDownload}
                delYn={delYn}
                mdfcnYn={mdfcnYn}
                rgstYn={rgstYn}
                defaultSysId={defaultSysId}
                setShowSurveyModal={setShowSurveyModal}
            />

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
