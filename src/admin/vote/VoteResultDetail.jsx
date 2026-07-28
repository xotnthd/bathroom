import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVoteManage } from './hooks/useVoteManage';

const TARGET_TYPE_NM = { ALL: '전체 직원', DEPT: '부서(권한)', SELECTED: '지정 인원' };
const VOTE_MODE_NM = { NORMAL: '일반 집계', RANDOM: '랜덤 추첨' };
const STAT_NM = { READY: '예정', OPEN: '진행중', CLOSED: '마감' };

const VoteResultDetail = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const voteIdx = new URLSearchParams(routerLocation.search).get('voteIdx');

    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { fetchVoteDetailForResult, fetchEligibility, castVote, fetchResult, drawWinner } = useVoteManage(defaultSysId);

    const [vote, setVote] = useState(null);
    const [options, setOptions] = useState([]);
    const [eligibility, setEligibility] = useState(null);
    const [myChoiceOptIdx, setMyChoiceOptIdx] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voteIdx]);

    const loadAll = async () => {
        const info = await fetchVoteDetailForResult(voteIdx);
        if (!info) return;
        setVote(info);
        setOptions(info.options || []);

        const elig = await fetchEligibility(voteIdx);
        setEligibility(elig);
        if (elig?.myOptIdx) setMyChoiceOptIdx(elig.myOptIdx);

        const res = await fetchResult(voteIdx);
        setResult(res);
    };

    if (!vote) return null;

    const stat = (() => {
        const today = new Date().toISOString().substring(0, 10);
        const bgng = vote.bgngDt?.substring(0, 10);
        const end = vote.endDt?.substring(0, 10);
        if (today < bgng) return 'READY';
        if (today > end) return 'CLOSED';
        return 'OPEN';
    })();

    const onCastVote = async () => {
        if (!myChoiceOptIdx) { alert('보기를 선택하세요.'); return; }
        const ok = await castVote(voteIdx, myChoiceOptIdx);
        if (ok) {
            alert('투표가 완료되었습니다.');
            setResult(await fetchResult(voteIdx));
            setEligibility(await fetchEligibility(voteIdx));
        }
    };

    const onDraw = async () => {
        if (!window.confirm('추첨을 진행하시겠습니까? 한 번 추첨하면 다시 뽑을 수 없습니다.')) return;
        const res = await drawWinner(voteIdx);
        if (res) setResult(res);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>투표 상세</h2>
                <button onClick={() => navigate('/admin/vote/result/list')} className="admin-btn admin-btn-secondary">목록으로</button>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">투표 안내</span>
                </div>
                <div className="admin-card-body" style={{ padding: 0 }}>
                    <div className="admin-form-row">
                        <label className="admin-form-label">제목</label>
                        <div className="admin-form-control">{vote.voteTitl}</div>
                    </div>
                    {vote.voteExpl && (
                        <div className="admin-form-row">
                            <label className="admin-form-label">설명</label>
                            <div className="admin-form-control">{vote.voteExpl}</div>
                        </div>
                    )}
                    <div className="admin-form-row">
                        <label className="admin-form-label">대상</label>
                        <div className="admin-form-control">{TARGET_TYPE_NM[vote.targetType] || vote.targetType}</div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">방식</label>
                        <div className="admin-form-control">{VOTE_MODE_NM[vote.voteMode] || vote.voteMode}</div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">기간</label>
                        <div className="admin-form-control">{vote.bgngDt?.substring(0, 10)} ~ {vote.endDt?.substring(0, 10)}</div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">상태</label>
                        <div className="admin-form-control">{STAT_NM[stat]}</div>
                    </div>
                </div>
            </div>

            {eligibility?.eligible && (
                <div className="admin-card" style={{ marginTop: '16px' }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">투표하기</span>
                        {eligibility.withinPeriod && (
                            <button type="button" onClick={onCastVote} className="admin-btn admin-btn-primary">
                                {eligibility.myOptIdx ? '투표 변경' : '투표 제출'}
                            </button>
                        )}
                    </div>
                    <div className="admin-card-body">
                        {!eligibility.withinPeriod ? (
                            <p style={{ color: 'var(--text-secondary)', margin: 0, textAlign: 'center', fontSize: '15px', padding: '20px 0' }}>투표 기간이 아닙니다.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {options.map(opt => {
                                    const isChoice = String(myChoiceOptIdx) === String(opt.idx);
                                    return (
                                        <div
                                            key={opt.idx}
                                            onClick={() => setMyChoiceOptIdx(opt.idx)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                                                border: `2px solid ${isChoice ? 'var(--primary-color, #3498db)' : 'var(--border-color)'}`,
                                                borderRadius: '8px', cursor: 'pointer',
                                                background: isChoice ? 'rgba(52, 152, 219, 0.08)' : 'transparent',
                                                transition: 'border-color 0.15s, background 0.15s'
                                            }}
                                        >
                                            <span style={{
                                                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                                                border: `2px solid ${isChoice ? 'var(--primary-color, #3498db)' : 'var(--border-color)'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {isChoice && <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-color, #3498db)' }} />}
                                            </span>
                                            <span style={{ fontWeight: isChoice ? 'bold' : 'normal' }}>{opt.optNm}</span>
                                        </div>
                                    );
                                })}
                                {eligibility.myOptIdx && (
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>이미 투표하셨습니다. 다시 제출하면 선택이 변경됩니다.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {result && (
                <div className="admin-card" style={{ marginTop: '16px' }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">투표 결과 <span style={{ fontWeight: 'normal', fontSize: '13px', color: 'var(--text-secondary)' }}>(총 {result.totalVoteCnt}표)</span></span>
                        {vote.voteMode === 'RANDOM' && !result.winnerOptIdx && (
                            <button type="button" onClick={onDraw} className="admin-btn admin-btn-primary">추첨하기</button>
                        )}
                    </div>
                    <div className="admin-card-body">
                        {vote.voteMode === 'RANDOM' && !result.winnerOptIdx && (
                            <div style={{ background: 'var(--table-header-bg)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                아직 추첨 전입니다. 투표 마감 후 추첨할 수 있습니다.
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {result.counts.map(c => {
                                const isWinner = result.winnerOptIdx === c.optIdx;
                                const pct = result.totalVoteCnt > 0 ? Math.round((c.voteCnt / result.totalVoteCnt) * 100) : 0;
                                const votersForOpt = (result.voters || []).filter(v => v.optIdx === c.optIdx);
                                return (
                                    <div
                                        key={c.optIdx}
                                        style={{
                                            padding: '12px 14px', borderRadius: '10px',
                                            border: `1px solid ${isWinner ? '#f0b060' : 'var(--border-color)'}`,
                                            background: isWinner ? 'rgba(230, 126, 34, 0.06)' : 'transparent'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontWeight: isWinner ? 'bold' : 500, color: isWinner ? '#e67e22' : 'var(--text-primary)' }}>{c.optNm}</span>
                                                {isWinner && (
                                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#e67e22', border: '1px solid #e67e22', borderRadius: '10px', padding: '1px 8px' }}>1등</span>
                                                )}
                                            </span>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>{c.voteCnt}표 <span style={{ fontWeight: 'normal' }}>({pct}%)</span></span>
                                        </div>
                                        <div style={{ width: '100%', background: 'var(--table-header-bg)', borderRadius: '20px', height: '14px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${Math.max(pct, c.voteCnt > 0 ? 3 : 0)}%`, height: '100%', borderRadius: '20px',
                                                background: isWinner ? 'linear-gradient(90deg, #f39c12, #e67e22)' : 'linear-gradient(90deg, #5dade2, #3498db)',
                                                transition: 'width 0.4s ease-out'
                                            }} />
                                        </div>
                                        {vote.anonymousYn === 'N' && votersForOpt.length > 0 && (
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                                {votersForOpt.map(v => v.userNm).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoteResultDetail;
