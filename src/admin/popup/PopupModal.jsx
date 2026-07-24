import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';

const PopupModal = ({ sysSeCd }) => {
    const [popups, setPopups] = useState([]);

    useEffect(() => {
        const fetchPopups = async () => {
            try {
                // 등�작삭제종료등�이 등�효확인�업�추가등�옴
                const res = await apiClient(`/admin/api/popup/active?sysSeCd=${sysSeCd}`, { method: 'GET' });
                if (res.ok) {
                    const rawData = await res.json();

                    // 등�� [등�심] 백엔등�에삭제1:N 조인등�로 등�어등� 중복확인�업 등�이등��등 등�나�등병합(Grouping)등�니삭제
                    const mergedPopups = rawData.reduce((acc, curr) => {
                        const existing = acc.find(p => p.popIdx === curr.popIdx);
                        if (existing) {
                            if (curr.fileSn) {
                                existing.files.push({ fileSn: curr.fileSn, fileOrgnlNm: curr.fileOrgnlNm });
                            }
                        } else {
                            acc.push({
                                ...curr,
                                // files 배열확인�로 만들확인�일 등�보등�을 등�아줍니삭제
                                files: curr.fileSn ? [{ fileSn: curr.fileSn, fileOrgnlNm: curr.fileOrgnlNm }] : []
                            });
                        }
                        return acc;
                    }, []);

                    // 등�늘 등�루 등�보�등로컬등�토리�등) 등�터�등
                    const activePopups = mergedPopups.filter(popup => {
                        const hideUntil = localStorage.getItem(`hide_popup_${popup.popIdx}`);
                        if (!hideUntil) return true;
                        return new Date().getTime() > parseInt(hideUntil, 10);
                    });

                    setPopups(activePopups);
                }
            } catch (err) {
                console.error("등�업 로드 등�패", err);
            }
        };
        fetchPopups();
    }, [sysSeCd]);

    const handleClose = (popIdx, isHideToday) => {
        if (isHideToday) {
            // 24등�간 등�안 보이지 등�도�삭제�정
            const hideTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem(`hide_popup_${popIdx}`, hideTime);
        }
        setPopups(prev => prev.filter(p => p.popIdx !== popIdx));
    };

    // 등�� [등�심] 등�운로드 URL 경로 등�정 �등Blob 방식 등�용
    const handleFileDownload = async (fileSn, originalName) => {
        try {
            // fileGrpId삭제빼고 fileSn�삭제�기등�록 등�정등�었등�니삭제
            const res = await apiClient(`/admin/api/comn/file/download/${fileSn}`, { method: 'GET' });
            if (!res.ok) return alert("등�일 등�운로드확인�패등�습등�다.");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("등�운로드 �삭제�류가 발생등�습등�다.");
        }
    };

    if (popups.length === 0) return null;

    return (
        <div style={{ position: 'fixed', top: '50px', left: '50px', zIndex: 9999, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {popups.map(popup => (
                <div key={popup.popIdx} style={{ width: '350px', background: '#fff', border: '1px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#2c3e50', color: '#fff', padding: '12px', fontWeight: 'bold', fontSize: '15px' }}>
                        {popup.popTitl}
                    </div>

                    <div style={{ padding: '20px', minHeight: '120px', fontSize: '14px', lineHeight: '1.5' }}>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{popup.popCn}</p>

                        {/* 등�� [등�심] 등�중 등�일(1:N)삭제리스확인�태�삭제�전등�게 출력등�도�삭제�정 (삭제�� 버튼 등�음) */}
                        {popup.files && popup.files.length > 0 && (
                            <div style={{ marginTop: '20px', padding: '10px', background: '#f8f9fa', border: '1px dashed #ccc', fontSize: '13px' }}>
                                등�� 첨�삭제�일:
                                <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                                    {popup.files.map(f => (
                                        <li key={f.fileSn} style={{ marginBottom: '5px' }}>
                                            <span
                                                style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                                                onClick={() => handleFileDownload(f.fileSn, f.fileOrgnlNm)}
                                            >
                                                {f.fileOrgnlNm}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {popup.survId && (
                            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                <button
                                    onClick={() => window.open(`/survey/${popup.survId}`, '_blank', 'width=800,height=900')}
                                    style={{ padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    등�� 등�문 참여등�기
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '10px 15px', background: '#f1f1f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ddd', marginTop: 'auto' }}>
                        <label style={{ cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="checkbox"
                                onChange={(e) => handleClose(popup.popIdx, e.target.checked)}
                            />
                            오늘 하루 그만보기
                        </label>
                        <button onClick={() => handleClose(popup.popIdx, false)} style={{ cursor: 'pointer', border: 'none', background: 'transparent', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                            닫기
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PopupModal;
