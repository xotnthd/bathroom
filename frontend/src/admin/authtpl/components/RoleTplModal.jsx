import React, { useEffect, useState } from 'react';
import Modal from '../../../components/common/Modal';
import CommonCodePicker from '../../../components/CommonCodePicker';
import RoleCodePickerModal from './RoleCodePickerModal';
import { apiClient } from '../../../utils/apiClient';

const RoleTplModal = ({ isOpen, onClose, mode, formData, setFormData, handleSave, roleList = [] }) => {
    const [coreRoleOptions, setCoreRoleOptions] = useState([]);
    const [pickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const fetchCoreRoles = async () => {
            const res = await apiClient(`/admin/api/auth/role/list?sysId=CORE&sysSeCd=${formData.sysSeCd || 'MG'}`);
            if (res.ok) {
                const data = await res.json();
                // S001/SUPR은 CORE 전용 최상위 권한이라 테넌트 템플릿으로 맵핑 대상이 될 수 없음 - 목록에서 제외
                setCoreRoleOptions(data.filter(r => r.athrtyComCd !== 'S001' && r.athrtyComCd !== 'SUPR'));
            }
        };
        fetchCoreRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, formData.sysSeCd]);

    if (!isOpen) return null;

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!formData.athrtyTplCd) {
            alert('역할 코드를 선택해주세요.');
            return;
        }
        const ok = await handleSave(formData);
        if (ok) onClose();
    };

    const handlePick = (role) => {
        setFormData({
            ...formData,
            athrtyTplCd: role.athrtyComCd,
            athrtyNm: formData.athrtyNm ? formData.athrtyNm : role.athrtyNm
        });
        setPickerOpen(false);
    };

    const selectedRole = coreRoleOptions.find(r => r.athrtyComCd === formData.athrtyTplCd);
    const selectedLabel = formData.athrtyTplCd
        ? `${formData.athrtyTplCd}${selectedRole ? ` - ${selectedRole.athrtyNm}` : ''}`
        : '';

    // 레벨은 사람이 입력하지 않음 - 등록 시 서버가 "같은 부서 내 기존 최대 레벨 + 1"로 자동 배정.
    // 여기 표시되는 값은 그 결과를 미리 보여주는 용도(수정 모드에서는 이미 배정된 실제 값).
    const maxExistingLevel = roleList.reduce((max, r) => (typeof r.athrtyLevel === 'number' && r.athrtyLevel > max ? r.athrtyLevel : max), 0);
    const levelPreview = mode === 'INSERT' ? maxExistingLevel + 1 : formData.athrtyLevel;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                width="500px"
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
                title={`역할 템플릿 ${mode === 'INSERT' ? '등록' : '수정'}`}
                footer={
                    <>
                        <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">취소</button>
                        <button type="submit" form="roleTplForm" className="admin-btn admin-btn-primary">
                            {mode === 'INSERT' ? '등록' : '수정'}
                        </button>
                    </>
                }
            >
                <form id="roleTplForm" onSubmit={onSubmit}>
                    <div className="admin-form-row">
                        <label className="admin-form-label">시스템 구분</label>
                        <div className="admin-form-control">
                            <CommonCodePicker
                                grpCd="SYS_SE_CD"
                                type="select"
                                name="sysSeCd"
                                value={formData.sysSeCd}
                                onChange={e => setFormData({ ...formData, sysSeCd: e.target.value })}
                                defaultOption="선택하세요"
                                disabled={mode === 'UPDATE'}
                            />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">역할 코드</label>
                        <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '4px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" className="admin-input" readOnly value={selectedLabel} placeholder="목록에서 역할을 선택하세요" style={{ flex: 1, background: '#f8f9fa' }} />
                                {mode === 'INSERT' && (
                                    <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setPickerOpen(true)}>목록에서 선택</button>
                                )}
                            </div>
                            {coreRoleOptions.length === 0 && (
                                <span style={{ fontSize: '12px', color: '#e74c3c' }}>CORE 권한 매트릭스 관리에 해당 구분(MG/US)으로 등록된 역할이 없습니다. 먼저 등록해주세요.</span>
                            )}
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">역할 명칭</label>
                        <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '4px' }}>
                            <input type="text" className="admin-input" placeholder="예) 부서장" value={formData.athrtyNm || ''} onChange={e => setFormData({ ...formData, athrtyNm: e.target.value })} required />
                            <span style={{ fontSize: '12px', color: '#888' }}>코드는 CORE 매트릭스와 매핑되지만, 명칭은 이 부서 템플릿에 맞게 자유롭게 바꿀 수 있습니다.</span>
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">설명</label>
                        <div className="admin-form-control">
                            <textarea className="admin-textarea" rows="3" value={formData.cdExpl || ''} onChange={e => setFormData({ ...formData, cdExpl: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">권한 레벨</label>
                        <div className="admin-form-control" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '4px' }}>
                            <input type="text" className="admin-input" readOnly value={levelPreview} style={{ background: '#f8f9fa', fontWeight: 'bold' }} />
                            <span style={{ fontSize: '12px', color: '#888' }}>
                                {mode === 'INSERT'
                                    ? '수동 입력 불가 - 같은 부서 템플릿 내 기존 최대 레벨보다 자동으로 1 크게(더 낮은 권한으로) 배정됩니다.'
                                    : '레벨은 등록 시 한 번만 자동 배정되며 이후 수정할 수 없습니다.'}
                            </span>
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label className="admin-form-label">사용 여부</label>
                        <div className="admin-form-control">
                            <label style={{ marginRight: '15px' }}><input type="radio" name="roleUseYn" value="Y" checked={formData.useYn === 'Y'} onChange={() => setFormData({ ...formData, useYn: 'Y' })} style={{ marginRight: '5px' }} />사용</label>
                            <label><input type="radio" name="roleUseYn" value="N" checked={formData.useYn === 'N'} onChange={() => setFormData({ ...formData, useYn: 'N' })} style={{ marginRight: '5px' }} />중지</label>
                        </div>
                    </div>
                </form>
            </Modal>

            <RoleCodePickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                roleOptions={coreRoleOptions}
                onSelect={handlePick}
            />
        </>
    );
};

export default RoleTplModal;
