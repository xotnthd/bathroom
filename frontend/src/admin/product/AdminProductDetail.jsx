import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { useAdminProductManage } from './hooks/useAdminProductManage';
import ProductFormPanel from './components/ProductFormPanel';
import SkuPanel from './components/SkuPanel';
import StockPanel from './components/StockPanel';

const AdminProductDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const prdIdx = queryParams.get('prdIdx') ? Number(queryParams.get('prdIdx')) : null;
    const mode = prdIdx ? 'UPDATE' : 'INSERT';

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth();
    const {
        optGroupMasterList, categoryLeafList, locationList, supplierList,
        productOptGroups, skuList, stockList, stockSummary, stockHistory,
        fetchOptGroupMasterList, fetchCategoryLeafList, fetchLocationList, fetchSupplierList,
        fetchProductInfo, fetchProductDetail, saveProduct, saveSkuList, processStockMove
    } = useAdminProductManage(defaultSysId);

    const [form, setForm] = useState({ prdCd: '', prdNm: '', cteIdx: null, prdExpl: '', optGrpIdxList: [], useYn: 'Y' });

    useEffect(() => {
        fetchOptGroupMasterList();
        fetchCategoryLeafList();
        fetchLocationList();
        fetchSupplierList();
        if (mode === 'UPDATE') {
            fetchProductInfo(prdIdx).then(info => {
                if (info) setForm(f => ({ ...f, ...info }));
            });
            fetchProductDetail(prdIdx);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prdIdx]);

    // productOptGroups가 로드되면 폼의 체크박스 상태와 동기화 (수정 모드)
    useEffect(() => {
        if (mode === 'UPDATE') {
            setForm(f => ({ ...f, idx: prdIdx, optGrpIdxList: productOptGroups.map(g => g.optGrpIdx) }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productOptGroups]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleSaveProduct = async (formData) => {
        const saved = await saveProduct(formData);
        if (saved) {
            if (mode === 'INSERT') {
                navigate(`/admin/prd/product/write?prdIdx=${saved.idx}`);
            } else {
                fetchProductDetail(prdIdx);
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '제품 등록' : '제품 상세'}</h2>
                <button onClick={() => navigate('/admin/prd/product')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <ProductFormPanel
                form={form}
                setForm={setForm}
                categoryLeafList={categoryLeafList}
                optGroupMasterList={optGroupMasterList}
                onSave={handleSaveProduct}
                mode={mode}
                rgstYn={rgstYn}
                mdfcnYn={mdfcnYn}
            />

            {mode === 'UPDATE' && (
                <>
                    <SkuPanel
                        prdIdx={prdIdx}
                        productOptGroups={productOptGroups}
                        skuList={skuList}
                        onSaveSkuList={saveSkuList}
                        rgstYn={rgstYn}
                        mdfcnYn={mdfcnYn}
                    />
                    <StockPanel
                        prdIdx={prdIdx}
                        skuList={skuList}
                        stockList={stockList}
                        stockSummary={stockSummary}
                        stockHistory={stockHistory}
                        locationList={locationList}
                        supplierList={supplierList}
                        onProcessMove={processStockMove}
                        rgstYn={rgstYn}
                    />
                </>
            )}
        </div>
    );
};

export default AdminProductDetail;
