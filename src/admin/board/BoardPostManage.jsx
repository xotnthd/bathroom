import React, { useState, useEffect } from 'react';
import {apiClient} from "../../utils/apiClient";
// React 19 등�환확인�해 react-quill 등�삭제react-quill-new 등�이브러리�등 등�용등�니삭제
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useMenuAuth } from '../hooks/useMenuAuth';

const BoardPostManage = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn, delYn } = useMenuAuth();

    const [boardList, setBoardList] = useState([]);
    const [postList, setPostList] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [selectedPostIdx, setSelectedPostIdx] = useState('');
    const [selectedPostIds, setSelectedPostIds] = useState([]);

    const [searchForm, setSearchForm] = useState({ searchBrdType: '', searchUseYn: '', searchDelYn: '' });

    // 모달 �등1:N 등�일 등�들�등
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postForm, setPostForm] = useState({ idx: '', title: '', content: '', atchFileGrpId: '', ntcYn: 'N', highlightYn: 'N', rlsStartDt: '', rlsEndDt: '' });
    const [uploadFiles, setUploadFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);

    const [boardTypeList, setBoardTypeList] = useState([]);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fnFetchCodes('BOARD_SE_CD', 'ROOT', 'TYPE');
            fnFetchBoardMasterGrid(searchForm);
        } else if (inqireYn === 'N') {
            alert('조회 권한명삭제�습등�다. 관리자등�게 문의등�세삭제');
        }
    }, [inqireYn]);

    const fnFetchCodes = async (grpCd, uprComCd, type) => {
        const res = await apiClient('/admin/api/board/common/code', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, grpCd, uprComCd })
        });
        if (res.ok) {
            const data = await res.json();
            if (type === 'TYPE') setBoardTypeList(data);
        }
    };

    const fnFetchBoardMasterGrid = async (searchData) => {
        const res = await apiClient('/admin/api/board/managing/list', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, ...searchData })
        });
        if (res.ok) setBoardList(await res.json());
    };

    const handleBoardRowClick = async (board) => {
        if (inqireYn !== 'Y') return;
        setSelectedBoard(board);
        setSelectedPostIdx('');
        setSelectedPostIds([]);
        const res = await apiClient('/admin/api/board/post/monitor', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, brdId: board.brdId })
        });
        if (res.ok) setPostList(await res.json());
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fnFetchBoardMasterGrid(searchForm);
    };

    const handleSearchReset = () => {
        const resetForm = { searchBrdType: '', searchUseYn: '', searchDelYn: '' };
        setSearchForm(resetForm);
        fnFetchBoardMasterGrid(resetForm);
    };

    const openDetailModal = async (post = null) => {
        if (!selectedBoard) return alert("좌측 명단등�서 게시판�을 먼�등 등�택삭제주셔확인�성등추가등�합등�다.");

        setUploadFiles([]);
        setExistingFiles([]);

        if (post) {
            setSelectedPostIdx(post.idx);
            setPostForm(post);

            if (post.atchFileGrpId) {
                const fRes = await apiClient(`/admin/api/comn/file/list/${post.atchFileGrpId}?sysId=${defaultSysId}`);
                if (fRes.ok) setExistingFiles(await fRes.json());
            }
        } else {
            setSelectedPostIdx('');
            setPostForm({ idx: '', title: '', content: '', atchFileGrpId: '', ntcYn: 'N', highlightYn: 'N', rlsStartDt: '', rlsEndDt: '' });
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        setUploadFiles(Array.from(e.target.files));
    };

    const handlePostFormDataSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedPostIdx !== '' ? (mdfcnYn !== 'Y') : (rgstYn !== 'Y')) {
            alert("등�삭제권한명삭제�습등�다.");
            return;
        }

        const formData = new FormData();
        formData.append('sysId', defaultSysId);
        formData.append('brdId', selectedBoard.brdId);
        Object.keys(postForm).forEach(key => formData.append(key, postForm[key] || ''));

        uploadFiles.forEach(file => { formData.append('files', file); });

        const res = await apiClient('/admin/api/board/post/save', { method: 'POST', body: formData });
        if (res.ok) {
            alert("게시�등�삭제�중 등�일 등�로삭제처리가 등�료등�었등�니삭제");
            setIsModalOpen(false);
            if (selectedBoard) handleBoardRowClick(selectedBoard);
        }
    };

    // 개별 게시글 삭제��(등�리 삭제��) 처리
    const handlePostLogicalDelete = async (e, idx) => {
        e.stopPropagation(); // 삭제row) 등�릭 등�벤등��등 모달확인��등 등�도�삭제�벤확인�파 차단
        if (delYn !== 'Y') { alert('권한명삭제�습등�다.'); return; }
        if (!window.confirm("게시글확인�리 삭제��(등��등) 차단등�시겠습등�까등")) return;
        const res = await apiClient(`/admin/api/board/post/kick/${idx}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (res.ok) {
            alert("블라등�드 등�료");
            if (selectedBoard) handleBoardRowClick(selectedBoard); // 삭제�� 삭제리스확인�로고침
        }
    };

    // 등�택삭제게시글 등�중 등�괄 삭제�� 처리
    const handleBulkDelete = async () => {
        if (delYn !== 'Y') { alert('권한명삭제�습등�다.'); return; }
        if (selectedPostIds.length === 0) return alert("등�택삭제게시글확인�습등�다.");
        if (!window.confirm(`등�택삭제${selectedPostIds.length}개의 게시글확인�괄 차단(등��등) 등�시겠습등�까등`)) return;
        
        const res = await apiClient(`/admin/api/board/post/kick/bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedPostIds)
        });
        if (res.ok) {
            alert("등�괄 차단 등�료");
            setSelectedPostIds([]); // 등�택 초기화
            if (selectedBoard) handleBoardRowClick(selectedBoard); // 리스확인�로고침
        }
    };

    // 개별 게시글 차단 등�제(등�복) 처리
    const handlePostRestore = async (e, idx) => {
        e.stopPropagation(); // 모달 방�등
        if (delYn !== 'Y') { alert('권한명삭제�습등�다.'); return; }
        if (!window.confirm("게시글 차단확인�제등�고 등�시 등�출등�시겠습등�까등")) return;
        const res = await apiClient(`/admin/api/board/post/restore/${idx}`, {
            method: 'POST',
            credentials: 'include'
        });
        if (res.ok) {
            alert("차단 등�제 등�료");
            if (selectedBoard) handleBoardRowClick(selectedBoard);
        }
    };

    // 등�택삭제게시글 등�중 등�괄 차단 등�제(등�복) 처리
    const handleBulkRestore = async () => {
        if (delYn !== 'Y') { alert('권한명삭제�습등�다.'); return; }
        if (selectedPostIds.length === 0) return alert("등�택삭제게시글확인�습등�다.");
        if (!window.confirm(`등�택삭제${selectedPostIds.length}개의 게시글확인�괄 차단 등�제(등�출) 등�시겠습등�까등`)) return;
        
        const res = await apiClient(`/admin/api/board/post/restore/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedPostIds)
        });
        if (res.ok) {
            alert("등�괄 등�제 등�료");
            setSelectedPostIds([]);
            if (selectedBoard) handleBoardRowClick(selectedBoard);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPostIds(postList.map(p => p.idx));
        } else {
            setSelectedPostIds([]);
        }
    };

    const handleSelectPost = (idx, isChecked) => {
        if (isChecked) {
            setSelectedPostIds([...selectedPostIds, idx]);
        } else {
            setSelectedPostIds(selectedPostIds.filter(id => id !== idx));
        }
    };

    // 삭제�� 등�들삭제추�등
    // 삭제�� 등�들삭제 리스확인�조삭제로직 추�등
    const handleFileDelete = async (fileSn) => {
        if (!window.confirm("등�일등록��등�시겠습등�까등")) return;
        const res = await apiClient(`/admin/api/comn/file/delete/${fileSn}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            // 등�공 삭제comn api�삭제�시 목록 로드
            const fRes = await apiClient(`/admin/api/comn/file/list/${postForm.atchFileGrpId}?sysId=${defaultSysId}`,
                {
                    method: 'GET'
                }
                );
            if (fRes.ok) setExistingFiles(await fRes.json());
        }
    };

    // [추�?] Blob확인�용확인�로그래�등방식확인�일 등�운로드 등�들삭제
    const handleFileDownload = async (fileSn, originalName) => {
        try {
            const res = await apiClient(`/admin/api/comn/file/download/${fileSn}`, {
                method: 'GET'
            });
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 160px)' }}>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>등�� 등�세 등�터:</span>
                    <select value={searchForm.searchBrdType} onChange={e => setSearchForm({...searchForm, searchBrdType: e.target.value})} style={{ padding: '4px' }}>
                        <option value="">등�형 등�체</option>
                        {boardTypeList.map(t => <option key={t.comCd} value={t.comCd}>{t.cdNm}</option>)}
                    </select>
                    <select value={searchForm.searchUseYn} onChange={e => setSearchForm({...searchForm, searchUseYn: e.target.value})} style={{ padding: '4px' }}>
                        <option value="">등�용 등�체</option><option value="Y">등�상 등�성</option><option value="N">중�등 등�태</option>
                    </select>
                    <select value={searchForm.searchDelYn} onChange={e => setSearchForm({...searchForm, searchDelYn: e.target.value})} style={{ padding: '4px' }}>
                        <option value="">삭제�� 등�체</option><option value="N">등�상 보존</option><option value="Y">등�리 삭제��삭제</option>
                    </select>
                    <button type="submit" style={{ padding: '4px 15px', background: '#2c3e50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>검색</button>
                    <button type="button" onClick={handleSearchReset} style={{ padding: '4px 15px', background: '#ecf0f1', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>초기화</button>
                </form>
            </div>

            <div style={{ display: 'flex', gap: '1.2rem', flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                    <h4>등�� 등�삭제게시판등리스삭제</h4>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#f8f9fa' }}>
                            <tr><th>게시판등ID</th><th>게시판삭제�름</th><th>등�태</th></tr>
                            </thead>
                            <tbody>
                            {boardList.map(b => (
                                <tr key={b.brdId} onClick={() => handleBoardRowClick(b)} style={{ cursor: 'pointer', background: selectedBoard?.brdId === b.brdId ? '#e3f2fd' : 'none' }}>
                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{b.brdId}</td>
                                    <td style={{ padding: '8px', textAlign: 'left' }}>{b.brdNm}</td>
                                    <td style={{ padding: '8px', color: b.delYn === 'Y' ? 'red' : 'inherit' }}>{b.delYn === 'Y' ? '삭제됨' : (b.useYn === 'Y' ? '등��등�상' : '등�중지')}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ flex: 1.5, background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <h4>등�� 등�시�등게시글 명단 {selectedBoard && <span style={{ color: '#3498db' }}>({selectedBoard.brdNm})</span>}</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {delYn === 'Y' && (
                                <>
                                    <button onClick={handleBulkDelete} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>등�택 등�괄 차단</button>
                                    <button onClick={handleBulkRestore} style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>등�택 차단 등�제</button>
                                </>
                            )}
                            {rgstYn === 'Y' && (
                                <button onClick={() => openDetailModal(null)} style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>+ 등�규 글 등�록</button>
                            )}
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#2c3e50', color: '#fff' }}>
                            <tr>
                                <th style={{width: '40px', textAlign: 'center'}}><input type="checkbox" onChange={handleSelectAll} checked={postList.length > 0 && selectedPostIds.length === postList.length} /></th>
                                <th>No</th><th>등�티확인�목</th><th>등�성삭제</th><th style={{textAlign:'center'}}>등�약등�태</th><th style={{textAlign:'center'}}>등�일묶음</th><th style={{textAlign:'center'}}>등�태</th>
                                {delYn === 'Y' && <th style={{textAlign:'center'}}>처분</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {postList.map(p => {
                                // 등�약 기간 계산 로직 추�등
                                const now = new Date();
                                const isReserved = p.rlsStartDt && new Date(p.rlsStartDt) > now;
                                const isExpired = p.rlsEndDt && new Date(p.rlsEndDt) < now;
                                const reserveStatus = isReserved ? '등�예등�중' : (isExpired ? '종료' : (p.rlsStartDt || p.rlsEndDt ? '옵션1' : '즉시발행'));

                                return (
                                <tr key={p.idx} onClick={() => openDetailModal(p)} style={{ cursor: 'pointer', background: selectedPostIdx === p.idx ? '#f5f5f5' : (p.highlightYn === 'Y' ? '#fff9c4' : (p.delYn === 'Y' ? '#fde8e8' : 'none')) }}>
                                    <td style={{ padding: '8px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" checked={selectedPostIds.includes(p.idx)} onChange={e => handleSelectPost(p.idx, e.target.checked)} />
                                    </td>
                                    <td style={{ padding: '8px' }}>{p.ntcYn === 'Y' ? '취소��' : p.idx}</td>
                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{p.title}</td>
                                    <td style={{ padding: '8px' }}>{p.wrtrNm}</td>
                                    <td style={{ padding: '8px', textAlign: 'center', color: isReserved ? '#e67e22' : '#7f8c8d' }}>{reserveStatus}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{p.atchFileGrpId ? '취소��' : '-'}</td>
                                    <td style={{ padding: '8px', textAlign: 'center', color: p.delYn === 'Y' ? 'red' : 'green' }}>{p.delYn === 'Y' ? '등��등' : '등�출'}</td>
                                    {delYn === 'Y' && (
                                        <td style={{ padding: '4px', textAlign: 'center' }}>
                                            {p.delYn === 'Y' ? (
                                                <button onClick={(e) => handlePostRestore(e, p.idx)} style={{ padding: '4px 8px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>등�제</button>
                                            ) : (
                                                <button onClick={(e) => handlePostLogicalDelete(e, p.idx)} style={{ padding: '4px 8px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>차단</button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            )})}
                            {postList.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>게시물이 존재등��등 등�습등�다.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', width: '520px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h4 style={{ margin: '0 0 1rem 0', borderBottom: '2px solid #e67e22', paddingBottom: '5px' }}>등�� 게시글 등�고 등�세 등�어</h4>
                        <form onSubmit={handlePostFormDataSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', padding: '10px', background: '#f8f9fa', borderRadius: '4px', border: '1px solid #ddd' }}>
                                {/* 등�단 고정 �등강조 체크박스 UI */}
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#d35400', cursor: 'pointer' }}><input type="checkbox" checked={postForm.ntcYn === 'Y'} onChange={e => setPostForm({...postForm, ntcYn: e.target.checked ? 'Y' : 'N'})} style={{ marginRight: '5px' }} /> 메인 상단 공지 고정</label>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#8e44ad', cursor: 'pointer' }}><input type="checkbox" checked={postForm.highlightYn === 'Y'} onChange={e => setPostForm({...postForm, highlightYn: e.target.checked ? 'Y' : 'N'})} style={{ marginRight: '5px' }} /> 새게시글 강조 처리 (목록 표시 배경)</label>
                            </div>
                            <input type="text" placeholder="제목" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} required style={{ padding: '6px' }} />
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '12px', padding: '5px' }}>
                                <strong>최상단 노출 기간 (선택)</strong>
                                <input type="datetime-local" value={postForm.rlsStartDt || ''} onChange={e => setPostForm({...postForm, rlsStartDt: e.target.value})} style={{ padding: '4px' }} /> ~
                                <input type="datetime-local" value={postForm.rlsEndDt || ''} onChange={e => setPostForm({...postForm, rlsEndDt: e.target.value})} style={{ padding: '4px' }} />
                                <span style={{color: '#999'}}>(미입력시 작성 즉시 발행됨)</span>
                            </div>
                            <div style={{ height: '240px', background: '#fff', marginBottom: '20px' }}>
                                <ReactQuill theme="snow" value={postForm.content || ''} onChange={val => setPostForm({...postForm, content: val})} style={{ height: '190px' }} />
                            </div>

                            {selectedBoard?.atchFileYn === 'Y' ? (
                                <div style={{ background: '#fff8f0', padding: '10px', borderRadius: '4px', border: '1px solid #f39c12', fontSize: '12px' }}>
                                    <strong style={{color:'#d35400', display:'block', marginBottom:'5px'}}>파일 1:N 다중 파일 첨부 영역</strong>
                                    <input type="file" multiple onChange={handleFileChange} style={{ display: 'block', width: '100%' }} />

                                    {existingFiles.length > 0 && (
                                        <div style={{ marginTop: '10px', padding: '8px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#2980b9' }}>[기존 첨부 파일 목록]</span>
                                            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', color: '#333' }}>
                                                {existingFiles.map(f => (
                                                    <li key={f.fileSn} style={{ marginBottom: '5px', fontSize: '12px' }}>
                                                        {f.fileOrgnlNm}
                                                        <span style={{color:'#aaa', margin:'0 10px'}}>({(f.fileSize/1024).toFixed(1)} KB)</span>
                                                        <span onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)}
                                                              style={{ fontSize: '11px', color: '#e67e22', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', marginRight: '10px' }}>다운로드</span>
                                                        <button onClick={() => handleFileDelete(f.fileSn)}
                                                                style={{ fontSize: '10px', background: '#ff7675', border: 'none', color: '#fff', cursor: 'pointer' }}>삭제</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '12px', textAlign: 'center', color: '#7f8c8d' }}>
                                    등�� 삭제게시판��등 마스확인�정확인�해 등�일 첨�추가 비활등�화등�어 등�습등�다.
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem' }}>
                                {((selectedPostIdx === '' && rgstYn === 'Y') || (selectedPostIdx !== '' && mdfcnYn === 'Y')) && (
                                    <button type="submit" style={{ flex: 1, padding: '10px', background: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>등�확인�정</button>
                                )}
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>등�기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardPostManage;
