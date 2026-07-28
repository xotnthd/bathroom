import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useMenuAuth } from '../hooks/useMenuAuth';
import TemplateSearchModal from './TemplateSearchModal';
import SurveyBasicInfo from './components/SurveyBasicInfo';
import DeployQuestionList from './components/deploy/DeployQuestionList';

const SurveyDeployForm = () => {
    const defaultSysId = sessionStorage.getItem('currentSysId') || 'CORE';
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const survId = queryParams.get('survId');
    const { inqireYn, rgstYn, mdfcnYn } = useMenuAuth();

    const [form, setForm] = useState({
        survNm: '',
        survExpl: '',
        templateYn: 'N',
        useYn: 'Y',
        startDt: '',
        endDt: '',
        sysSeCd: 'US',
        questions: []
    });

    const [showTemplateModal, setShowTemplateModal] = useState(false);

    useEffect(() => {
        if (inqireYn === 'Y') {
            if (survId) {
                fetchSurveyDetail();
            }
        } else if (inqireYn === 'N') {
            alert('조회 권한이 없습니다. 관리자에게 문의하세요.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [survId, inqireYn]);

    const fetchSurveyDetail = async () => {
        const res = await apiClient('/admin/api/survey/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sysId: defaultSysId, survId })
        });
        if (res.ok) {
            const data = await res.json();
            // 계층변환
            const questions = (data.questions || []).map(q => {
                q.options = (data.options || []).filter(o => o.qstnSn === q.qstnSn);
                return q;
            });
            data.questions = questions;
            
            // Format dates for input type="datetime-local"
            if (data.startDt) data.startDt = new Date(data.startDt).toISOString().slice(0, 16);
            if (data.endDt) data.endDt = new Date(data.endDt).toISOString().slice(0, 16);

            setForm(data);
        }
    };

    const handleSave = async () => {
        if (survId ? (mdfcnYn !== 'Y') : (rgstYn !== 'Y')) {
            alert('등록/수정 권한이 없습니다.');
            return;
        }
        if (!form.survNm) return alert("설문 제목을 입력하세요.");
        
        const payload = {
            ...form,
            sysId: defaultSysId,
            templateYn: 'N' // 배포 강제
        };
        if (survId) payload.survId = survId;

        const res = await apiClient('/admin/api/survey/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            alert("저장되었습니다.");
            navigate('/admin/survey/deploy');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>{survId ? '배포 설문 수정' : '신규 배포 설문 등록'}</h2>
                <div>
                    {!survId && (
                        <button onClick={() => setShowTemplateModal(true)} style={{ padding: '8px 16px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>템플릿 불러오기</button>
                    )}
                    <button onClick={() => navigate('/admin/survey/deploy')} style={{ padding: '8px 16px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>목록</button>
                    {((survId && mdfcnYn === 'Y') || (!survId && rgstYn === 'Y')) && (
                        <button onClick={handleSave} style={{ padding: '10px 20px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>저장</button>
                    )}
                </div>
            </div>

            <SurveyBasicInfo form={form} setForm={setForm} />

            <DeployQuestionList form={form} setForm={setForm} />

            {showTemplateModal && (
                <TemplateSearchModal 
                    onClose={() => setShowTemplateModal(false)}
                    onSelect={(data) => {
                        setForm({
                            ...form,
                            survNm: data.survNm,
                            survExpl: data.survExpl,
                            sysSeCd: data.sysSeCd || 'US',
                            questions: data.questions || []
                        });
                        setShowTemplateModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default SurveyDeployForm;
