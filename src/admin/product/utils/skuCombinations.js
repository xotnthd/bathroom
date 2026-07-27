// 선택된 옵션 그룹들의 옵션 값 목록으로 모든 조합(카테시안 곱)을 계산.
// valueListsByGroup: [{ optGrpNm, values: [{idx, optValNm}, ...] }, ...]
// 반환: [{ optValIdxList: [idx,...], label: "색상:빨강, 사이즈:M" }, ...]
export const generateSkuCombinations = (valueListsByGroup) => {
    const groupsWithValues = valueListsByGroup.filter(g => g.values.length > 0);
    if (groupsWithValues.length === 0) {
        return [{ optValIdxList: [], label: '옵션 없음' }];
    }
    let combos = [{ optValIdxList: [], labelParts: [] }];
    for (const group of groupsWithValues) {
        const next = [];
        for (const combo of combos) {
            for (const val of group.values) {
                next.push({
                    optValIdxList: [...combo.optValIdxList, val.idx],
                    labelParts: [...combo.labelParts, `${group.optGrpNm}:${val.optValNm}`]
                });
            }
        }
        combos = next;
    }
    return combos.map(c => ({ optValIdxList: c.optValIdxList, label: c.labelParts.join(', ') }));
};
