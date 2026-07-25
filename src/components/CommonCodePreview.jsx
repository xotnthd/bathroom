import React, { useState, useEffect } from 'react';
import { getCommonCodes } from '../utils/commonCode';

/**
 * 계층형 공통코드에서 선택된 부모(2뎁스) 아래 자식(3뎁스) 목록을 읽기 전용 배지로 미리보기 표시.
 * "이 체계를 선택하면 어떤 값들이 들어있는지" 바로 옆에서 확인하기 위한 용도 (선택 컨트롤 아님).
 * @param {string} grpCd - 공통코드 그룹
 * @param {string} uprComCd - 미리볼 부모(2뎁스) 코드. 없으면 아무것도 렌더링하지 않음
 * @param {string} sysId - 조회할 테넌트 (생략 시 현재 활성 시스템)
 */
const CommonCodePreview = ({ grpCd, uprComCd, sysId }) => {
    const [codes, setCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const effectiveSysId = sysId || sessionStorage.getItem('currentSysId') || 'CORE';

    useEffect(() => {
        let isMounted = true;
        if (!uprComCd) {
            setCodes([]);
            return;
        }
        setIsLoading(true);
        getCommonCodes(grpCd, effectiveSysId, uprComCd).then(result => {
            if (isMounted) {
                setCodes(result);
                setIsLoading(false);
            }
        });
        return () => { isMounted = false; };
    }, [grpCd, uprComCd, effectiveSysId]);

    if (!uprComCd) return null;
    if (isLoading) return <span style={{ fontSize: '12px', color: '#95a5a6' }}>불러오는 중...</span>;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            {codes.length === 0 ? (
                <span style={{ fontSize: '12px', color: '#e74c3c' }}>등록된 하위 항목이 없습니다.</span>
            ) : (
                codes.map(c => (
                    <span key={c.comCd} style={{ padding: '3px 10px', background: '#eef2f3', color: '#2c3e50', borderRadius: '12px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {c.cdNm}
                    </span>
                ))
            )}
        </div>
    );
};

export default CommonCodePreview;
