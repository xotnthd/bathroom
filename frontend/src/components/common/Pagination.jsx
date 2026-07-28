import React from 'react';

/**
 * Reusable prev/next admin pagination bar, with an optional page-size selector.
 * @param {Number} currentPage
 * @param {Number} totalPages
 * @param {Function} onPageChange - (nextPage: number) => void
 * @param {Number} pageSize - Current page size (only needed when onPageSizeChange is passed)
 * @param {Function} onPageSizeChange - (nextSize: number) => void; omit to hide the size selector
 * @param {Array<Number>} pageSizeOptions
 */
const Pagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange, pageSizeOptions = [10, 20, 30, 50] }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px 0', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px' }}
                >이전</button>
                <span style={{ padding: '4px 10px', fontSize: '13px' }}>
                    {currentPage} / {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px' }}
                >다음</button>
            </div>
            {onPageSizeChange && (
                <select
                    className="admin-input"
                    style={{ padding: '4px 8px', fontSize: '13px', width: 'auto' }}
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                    {pageSizeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}건씩 보기</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default Pagination;
