import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';

import SurveyMasterInfo from './components/result/SurveyMasterInfo';
import SurveyStatistics from './components/result/SurveyStatistics';
import RespondentList from './components/result/RespondentList';
import IndividualAnswers from './components/result/IndividualAnswers';

const SurveyResultDetail = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const { survId } = useParams();
    const navigate = useNavigate();

    const [survey, setSurvey] = useState(null);
    const [respondents, setRespondents] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [selectedRespId, setSelectedRespId] = useState(null);

    useEffect(() => {
        fetchSurveyDetail();
        fetchRespondents();
        fetchStatistics();
    }, [survId]);

    useEffect(() => {
        if (selectedRespId) {
            fetchAnswers(selectedRespId);
        } else {
            setAnswers([]);
        }
    }, [selectedRespId]);

    const fetchSurveyDetail = async () => {
        const res = await apiClient('/admin/api/survey/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, survId })
        });
        if (res.ok) {
            const data = await res.json();
            setSurvey(data);
        } else {
            alert('설문 정보를 불러오지 못했습니다.');
            navigate('/admin/survey/result/list');
        }
    };

    const fetchRespondents = async () => {
        const res = await apiClient('/admin/api/survey/result/respondents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, survId })
        });
        if (res.ok) {
            const data = await res.json();
            setRespondents(data || []);
        }
    };

    const fetchStatistics = async () => {
        const res = await apiClient('/admin/api/survey/result/statistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, survId })
        });
        if (res.ok) {
            const data = await res.json();
            setStatistics(data || []);
        }
    };

    const fetchAnswers = async (respId) => {
        const res = await apiClient('/admin/api/survey/result/answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, survId, respId })
        });
        if (res.ok) {
            const data = await res.json();
            setAnswers(data || []);
        }
    };

    if (!survey) return <div style={{ padding: '20px' }}>Loading...</div>;

    // 통계 데이터 가공
    const statsByQstn = statistics.reduce((acc, curr) => {
        if (!acc[curr.qstnSn]) {
            acc[curr.qstnSn] = {
                qstnSn: curr.qstnSn,
                qstnTxt: curr.qstnTxt,
                qstnType: curr.qstnType,
                totalAns: 0,
                options: []
            };
        }
        acc[curr.qstnSn].totalAns += curr.ansCnt;
        acc[curr.qstnSn].options.push(curr);
        return acc;
    }, {});
    const statList = Object.values(statsByQstn).sort((a, b) => a.qstnSn - b.qstnSn);

    // 질문 목록 정렬
    const questions = [...(survey.questions || [])].sort((a, b) => a.ordNo - b.ordNo);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            
            <SurveyMasterInfo survey={survey} />

            <SurveyStatistics statList={statList} totalRespondents={respondents.length} />

            <RespondentList
                respondents={respondents}
                selectedRespId={selectedRespId}
                onSelectRespondent={setSelectedRespId}
            />

            <IndividualAnswers
                questions={questions}
                answers={answers}
                selectedRespId={selectedRespId}
            />

        </div>
    );
};

export default SurveyResultDetail;
