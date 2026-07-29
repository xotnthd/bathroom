import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuAuth } from '../hooks/useMenuAuth';
import { MENU_IDS } from '../menuIds';
import { useVoteManage } from './hooks/useVoteManage';

const TARGET_TYPE_NM = { ALL: '전체 직원', DEPT: '부서(권한)', SELECTED: '지정 인원' };
const VOTE_MODE_NM = { NORMAL: '일반 집계', RANDOM: '랜덤 추첨' };
const STAT_NM = { READY: '예정', OPEN: '진행중', CLOSED: '마감' };
const STAT_COLOR = { READY: '#7f8c8d', OPEN: '#27ae60', CLOSED: '#e74c3c' };
const STAT_BG = { READY: 'rgba(149, 165, 166, 0.12)', OPEN: 'rgba(46, 204, 113, 0.12)', CLOSED: 'rgba(231, 76, 60, 0.12)' };

const Badge = ({ children, color, bg }) => (
    <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
        fontSize: '12px', fontWeight: 'bold', color, background: bg
    }}>{children}</span>
);

const VoteResultList = () => {
    const navigate = useNavigate();
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { inqireYn } = useMenuAuth(MENU_IDS.VOTE_RESULT);
    const { voteList, fetchVoteListForResult } = useVoteManage(defaultSysId);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        if (inqireYn === 'Y') fetchVoteListForResult('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inqireYn]);

    if (inqireYn === 'N') {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>조회 권한이 없습니다.</div>;
    }

    const handleSearch = () => fetchVoteListForResult(searchKeyword);
    const handleReset = () => { setSearchKeyword(''); fetchVoteListForResult(''); };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>

            <div className="admin-card">
                <div className="admin-card-header" style={{ padding: '12px 20px', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '10px 24px' }}>
                    <span className="admin-card-title">투표 결과 관리</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>제목:</span>
                        <input
                            type="text"
                            className="admin-input"
                            style={{ padding: '4px 8px', width: '220px' }}
                            placeholder="투표 제목 검색"
                            value={searchKeyword}
                            onChange={e => setSearchKeyword(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button type="button" onClick={handleSearch} className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }}>조회</button>
                        <button type="button" onClick={handleReset} className="admin-btn admin-btn-secondary">초기화</button>
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="admin-card-header">
                    <span className="admin-card-title">투표 목록 (총 {voteList.length}건)</span>
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--table-header-bg, #f4f7f6)', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left', paddingLeft: '20px' }}>제목</th>
                                <th style={{ padding: '12px' }}>대상</th>
                                <th style={{ padding: '12px' }}>방식</th>
                                <th style={{ padding: '12px' }}>기간</th>
                                <th style={{ padding: '12px' }}>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voteList.map(v => (
                                <tr key={v.idx} onClick={() => navigate(`/admin/vote/result?voteIdx=${v.idx}`)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color, #eee)' }} className="admin-table-row-hover">
                                    <td style={{ padding: '12px', paddingLeft: '20px', textAlign: 'left', color: '#2980b9', fontWeight: 500 }}>{v.voteTitl}</td>
                                    <td style={{ padding: '12px' }}>{TARGET_TYPE_NM[v.targetType] || v.targetType}</td>
                                    <td style={{ padding: '12px' }}>{VOTE_MODE_NM[v.voteMode] || v.voteMode}</td>
                                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{v.bgngDt?.substring(0, 10)} ~ {v.endDt?.substring(0, 10)}</td>
                                    <td style={{ padding: '12px' }}>
                                        <Badge color={STAT_COLOR[v.statCd]} bg={STAT_BG[v.statCd]}>{STAT_NM[v.statCd] || v.statCd}</Badge>
                                    </td>
                                </tr>
                            ))}
                            {voteList.length === 0 && (
                                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#95a5a6' }}>등록된 투표가 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VoteResultList;
