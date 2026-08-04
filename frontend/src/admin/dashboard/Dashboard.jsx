import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';

const calcDday = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
    return diffDays;
};

const StatCard = ({ label, value }) => (
    <div style={{ flex: 1, minWidth: '160px', background: 'var(--surface-1, #f8f9fa)', borderRadius: 'var(--border-radius, 8px)', padding: '18px 20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{value}</div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const currentSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const res = await apiClient(`/admin/api/dashboard/summary?sysId=${currentSysId}`);
            if (res.ok) setSummary(await res.json());
        };
        fetchSummary();
    }, [currentSysId]);

    const stats = summary?.stats || {};
    const dday = calcDday(stats.serviceEndde);
    const activeVotes = summary?.activeVotes || [];
    const activeSurveys = summary?.activeSurveys || [];
    const recentLogs = summary?.recentLogs || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* A 영역: 요약 통계 (전체 너비) */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <span className="admin-card-title">요약 통계</span>
                </div>
                <div className="admin-card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <StatCard label="소속 회원 수" value={stats.memberCount ?? '-'} />
                    <StatCard label="이번 달 신규가입" value={stats.newMembersThisMonth ?? '-'} />
                    <StatCard label="현재 요금제" value={stats.currentPayPlanNm || '미지정'} />
                    <StatCard
                        label="서비스 만료까지"
                        value={dday === null ? '-' : (dday >= 0 ? `D-${dday}` : `만료 (D+${Math.abs(dday)})`)}
                    />
                </div>
            </div>

            {/* B/C 영역: 좌우 분할 */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>

                {/* B 영역: 최근 활동 로그 */}
                <div className="admin-card" style={{ flex: 1, minWidth: '320px' }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">최근 활동 로그</span>
                    </div>
                    <div className="admin-card-body" style={{ padding: 0 }}>
                        {recentLogs.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>최근 활동 내역이 없습니다.</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <tbody>
                                    {recentLogs.map((log, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '10px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                                {log.regDt ? String(log.regDt).replace('T', ' ').substring(0, 16) : '-'}
                                            </td>
                                            <td style={{ padding: '10px 16px', fontWeight: 'bold' }}>{log.userId}</td>
                                            <td style={{ padding: '10px 16px' }}>{log.fnctnNm}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* C 영역: 진행중인 투표/설문 */}
                <div className="admin-card" style={{ flex: 1, minWidth: '320px' }}>
                    <div className="admin-card-header">
                        <span className="admin-card-title">진행중인 투표/설문</span>
                    </div>
                    <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {activeVotes.length === 0 && activeSurveys.length === 0 && (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>진행중인 투표/설문이 없습니다.</div>
                        )}
                        {activeVotes.map(v => (
                            <div
                                key={`vote-${v.idx}`}
                                onClick={() => navigate(`/admin/vote/write?voteIdx=${v.idx}`)}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '4px', cursor: 'pointer', background: 'var(--bg-color, #f8f9fa)' }}
                            >
                                <span>
                                    <span style={{ background: 'rgba(52, 152, 219, 0.15)', color: '#2980b9', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>투표</span>
                                    {v.voteTitl}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>~{v.endDt}</span>
                            </div>
                        ))}
                        {activeSurveys.map(s => (
                            <div
                                key={`survey-${s.survId}`}
                                onClick={() => navigate(`/admin/survey/deploy/write?survId=${s.survId}`)}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '4px', cursor: 'pointer', background: 'var(--bg-color, #f8f9fa)' }}
                            >
                                <span>
                                    <span style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#27ae60', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>설문</span>
                                    {s.survNm}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>~{s.endDt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
