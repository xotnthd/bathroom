import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminMain() {
    // 고정 사용자 ID (등록자/수정자용 세션 대용)
    const userId = 'admin_user';

    // --- 1. 상태 정의 (마스터 & 상세 목록) ---
    const [masterList, setMasterList] = useState([]);
    const [detailList, setDetailList] = useState([]);

    // --- 2. 선택된 Key 상태 (조회 및 수정 기준) ---
    const [selectedMasterCd, setSelectedMasterCd] = useState(''); // 선택된 부모 코드
    const [selectedDetailCd, setSelectedDetailCd] = useState(''); // 선택된 자식 코드

    // --- 3. 입력 폼 상태 (마스터용) ---
    const [mComCd, setMComCd] = useState('');
    const [mCdNm, setMCdNm] = useState('');
    const [mCdExpl, setMCdExpl] = useState('');

    // --- 4. 입력 폼 상태 (상세용) ---
    const [dComCd, setDComCd] = useState('');
    const [dCdNm, setDCdNm] = useState('');
    const [dCdExpl, setDCdExpl] = useState('');
    const [dUseYn, setDUseYn] = useState('Y');

    // ==========================================
    // API 요청부 (마스터 & 상세 연동 조회)
    // ==========================================

    // 마스터 전체 조회
    const fetchMasterList = () => {
        axios.get('http://localhost:8080/api/admin/menu/codes/master')
            .then(res => { if (Array.isArray(res.data)) setMasterList(res.data); })
            .catch(err => console.error('마스터 조회 실패:', err));
    };

    // 특정 마스터에 종속된 상세 리스트 조회
    const fetchDetailList = (uprComCd) => {
        axios.get(`http://localhost:8080/api/admin/menu/codes/detail?uprComCd=${uprComCd}`)
            .then(res => { if (Array.isArray(res.data)) setDetailList(res.data); })
            .catch(err => console.error('상세 조회 실패:', err));
    };

    useEffect(() => {
        fetchMasterList();
    }, []);

    // ==========================================
    // 마스터(TN_COM_C001) C.U.R.D 핸들러
    // ==========================================
    const handleMasterRegister = () => {
        if (!mComCd || !mCdNm) return alert('마스터 코드와 코드명은 필수입니다.');
        const params = { comCd: mComCd, cdNm: mCdNm, cdExpl: mCdExpl, userId };

        axios.post('http://localhost:8080/api/admin/menu/codes/master', params)
            .then(() => {
                alert('마스터 코드가 등록되었습니다.');
                mClear(); fetchMasterList();
            }).catch(err => alert(err.message));
    };

    const handleMasterModify = () => {
        if (!selectedMasterCd) return alert('수정할 마스터 행을 선택하세요.');
        const params = { comCd: selectedMasterCd, cdNm: mCdNm, cdExpl: mCdExpl, userId };

        axios.put('http://localhost:8080/api/admin/menu/codes/master', params)
            .then(() => {
                alert('마스터 코드가 수정되었습니다.');
                fetchMasterList();
            }).catch(err => alert(err.message));
    };

    const mClear = () => { setMComCd(''); setMCdNm(''); setMCdExpl(''); setSelectedMasterCd(''); setDetailList([]); };

    // ==========================================
    // 상세(TN_COM_C002) C.U.R.D 핸들러
    // ==========================================
    const handleDetailRegister = () => {
        if (!selectedMasterCd) return alert('상세 코드를 등록할 상위 마스터 코드를 먼저 선택하세요.');
        if (!dComCd || !dCdNm) return alert('상세 코드와 코드명은 필수입니다.');

        const params = { uprComCd: selectedMasterCd, comCd: dComCd, cdNm: dCdNm, cdExpl: dCdExpl, useYn: dUseYn, userId };

        axios.post('http://localhost:8080/api/admin/menu/codes/detail', params)
            .then(() => {
                alert('상세 코드가 등록되었습니다.');
                dClear(); fetchDetailList(selectedMasterCd);
            }).catch(err => alert(err.message));
    };

    const handleDetailModify = () => {
        if (!selectedMasterCd || !selectedDetailCd) return alert('수정할 상세 행을 선택하세요.');
        const params = { uprComCd: selectedMasterCd, comCd: selectedDetailCd, cdNm: dCdNm, cdExpl: dCdExpl, useYn: dUseYn, userId };

        axios.put('http://localhost:8080/api/admin/menu/codes/detail', params)
            .then(() => {
                alert('상세 코드가 수정되었습니다.');
                fetchDetailList(selectedMasterCd);
            }).catch(err => alert(err.message));
    };

    const dClear = () => { setDComCd(''); setDCdNm(''); setDCdExpl(''); setDUseYn('Y'); setSelectedDetailCd(''); };


    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>공통코드 구조 통합 관리 시스템 (1:N 연동형)</h2>
            <hr />

            <div style={{ display: 'flex', gap: '20px' }}>

                {/* 왼쪽 섹션: 마스터 코드 관리 (TN_COM_C001) */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>1. 마스터 코드 관리 (TN_COM_C001)</h3>

                    <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                        <input type="text" placeholder="코드(4자리)" value={mComCd} onChange={e => setMComCd(e.target.value)} disabled={!!selectedMasterCd} style={{ marginRight: '5px', width: '80px' }} />
                        <input type="text" placeholder="코드명" value={mCdNm} onChange={e => setMCdNm(e.target.value)} style={{ marginRight: '5px', width: '120px' }} />
                        <input type="text" placeholder="코드설명" value={mCdExpl} onChange={e => setMCdExpl(e.target.value)} style={{ marginRight: '5px', width: '150px' }} />
                        <br/><br/>
                        <button onClick={handleMasterRegister}>등록</button>
                        <button onClick={handleMasterModify} style={{ marginLeft: '5px' }}>수정</button>
                        <button onClick={mClear} style={{ marginLeft: '5px' }}>취소</button>
                    </div>

                    <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#e2e2e2' }}>
                            <th>선택</th>
                            <th>공통코드</th>
                            <th>코드명</th>
                            <th>설명</th>
                        </tr>
                        </thead>
                        <tbody>
                        {masterList.map((m, idx) => (
                            <tr key={idx} style={{ backgroundColor: selectedMasterCd === m.comCd ? '#e6f7ff' : '#fff', cursor: 'pointer' }}
                                onClick={() => {
                                    setSelectedMasterCd(m.comCd);
                                    setMComCd(m.comCd);
                                    setMCdNm(m.cdNm);
                                    setMCdExpl(m.cdExpl || '');
                                    dClear();
                                    fetchDetailList(m.comCd); // 마스터 선택 시 상세목록 자동 로드
                                }}>
                                <td><input type="radio" checked={selectedMasterCd === m.comCd} readOnly /></td>
                                <td><strong>{m.comCd}</strong></td>
                                <td>{m.cdNm}</td>
                                <td>{m.cdExpl || '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 오른쪽 섹션: 상세 코드 관리 (TN_COM_C002) */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>2. 상세 코드 관리 (TN_COM_C002) {selectedMasterCd && <span style={{ color: 'blue' }}>[{selectedMasterCd}] 하위</span>}</h3>

                        <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                        <input type="text" placeholder="상세코드" value={dComCd} onChange={e => setDComCd(e.target.value)} disabled={!!selectedDetailCd} style={{ marginRight: '5px', width: '80px' }} />
                        <input type="text" placeholder="상세명" value={dCdNm} onChange={e => setDCdNm(e.target.value)} style={{ marginRight: '5px', width: '120px' }} />
                        <input type="text" placeholder="상세설명" value={dCdExpl} onChange={e => setDCdExpl(e.target.value)} style={{ marginRight: '5px', width: '130px' }} />
                    <select value={dUseYn} onChange={e => setDUseYn(e.target.value)} style={{ marginRight: '5px' }}>
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                    </select>
                    <br/><br/>
                    <button onClick={handleDetailRegister} disabled={!selectedMasterCd}>상세등록</button>
                    <button onClick={handleDetailModify} disabled={!selectedDetailCd} style={{ marginLeft: '5px' }}>상세수정</button>
                    <button onClick={dClear} style={{ marginLeft: '5px' }}>취소</button>
                </div>

                <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#e2e2e2' }}>
                        <th>선택</th>
                        <th>상세코드</th>
                        <th>상세코드명</th>
                        <th>사용여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    {detailList.length > 0 ? (
                        detailList.map((d, idx) => (
                            <tr key={idx} style={{ backgroundColor: selectedDetailCd === d.comCd ? '#fff1f0' : '#fff' }}
                                onClick={() => {
                                    setSelectedDetailCd(d.comCd);
                                    setDComCd(d.comCd);
                                    setDCdNm(d.cdNm);
                                    setDCdExpl(d.cdExpl || '');
                                    setDUseYn(d.useYn);
                                }}>
                                <td><input type="radio" checked={selectedDetailCd === d.comCd} readOnly /></td>
                                <td>{d.comCd}</td>
                                <td>{d.cdNm}</td>
                                <td>{d.useYn}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ color: '#999' }}>왼쪽 마스터 코드를 선택하면 상세 코드가 나옵니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        </div>
</div>
);
}

export default AdminMain;