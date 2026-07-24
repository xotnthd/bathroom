import React, { useState, useEffect } from 'react';
import { getCommonCodes } from '../utils/commonCode';

/**
 * 범용 공통코드 UI 렌더러 컴포넌트
 * @param {string} grpCd - 조회할 공통코드 그룹 (예: 'SYS_SE_CD')
 * @param {string} type - 렌더링 타입 ('radio', 'select', 'checkbox')
 * @param {string} name - input의 name 속성
 * @param {any} value - 현재 선택된 값 (checkbox의 경우 배열)
 * @param {function} onChange - 상태 변경 핸들러
 * @param {string} defaultOption - select 박스일 때 기본 문구 (예: '선택하세요')
 * @param {boolean} disabled - 비활성화 여부
 */
const CommonCodePicker = ({ grpCd, type = 'select', name, value, onChange, defaultOption = null, disabled = false }) => {
    const [codeList, setCodeList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchCodes = async () => {
            setIsLoading(true);
            const codes = await getCommonCodes(grpCd);
            if (isMounted) {
                setCodeList(codes);
                setIsLoading(false);
            }
        };
        fetchCodes();
        return () => { isMounted = false; };
    }, [grpCd]);

    if (isLoading) {
        return <span style={{ color: '#95a5a6', fontSize: '13px' }}>Loading...</span>;
    }

    if (codeList.length === 0) {
        return <span style={{ color: '#e74c3c', fontSize: '13px' }}>코드 데이터 없음</span>;
    }

    // 1) 셀렉트 박스(콤보) 렌더링
    if (type === 'select') {
        return (
            <select name={name} value={value || ''} onChange={onChange} disabled={disabled} style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc', opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
                {defaultOption && <option value="">{defaultOption}</option>}
                {codeList.map(code => (
                    <option key={code.comCd} value={code.comCd}>{code.cdNm}</option>
                ))}
            </select>
        );
    }

    // 2) 라디오 버튼 렌더링
    if (type === 'radio') {
        return (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: 1, opacity: disabled ? 0.6 : 1 }}>
                {codeList.map(code => (
                    <label key={code.comCd} style={{ cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="radio"
                            name={name}
                            value={code.comCd}
                            checked={value === code.comCd}
                            onChange={onChange}
                            disabled={disabled}
                        />
                        {code.cdNm}
                    </label>
                ))}
            </div>
        );
    }

    // 3) 체크박스 렌더링 (다중 선택 고려)
    if (type === 'checkbox') {
        // value가 배열이 아닐 경우를 대비한 방어 코드
        const checkedList = Array.isArray(value) ? value : [];

        const handleCheckboxChange = (e) => {
            const currentVal = e.target.value;
            const isChecked = e.target.checked;
            let newList = [...checkedList];

            if (isChecked) newList.push(currentVal);
            else newList = newList.filter(val => val !== currentVal);

            // 상위 onChange에 커스텀 이벤트 객체를 만들어 전달
            onChange({ target: { name, value: newList } });
        };

        return (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: 1, opacity: disabled ? 0.6 : 1 }}>
                {codeList.map(code => (
                    <label key={code.comCd} style={{ cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="checkbox"
                            name={name}
                            value={code.comCd}
                            checked={checkedList.includes(code.comCd)}
                            onChange={handleCheckboxChange}
                            disabled={disabled}
                        />
                        {code.cdNm}
                    </label>
                ))}
            </div>
        );
    }

    return null;
};

export default CommonCodePicker;