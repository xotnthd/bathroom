import React from 'react';
import CommonCodePicker from '../../../components/CommonCodePicker';

const SurveyBasicInfo = ({ form, setForm }) => {
    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>기본 정보</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', alignItems: 'center' }}>
                <label style={{ fontWeight: 'bold' }}>설문 제목</label>
                <input
                    type="text"
                    value={form.survNm}
                    onChange={e => setForm({...form, survNm: e.target.value})}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    placeholder="설문명"
                />

                <label style={{ fontWeight: 'bold' }}>설문 안내</label>
                <textarea
                    value={form.survExpl || ''}
                    onChange={e => setForm({...form, survExpl: e.target.value})}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', height: '60px', resize: 'vertical' }}
                    placeholder="설문안내"
                />

                <label style={{ fontWeight: 'bold' }}>시스템 구분</label>
                <div style={{ flex: 1, display: 'flex', gap: '15px' }}>
                    <CommonCodePicker
                        grpCd="SYS_SE_CD"
                        type="radio"
                        name="sysSeCd"
                        value={form.sysSeCd}
                        onChange={(e) => setForm({...form, sysSeCd: e.target.value})}
                    />
                </div>

                <label style={{ fontWeight: 'bold' }}>사용 여부</label>
                <select
                    value={form.useYn}
                    onChange={e => setForm({...form, useYn: e.target.value})}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                >
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                </select>

                <label style={{ fontWeight: 'bold' }}>기간 설정</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="datetime-local"
                        value={form.startDt || ''}
                        onChange={e => setForm({...form, startDt: e.target.value})}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <span>~</span>
                    <input
                        type="datetime-local"
                        value={form.endDt || ''}
                        onChange={e => setForm({...form, endDt: e.target.value})}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <span style={{ fontSize: '12px', color: '#888' }}>(비워두면 상시 노출)</span>
                </div>
            </div>
        </div>
    );
};

export default SurveyBasicInfo;
