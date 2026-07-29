import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useVoteManage } from './hooks/useVoteManage';
import StaffPickerModal from '../../components/common/StaffPickerModal';

const TODAY = new Date().toISOString().split('T')[0];

const ChoiceCard = ({ selected, disabled, onClick, title, desc }) => (
    <div
        onClick={!disabled ? onClick : undefined}
        style={{
            flex: 1, minWidth: '140px', display: 'flex', flexDirection: 'column', gap: '4px',
            border: `2px solid ${selected ? 'var(--primary-color, #3498db)' : 'var(--border-color)'}`,
            borderRadius: '10px', padding: '12px 14px',
            background: selected ? 'rgba(52, 152, 219, 0.08)' : 'transparent',
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled && !selected ? 0.5 : 1,
            transition: 'border-color 0.15s, background 0.15s'
        }}
    >
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: selected ? 'var(--primary-color, #3498db)' : 'var(--text-primary)' }}>
            {title}
        </div>
        {desc && <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{desc}</div>}
    </div>
);

const VoteDetail = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const voteIdx = new URLSearchParams(routerLocation.search).get('voteIdx');
    const mode = voteIdx ? 'UPDATE' : 'INSERT';

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth(MENU_IDS.VOTE);
    const {
        roleList, fetchRoleList,
        fetchVoteDetail, saveVote
    } = useVoteManage(defaultSysId);

    const canEdit = mode === 'INSERT' ? rgstYn === 'Y' : mdfcnYn === 'Y';

    const [form, setForm] = useState({
        voteTitl: '', voteExpl: '', targetType: 'ALL', targetAthrtyCd: '',
        voteMode: 'NORMAL', anonymousYn: 'N', bgngDt: TODAY, endDt: TODAY
    });
    const [options, setOptions] = useState([{ optNm: '' }, { optNm: '' }]);
    const [selectedUserIdxList, setSelectedUserIdxList] = useState([]);
    const [selectedUserNames, setSelectedUserNames] = useState([]);
    const [showStaffPicker, setShowStaffPicker] = useState(false);

    useEffect(() => {
        fetchRoleList();
        if (mode === 'UPDATE') {
            loadDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voteIdx]);

    const loadDetail = async () => {
        const info = await fetchVoteDetail(voteIdx);
        if (!info) return;
        setForm({
            voteTitl: info.voteTitl, voteExpl: info.voteExpl || '',
            targetType: info.targetType, targetAthrtyCd: info.targetAthrtyCd || '',
            voteMode: info.voteMode, anonymousYn: info.anonymousYn,
            bgngDt: info.bgngDt?.substring(0, 10), endDt: info.endDt?.substring(0, 10)
        });
        setOptions((info.options || []).map(o => ({ idx: o.idx, optNm: o.optNm })));
        setSelectedUserIdxList((info.targets || []).map(t => t.userIdx));
        setSelectedUserNames((info.targets || []).map(t => t.userNm));
    };

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const setField = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

    const addOption = () => setOptions(prev => [...prev, { optNm: '' }]);
    const removeOption = (index) => setOptions(prev => prev.filter((_, i) => i !== index));
    const updateOption = (index, value) => setOptions(prev => prev.map((o, i) => i === index ? { ...o, optNm: value } : o));

    const handleStaffPickerConfirm = (idxList, users) => {
        setSelectedUserIdxList(idxList);
        setSelectedUserNames(users.map(u => u.userNm));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const validOptions = options.filter(o => o.optNm && o.optNm.trim());
        if (validOptions.length < 2) {
            alert('보기는 최소 2개 이상 입력해야 합니다.');
            return;
        }
        if (form.targetType === 'DEPT' && !form.targetAthrtyCd) {
            alert('대상 부서(권한)를 선택하세요.');
            return;
        }
        if (form.targetType === 'SELECTED' && selectedUserIdxList.length === 0) {
            alert('지정 인원을 한 명 이상 선택하세요.');
            return;
        }
        const payload = {
            ...form,
            idx: voteIdx ? Number(voteIdx) : undefined,
            options: validOptions,
            targetUserIdxList: form.targetType === 'SELECTED' ? selectedUserIdxList : []
        };
        const saved = await saveVote(payload);
        if (saved) {
            if (mode === 'INSERT') navigate(`/admin/vote/write?voteIdx=${saved.idx}`);
            else {
                alert('저장되었습니다.');
                loadDetail();
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{mode === 'INSERT' ? '투표 등록' : '투표 상세'}</h2>
                <button onClick={() => navigate('/admin/vote')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">투표 정보</span>
                    {canEdit && <button type="submit" form="voteForm" className="admin-btn admin-btn-primary">{mode === 'INSERT' ? '투표 등록' : '투표 정보 수정'}</button>}
                </div>
                <div className="admin-card-body">
                    <form id="voteForm" onSubmit={onSubmit}>
                        <div className="admin-form-row">
                            <label className="admin-form-label">제목 *</label>
                            <div className="admin-form-control">
                                <input type="text" name="voteTitl" className="admin-input" placeholder="예) 회식 장소 투표" value={form.voteTitl} onChange={handleFormChange} required disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">설명</label>
                            <div className="admin-form-control">
                                <textarea name="voteExpl" className="admin-input" rows="3" placeholder="투표에 대한 간단한 설명을 남겨보세요." style={{ resize: 'none' }} value={form.voteExpl} onChange={handleFormChange} disabled={!canEdit} />
                            </div>
                        </div>
                        <div className="admin-form-row">
                            <label className="admin-form-label">투표 기간</label>
                            <div className="admin-form-control">
                                <input type="date" name="bgngDt" className="admin-input" value={form.bgngDt} onChange={handleFormChange} disabled={!canEdit} />
                                <span style={{ color: 'var(--text-secondary)' }}>~</span>
                                <input type="date" name="endDt" className="admin-input" value={form.endDt} onChange={handleFormChange} disabled={!canEdit} />
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">공개 여부</label>
                            <div className="admin-form-control" style={{ gap: '10px' }}>
                                <ChoiceCard
                                    selected={form.anonymousYn === 'N'} disabled={!canEdit}
                                    onClick={() => setField('anonymousYn', 'N')}
                                    title="공개" desc="누가 무엇을 찍었는지 보여줍니다"
                                />
                                <ChoiceCard
                                    selected={form.anonymousYn === 'Y'} disabled={!canEdit}
                                    onClick={() => setField('anonymousYn', 'Y')}
                                    title="익명" desc="투표자는 노출되지 않습니다"
                                />
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">투표 방식</label>
                            <div className="admin-form-control" style={{ gap: '10px' }}>
                                <ChoiceCard
                                    selected={form.voteMode === 'NORMAL'} disabled={!canEdit}
                                    onClick={() => setField('voteMode', 'NORMAL')}
                                    title="일반 집계" desc="최다 득표 보기가 1등"
                                />
                                <ChoiceCard
                                    selected={form.voteMode === 'RANDOM'} disabled={!canEdit}
                                    onClick={() => setField('voteMode', 'RANDOM')}
                                    title="랜덤 추첨" desc="사다리타기처럼 완전 동일 확률로 추첨"
                                />
                            </div>
                        </div>

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">투표 대상</label>
                            <div className="admin-form-control" style={{ gap: '10px' }}>
                                <ChoiceCard
                                    selected={form.targetType === 'ALL'} disabled={!canEdit}
                                    onClick={() => setField('targetType', 'ALL')}
                                    title="전체 직원"
                                />
                                <ChoiceCard
                                    selected={form.targetType === 'DEPT'} disabled={!canEdit}
                                    onClick={() => setField('targetType', 'DEPT')}
                                    title="부서(권한)"
                                />
                                <ChoiceCard
                                    selected={form.targetType === 'SELECTED'} disabled={!canEdit}
                                    onClick={() => setField('targetType', 'SELECTED')}
                                    title="지정 인원"
                                />
                            </div>
                        </div>

                        {form.targetType === 'DEPT' && (
                            <div className="admin-form-row">
                                <label className="admin-form-label">대상 부서(권한) *</label>
                                <div className="admin-form-control">
                                    <select name="targetAthrtyCd" className="admin-input" value={form.targetAthrtyCd} onChange={handleFormChange} disabled={!canEdit}>
                                        <option value="">권한 선택</option>
                                        {roleList.map(r => (
                                            <option key={r.athrtyComCd} value={r.athrtyComCd}>{r.athrtyNm}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {form.targetType === 'SELECTED' && (
                            <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                                <label className="admin-form-label">지정 인원 *</label>
                                <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                                    {canEdit && (
                                        <button type="button" onClick={() => setShowStaffPicker(true)} className="admin-btn admin-btn-secondary" style={{ alignSelf: 'flex-start' }}>
                                            인원 선택 ({selectedUserIdxList.length}명 선택됨)
                                        </button>
                                    )}
                                    {selectedUserNames.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {selectedUserNames.map((nm, i) => (
                                                <span key={i} style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '12px', background: 'var(--table-header-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>{nm}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>선택된 인원이 없습니다.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="admin-form-row" style={{ alignItems: 'stretch' }}>
                            <label className="admin-form-label">보기 항목 *</label>
                            <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                                {options.map((opt, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{
                                            flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%',
                                            background: 'var(--table-header-bg)', border: '1px solid var(--border-color)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)'
                                        }}>{index + 1}</span>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            placeholder={`보기 ${index + 1}`}
                                            value={opt.optNm}
                                            onChange={e => updateOption(index, e.target.value)}
                                            disabled={!canEdit}
                                        />
                                        {canEdit && options.length > 2 && (
                                            <button type="button" onClick={() => removeOption(index)} className="admin-btn admin-btn-danger" style={{ flexShrink: 0 }}>삭제</button>
                                        )}
                                    </div>
                                ))}
                                {canEdit && (
                                    <button type="button" onClick={addOption} className="admin-btn admin-btn-secondary" style={{ alignSelf: 'flex-start' }}>+ 보기 추가</button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <StaffPickerModal
                isOpen={showStaffPicker}
                onClose={() => setShowStaffPicker(false)}
                sysId={defaultSysId}
                initialSelected={selectedUserIdxList}
                onConfirm={handleStaffPickerConfirm}
            />
        </div>
    );
};

export default VoteDetail;
