import React from 'react';
import Pagination from '../../../components/common/Pagination';

const BoardMasterList = ({
    boardList, boardTypeList, boardCurrentPage, setBoardCurrentPage, boardTotalPages, boardTotalCount,
    selectedBoard, selectBoard 
}) => {
    const getBrdTypeName = (brdTypeCd) => {
        const found = boardTypeList?.find(t => t.comCd === brdTypeCd);
        return found ? found.cdNm : brdTypeCd;
    };

    return (
        <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="admin-card-title">게시판 목록 (총 {boardTotalCount}건)</span>
            </div>
            <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg)', zIndex: 1 }}>
                        <tr>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>게시판 ID</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>게시판 명칭</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>게시판 구분</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>상태</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>등록자</th>
                            <th style={{ padding: '12px 10px', borderBottom: '1px solid var(--border-color)' }}>등록일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boardList.map(b => (
                            <tr 
                                key={b.brdId} 
                                onClick={() => selectBoard(b)} 
                                style={{ 
                                    cursor: 'pointer', 
                                    background: selectedBoard?.brdId === b.brdId ? 'var(--admin-secondary, #34495e)' : 'none',
                                    color: selectedBoard?.brdId === b.brdId ? '#fff' : 'inherit',
                                    borderBottom: '1px solid var(--border-color)'
                                }}
                                className="admin-table-row-hover"
                            >
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{b.brdId}</td>
                                <td style={{ padding: '10px', textAlign: 'left' }}>{b.brdNm}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{ background: selectedBoard?.brdId === b.brdId ? 'rgba(255,255,255,0.2)' : '#eef2f3', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: selectedBoard?.brdId === b.brdId ? '#fff' : '#2c3e50', fontWeight: '500' }}>
                                        {getBrdTypeName(b.brdType)}
                                    </span>
                                </td>
                                <td style={{ padding: '10px', color: b.delYn === 'Y' ? '#e74c3c' : (selectedBoard?.brdId === b.brdId ? '#fff' : (b.useYn === 'Y' ? '#27ae60' : '#7f8c8d')), fontWeight: 'bold' }}>
                                    {b.delYn === 'Y' ? '삭제됨' : (b.useYn === 'Y' ? '정상' : '중지')}
                                </td>
                                <td style={{ padding: '10px' }}>{b.frstRgstrId || '-'}</td>
                                <td style={{ padding: '10px' }}>{b.frstRegDt ? new Date(b.frstRegDt).toLocaleString() : '-'}</td>
                            </tr>
                        ))}
                        {boardList.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>게시판이 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            {boardTotalPages > 1 && (
                <Pagination
                    currentPage={boardCurrentPage}
                    totalPages={boardTotalPages}
                    onPageChange={setBoardCurrentPage}
                />
            )}
        </div>
    );
};

export default BoardMasterList;
