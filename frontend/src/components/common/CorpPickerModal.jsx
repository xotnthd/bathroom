import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { apiClient } from '../../utils/apiClient';

/**
 * 재사용 가능한 업체 검색/선택 모달 - "업체 관리"에 등록된 업체 목록을 업체명으로 검색해서
 * 하나를 고를 수 있게 해준다 (예: 시스템 이용관리의 업체 정보 매핑).
 * @param {Boolean} isOpen
 * @param {Function} onClose
 * @param {number|string|null} initialSelected - 이미 선택되어 있던 corp idx
 * @param {Function} onConfirm - (selectedIdx, selectedCorp) => void. selectedIdx는 매핑 해제 시 null.
 */
const CorpPickerModal = ({ isOpen, onClose, initialSelected = null, onConfirm }) => {
    const [corpList, setCorpList] = useState([]);
    const [selected, setSelected] = useState(initialSelected);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        setSelected(initialSelected);
        setSearchKeyword('');
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const loadData = async () => {
        setIsLoading(true);
        const res = await apiClient('/admin/api/corp/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ corpNm: '' })
        });
        if (res.ok) setCorpList((await res.json()).filter(c => c.useYn === 'Y'));
        setIsLoading(false);
    };

    const handleConfirm = () => {
        const selectedCorp = corpList.find(c => c.idx === selected) || null;
        onConfirm(selected, selectedCorp);
        onClose();
    };

    const filteredList = searchKeyword.trim()
        ? corpList.filter(c => c.corpNm?.includes(searchKeyword.trim()))
        : corpList;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="업체 검색"
            width="560px"
            bodyStyle={{ maxHeight: '55vh', overflowY: 'auto' }}
            footer={
                <>
                    <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                    <button type="button" onClick={handleConfirm} className="admin-btn admin-btn-primary">선택 완료</button>
                </>
            }
        >
            <input
                type="text"
                className="admin-input"
                placeholder="업체명으로 검색"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', marginBottom: '14px', padding: '8px 10px' }}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '10px', background: selected === null ? 'rgba(52, 152, 219, 0.08)' : 'transparent' }}>
                <input type="radio" name="corpPick" checked={selected === null} onChange={() => setSelected(null)} />
                매핑 안 함
            </label>

            {isLoading && <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>불러오는 중...</div>}
            {!isLoading && filteredList.length === 0 && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>일치하는 업체가 없습니다.</div>
            )}
            {!isLoading && filteredList.map(c => (
                <label
                    key={c.idx}
                    style={{
                        display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '13px', cursor: 'pointer',
                        padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '8px',
                        background: selected === c.idx ? 'rgba(52, 152, 219, 0.08)' : 'transparent'
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="radio" name="corpPick" checked={selected === c.idx} onChange={() => setSelected(c.idx)} />
                        <span style={{ fontWeight: 'bold' }}>{c.corpNm}</span>
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px', paddingLeft: '22px' }}>
                        {c.bizRegNo || '사업자등록번호 미입력'} · {c.ceoNm || '대표자 미입력'}
                    </span>
                </label>
            ))}
        </Modal>
    );
};

export default CorpPickerModal;
