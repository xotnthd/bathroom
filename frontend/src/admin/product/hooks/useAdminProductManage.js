import { useState, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';

export const useAdminProductManage = (sysId) => {
    const [productList, setProductList] = useState([]);
    const [productTotalCount, setProductTotalCount] = useState(0);
    const [productListParams, setProductListParams] = useState({ searchKeyword: '', cteIdx: null, pageNum: 1, pageSize: 10 });
    const [optGroupMasterList, setOptGroupMasterList] = useState([]);
    const [categoryLeafList, setCategoryLeafList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);

    const [productOptGroups, setProductOptGroups] = useState([]);
    const [skuList, setSkuList] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [stockSummary, setStockSummary] = useState([]);
    const [stockHistory, setStockHistory] = useState([]);

    const reportError = async (res) => {
        const msg = await res.text();
        alert('오류: ' + msg);
    };

    const fetchProductList = useCallback(async (overrides = {}) => {
        const params = { ...productListParams, ...overrides };
        setProductListParams(params);
        const res = await apiClient('/admin/api/product/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId, ...params })
        });
        if (res.ok) {
            const data = await res.json();
            setProductList(data.list || []);
            setProductTotalCount(data.totalCount || 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sysId, productListParams]);

    const fetchOptGroupMasterList = useCallback(async () => {
        const res = await apiClient(`/admin/api/prdopt/group/list?sysId=${sysId}`);
        if (res.ok) setOptGroupMasterList(await res.json());
    }, [sysId]);

    const fetchCategoryLeafList = useCallback(async () => {
        const res = await apiClient(`/admin/api/prdcte/leaf/list?sysId=${sysId}`);
        if (res.ok) setCategoryLeafList(await res.json());
    }, [sysId]);

    const fetchLocationList = useCallback(async () => {
        const res = await apiClient(`/admin/api/prdloc/list?sysId=${sysId}`);
        if (res.ok) setLocationList(await res.json());
    }, [sysId]);

    const fetchSupplierList = useCallback(async () => {
        const res = await apiClient(`/admin/api/prdsup/list?sysId=${sysId}`);
        if (res.ok) setSupplierList(await res.json());
    }, [sysId]);

    const fetchProductInfo = useCallback(async (prdIdx) => {
        const res = await apiClient(`/admin/api/product/detail/${sysId}/${prdIdx}`);
        if (res.ok) return await res.json();
        return null;
    }, [sysId]);

    const fetchProductDetail = useCallback(async (prdIdx) => {
        const [ogRes, skuRes, stockRes, sumRes, histRes] = await Promise.all([
            apiClient(`/admin/api/product/optgroup/list?prdIdx=${prdIdx}`),
            apiClient(`/admin/api/product/sku/list?prdIdx=${prdIdx}`),
            apiClient(`/admin/api/product/stock/list?sysId=${sysId}&prdIdx=${prdIdx}`),
            apiClient(`/admin/api/product/stock/summary?prdIdx=${prdIdx}`),
            apiClient(`/admin/api/product/stock/history?prdIdx=${prdIdx}`)
        ]);
        if (ogRes.ok) setProductOptGroups(await ogRes.json());
        if (skuRes.ok) setSkuList(await skuRes.json());
        if (stockRes.ok) setStockList(await stockRes.json());
        if (sumRes.ok) setStockSummary(await sumRes.json());
        if (histRes.ok) setStockHistory(await histRes.json());
    }, [sysId]);

    const saveProduct = useCallback(async (form) => {
        const res = await apiClient('/admin/api/product/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, sysId })
        });
        if (res.ok) {
            const saved = await res.json();
            alert('저장되었습니다.');
            fetchProductList();
            return saved;
        }
        await reportError(res);
        return null;
    }, [sysId, fetchProductList]);

    const deleteProduct = useCallback(async (idx) => {
        if (!window.confirm('제품을 삭제하시겠습니까?')) return;
        const res = await apiClient(`/admin/api/product/delete/${sysId}/${idx}`, { method: 'DELETE' });
        if (res.ok) {
            fetchProductList();
        } else {
            await reportError(res);
        }
    }, [sysId, fetchProductList]);

    const saveSkuList = useCallback(async (prdIdx, skus) => {
        const res = await apiClient('/admin/api/product/sku/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prdIdx, skus })
        });
        if (res.ok) {
            alert('SKU가 저장되었습니다.');
            await fetchProductDetail(prdIdx);
            return true;
        }
        await reportError(res);
        return false;
    }, [fetchProductDetail]);

    const processStockMove = useCallback(async (param, prdIdx) => {
        const res = await apiClient('/admin/api/product/stock/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(param)
        });
        if (res.ok) {
            alert('처리되었습니다.');
            await fetchProductDetail(prdIdx);
            return true;
        }
        await reportError(res);
        return false;
    }, [fetchProductDetail]);

    return {
        productList, productTotalCount, productListParams,
        optGroupMasterList, categoryLeafList, locationList, supplierList,
        productOptGroups, skuList, stockList, stockSummary, stockHistory,
        fetchProductList, fetchOptGroupMasterList, fetchCategoryLeafList, fetchLocationList, fetchSupplierList,
        fetchProductInfo, fetchProductDetail, saveProduct, deleteProduct, saveSkuList, processStockMove
    };
};
