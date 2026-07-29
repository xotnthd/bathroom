// 화면(컴포넌트)이 자신이 속한 메뉴를 명시적으로 선언하기 위한 menu_id 상수 모음.
// TN_MNU_M001.menu_id 값과 정확히 일치해야 한다 (테넌트마다 sys_id는 다르지만 menu_id는 동일하게 복제됨).
// useMenuAuth(menuId)에 넘겨서 권한을 조회한다 - URL 문자열 매칭에 의존하지 않는다.
export const MENU_IDS = {
    AUTH: 'MNU_AUTH_01',
    AUTH_TEMPLATE: 'MNU_AUTHTPL_01',
    CORP: 'MNU_CORP_01',
    BOARD: 'MNU_BOARD_01',
    BOARD_POST: 'MNU_BOARD_POST',
    CODE: 'MNU_CODE_01',
    MENU: 'MNU_MENU_01',
    PAY: 'MNU_PAY_01',
    POPUP: 'MNU_POP_01',
    PRD_CATEGORY: 'MNU_PRDCTE_01',
    PRD_LOCATION: 'MNU_PRDLOC_01',
    PRD_OPTION: 'MNU_PRDOPT_01',
    PRD_SUPPLIER: 'MNU_PRDSUP_01',
    PRODUCT: 'MNU_PRD_01',
    SURVEY_TEMPLATE: 'MNU_SURVEY_01',
    SURVEY_DEPLOY: 'MNU_SURVEY_02',
    SURVEY_RESULT: 'MNU_SURVEY_03',
    SYS: 'MNU_SYS_01',
    USER: 'MNU_USER_01',
    VOTE: 'MNU_VOTE_01',
    VOTE_RESULT: 'MNU_VOTE_RESULT'
};
