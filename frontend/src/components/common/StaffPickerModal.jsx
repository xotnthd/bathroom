import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { apiClient } from '../../utils/apiClient';
import { getCommonCodes } from '../../utils/commonCode';

/**
 * 재사용 가능한 인원 선택 모달 - sysId만 넘기면 해당 업체 전 직원을 부서별 트리로 보여주고
 * 체크박스로 여러 명을 골라 idx 목록을 돌려준다. 각 항목은 "직급 이름" 형태로 노출한다.
 * @param {Boolean} isOpen
 * @param {Function} onClose
 * @param {String} sysId
 * @param {Array<number>} initialSelected - 이미 선택되어 있던 userIdx 목록
 * @param {Function} onConfirm - (selectedIdxList, selectedUsers) => void
 */
const StaffPickerModal = ({ isOpen, onClose, sysId, initialSelected = [], onConfirm }) => {
    const [staffList, setStaffList] = useState([]);
    const [deptMap, setDeptMap] = useState({});
    const [positionMap, setPositionMap] = useState({});
    const [selected, setSelected] = useState(initialSelected);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        setSelected(initialSelected);
        setSearchKeyword('');
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, sysId]);

    const loadData = async () => {
        setIsLoading(true);
        const sysRes = await apiClient(`/admin/api/sys/detail/${sysId}`);
        let deptSchemeCd, positionSchemeCd;
        if (sysRes.ok) {
            const sysData = await sysRes.json();
            deptSchemeCd = sysData.deptSchemeCd;
            positionSchemeCd = sysData.positionSchemeCd;
        }

        const staffRes = await apiClient(`/admin/api/user/search?sysId=${sysId}&searchUserId=&searchUserNm=&searchUserStatCd=`);
        if (staffRes.ok) setStaffList(await staffRes.json());

        const [deptCodes, positionCodes] = await Promise.all([
            getCommonCodes('DEPT_CD', sysId, deptSchemeCd),
            getCommonCodes('POSITION_CD', sysId, positionSchemeCd)
        ]);
        setDeptMap(Object.fromEntries(deptCodes.map(c => [c.comCd, c.cdNm])));
        setPositionMap(Object.fromEntries(positionCodes.map(c => [c.comCd, c.cdNm])));
        setIsLoading(false);
    };

    const toggle = (userIdx) => {
        setSelected(prev => prev.includes(userIdx) ? prev.filter(v => v !== userIdx) : [...prev, userIdx]);
    };

    const toggleDeptAll = (deptUsers) => {
        const deptIdxList = deptUsers.map(u => u.idx);
        const allChecked = deptIdxList.every(idx => selected.includes(idx));
        setSelected(prev => allChecked
            ? prev.filter(idx => !deptIdxList.includes(idx))
            : [...new Set([...prev, ...deptIdxList])]);
    };

    const handleConfirm = () => {
        const selectedUsers = staffList.filter(u => selected.includes(u.idx));
        onConfirm(selected, selectedUsers);
        onClose();
    };

    const filteredStaff = searchKeyword.trim()
        ? staffList.filter(u => u.userNm?.includes(searchKeyword.trim()))
        : staffList;

    const grouped = filteredStaff.reduce((acc, u) => {
        const key = u.deptCd || '__NONE__';
        if (!acc[key]) acc[key] = [];
        acc[key].push(u);
        return acc;
    }, {});

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="인원 선택"
            width="540px"
            bodyStyle={{ maxHeight: '55vh', overflowY: 'auto' }}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    <button type="button" onClick={handleConfirm} className="admin-btn admin-btn-primary">선택 완료 ({selected.length}명)</button>
                </>
            }
        >
            <input
                type="text"
                className="admin-input"
                placeholder="이름으로 검색"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', marginBottom: '14px', padding: '8px 10px' }}
            />
            {isLoading && <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>불러오는 중...</div>}
            {!isLoading && Object.keys(grouped).length === 0 && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>일치하는 직원이 없습니다.</div>
            )}
            {!isLoading && Object.keys(grouped).map(deptCd => {
                const deptUsers = grouped[deptCd];
                const allChecked = deptUsers.every(u => selected.includes(u.idx));
                return (
                    <div key={deptCd} style={{ marginBottom: '14px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px 12px', background: 'var(--table-header-bg)' }}>
                            <input type="checkbox" checked={allChecked} onChange={() => toggleDeptAll(deptUsers)} />
                            {deptMap[deptCd] || '부서 미지정'}
                            <span style={{ marginLeft: 'auto', fontWeight: 'normal', color: 'var(--text-secondary)', fontSize: '12px' }}>{deptUsers.length}명</span>
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', padding: '10px 16px' }}>
                            {deptUsers.map(u => (
                                <label key={u.userId} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={selected.includes(u.idx)} onChange={() => toggle(u.idx)} />
                                    <span style={{ color: 'var(--text-secondary)' }}>{positionMap[u.positionCd] || '-'}</span> {u.userNm}
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
        </Modal>
    );
};

export default StaffPickerModal;
