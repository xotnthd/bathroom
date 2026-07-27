import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useAdminProductManage } from './hooks/useAdminProductManage';
import Pagination from '../../components/common/Pagination';

const AdminProductManage = () => {
    const navigate = useNavigate();
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, delYn } = useMenuAuth();
    const {
        productList, productTotalCount, categoryLeafList,
        fetchProductList, fetchCategoryLeafList, deleteProduct
    } = useAdminProductManage(defaultSysId);

    const [searchForm, setSearchForm] = useState({ searchKeyword: '', cteIdx: '' });
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (inqireYn === 'Y') {
            fetchProductList({ pageNum: 1, pageSize });
            fetchCategoryLeafList();
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleSearch = () => {
        setPageNum(1);
        fetchProductList({ searchKeyword: searchForm.searchKeyword, cteIdx: searchForm.cteIdx || null, pageNum: 1, pageSize });
    };

    const handleResetSearch = () => {
        const reset = { searchKeyword: '', cteIdx: '' };
        setSearchForm(reset);
        setPageNum(1);
        fetchProductList({ searchKeyword: '', cteIdx: null, pageNum: 1, pageSize });
    };

    const handlePageChange = (nextPage) => {
        setPageNum(nextPage);
        fetchProductList({ pageNum: nextPage });
    };

    const handlePageSizeChange = (nextSize) => {
        setPageSize(nextSize);
        setPageNum(1);
        fetchProductList({ pageSize: nextSize, pageNum: 1 });
    };

    const totalPages = Math.max(1, Math.ceil(productTotalCount / pageSize));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            {/* 상단 검색 섹션 (게시판 관리 화면 스타일 통일) */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '10px 24px' }}>
                    <span className="admin-card-title">제품 관리</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>카테고리:</span>
                        <select
                            className="admin-input"
                            style={{ padding: '4px 8px', width: '150px' }}
                            value={searchForm.cteIdx}
                            onChange={e => setSearchForm({ ...searchForm, cteIdx: e.target.value })}
                        >
                            <option value="">전체</option>
                            {categoryLeafList.map(c => <option key={c.idx} value={c.idx}>{c.cteNm}</option>)}
                        </select>

                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 8px' }}></div>

                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>제품명/코드:</span>
                        <input
                            type="text"
                            className="admin-input"
                            style={{ padding: '4px 8px', width: '200px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--content-bg)', color: 'var(--text-primary)' }}
                            placeholder="제품명 또는 제품 코드 검색"
                            value={searchForm.searchKeyword}
                            onChange={e => setSearchForm({ ...searchForm, searchKeyword: e.target.value })}
                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        />

                        <button type="button" onClick={handleSearch} className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleResetSearch} className="admin-btn admin-btn-secondary">초기화</button>
                    </div>
                </div>
            </div>

            {/* 리스트 영역 */}
            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-card-title">제품 목록 (총 {productTotalCount}건)</span>
                    {rgstYn === 'Y' && (
                        <button onClick={() => navigate('/admin/prd/product/write')} className="admin-btn admin-btn-primary" style={{ padding: '6px 16px', flexShrink: 0, whiteSpace: 'nowrap' }}>+ 제품 등록</button>
                    )}
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px' }}>제품 코드</th>
                                <th style={{ padding: '12px' }}>제품명</th>
                                <th style={{ padding: '12px' }}>카테고리</th>
                                <th style={{ padding: '12px' }}>SKU 수</th>
                                <th style={{ padding: '12px' }}>사용</th>
                                <th style={{ padding: '12px' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productList.map(p => (
                                <tr key={p.idx} onClick={() => navigate(`/admin/prd/product/write?prdIdx=${p.idx}`)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color, #eee)' }} className="admin-table-row-hover">
                                    <td style={{ padding: '12px' }}>{p.prdCd}</td>
                                    <td style={{ padding: '12px', color: '#2980b9', textDecoration: 'underline' }}>{p.prdNm}</td>
                                    <td style={{ padding: '12px' }}>{p.cteNm || '분류없음'}</td>
                                    <td style={{ padding: '12px' }}>{p.skuCount}</td>
                                    <td style={{ padding: '12px', color: p.useYn === 'Y' ? '#2ecc71' : '#95a5a6', fontWeight: 'bold' }}>{p.useYn}</td>
                                    <td style={{ padding: '12px' }}>
                                        {delYn === 'Y' && (
                                            <button
                                                className="admin-btn admin-btn-danger"
                                                style={{ padding: '4px 10px', fontSize: '12px' }}
                                                onClick={(e) => { e.stopPropagation(); deleteProduct(p.idx); }}
                                            >삭제</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {productList.length === 0 && (
                                <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#95a5a6' }}>조회된 제품이 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>

                    {/* 검증용 파일럿 화면이라 1페이지뿐이어도 항상 노출 - 정식 적용 시엔 게시판 목록처럼 totalPages > 1 일 때만 노출 */}
                    <Pagination
                        currentPage={pageNum}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminProductManage;
