create table bathroom.tn_ath_a001
(
    idx           bigint auto_increment comment '일련번호 (PK)'
        primary key,
    sys_id        varchar(20)      not null comment '시스템 식별 ID',
    sys_se_cd     varchar(20) default 'MG' not null comment '시스템 구분 코드 (MG: 관리자, USER: 사용자)',
    athrty_com_cd varchar(20)      not null comment '권한공통코드 (TN_COM_C002 매핑, 예: A001, A002)',
    athrty_nm     varchar(90)      not null comment '권한 등급명',
    cd_expl       varchar(300)     null comment '권한 설명',
    use_yn        char default 'Y' null comment '사용여부 (Y/N)',
    del_yn        char default 'N' null comment '삭제 여부',
    frst_rgstr_id varchar(50)      not null comment '최초등록자 ID',
    frst_reg_dt   datetime         not null comment '최초등록일시',
    last_mdfr_id  varchar(50)      null comment '최종수정자 ID',
    last_mdfcn_dt datetime         null comment '최종수정일시',
    constraint UQ_TN_ATH_A001
        unique (sys_id, athrty_com_cd)
)
    comment '권한 등급 마스터 테이블' charset = utf8mb4;

create table bathroom.tn_ath_m001
(
    idx           bigint auto_increment comment '일련번호 (PK)'
        primary key,
    sys_id        varchar(20)      not null comment '시스템 식별 ID',
    athrty_com_cd varchar(20)      not null comment '권한공통코드 (TN_ATH_A001.athrty_com_cd)',
    menu_id       varchar(50)      not null comment '메뉴 ID (TN_MNU_M001.menu_id)',
    menu_show_yn  char default 'N' null comment '메뉴 노출 여부',
    inqire_yn     char default 'N' null comment '조회 권한 여부 (Read / Y,N)',
    rgst_yn       char default 'N' null comment '등록 권한 여부 (Create / Y,N)',
    mdfcn_yn      char default 'N' null comment '수정 권한 여부 (Update / Y,N)',
    del_yn        char default 'N' null comment '삭제 권한 여부 (Delete / Y,N)',
    use_yn        char default 'Y' null comment '매핑 활성화 여부 (Y/N)',
    frst_rgstr_id varchar(50)      not null comment '최초등록자 ID',
    frst_reg_dt   datetime         not null comment '최초등록일시',
    last_mdfr_id  varchar(50)      null comment '최종수정자 ID',
    last_mdfcn_dt datetime         null comment '최종수정일시',
    constraint UQ_TN_ATH_M001_MAP
        unique (sys_id, athrty_com_cd, menu_id)
)
    comment '권한별 메뉴 접근 및 CRUD 권한 상세설정 테이블' charset = utf8mb4;

create table bathroom.tn_brd_m001
(
    sys_id        varchar(20)      not null comment '소속 시스템 식별 ID (PK)',
    brd_id        varchar(50)      not null comment '게시판 고유 식별 ID (PK, 예: NOTICE_01)',
    brd_nm        varchar(100)     not null comment '게시판 명칭',
    brd_expl      varchar(500)     null comment '게시판 설명',
    brd_type      varchar(20)      not null comment '게시판 형태 구분 (BOARD_SE_CD 매핑)',
    user_write_yn char default 'Y' null comment '유저 글 작성 가능 여부 (Y/N)',
    user_reply_yn char default 'Y' null comment '유저 댓글 작성 가능 여부 (Y/N)',
    rereply_yn    char default 'Y' null comment '댓글에 댓글(대댓글) 허용 여부 (Y/N)',
    rereply_depth int  default 3   null comment '대댓글 최대 허용 깊이 (최대 3뎁스)',
    atch_file_yn  char default 'N' null comment '첨부파일 허용 여부 (Y/N)',
    use_yn        char default 'Y' null comment '게시판 활성화 여부 (Y/N)',
    del_yn        char default 'N' null comment '게시판 삭제(논리삭제) 여부 (Y/N)',
    frst_rgstr_id varchar(50)      not null comment '최초등록자 ID',
    frst_reg_dt   datetime         not null comment '최초등록일시',
    last_mdfr_id  varchar(50)      null comment '최종수정자 ID',
    last_mdfcn_dt datetime         null comment '최종수정일시',
    primary key (sys_id, brd_id)
)
    comment '동적 카테고리 및 코드 연동 게시판 매니징 마스터 테이블' charset = utf8mb4;

create table bathroom.tn_brd_p001
(
    idx              bigint auto_increment comment '게시물 일련번호 (PK)'
        primary key,
    sys_id           varchar(20)      not null comment '소속 시스템 식별 ID',
    brd_id           varchar(50)      not null comment '소속 게시판 ID (TN_BRD_M001.brd_id)',
    title            varchar(200)     not null comment '게시글 제목',
    content          longtext         not null comment '게시물 본문 내용',
    wrtr_idx         bigint           not null comment '작성자 유저 일련번호 (TN_MEM_M001.idx)',
    wrtr_nm          varchar(60)      not null comment '작성자 이름 스냅샷',
    inq_cnt          int  default 0   null comment '조회수',
    ntc_yn           char default 'N' null comment '상단 고정 공지사항 여부 (Y/N)',
    highlight_yn     char default 'N' null comment '강조 처리 여부 (Y/N)',
    secret_yn        char default 'N' null comment '비밀글 여부 (Y/N)',
    rls_start_dt     datetime         null comment '게시 노출 예약 시작 일시',
    rls_end_dt       datetime         null comment '게시 노출 예약 종료 일시',
    del_yn           char default 'N' null comment '삭제 여부 (Y/N)',
    atch_file_grp_id varchar(100)     null comment '1:N 공통 파일 그룹 식별 ID',
    frst_rgstr_id    varchar(50)      not null comment '최초등록자 ID',
    frst_reg_dt      datetime         not null comment '최초등록일시',
    last_mdfr_id     varchar(50)      null comment '최종수정자 ID',
    last_mdfcn_dt    datetime         null comment '최종수정일시'
)
    comment '게시판 게시물 테이블' charset = utf8mb4;

create index IX_TN_BRD_P001
    on bathroom.tn_brd_p001 (sys_id asc, brd_id asc, del_yn asc, idx desc);

create table bathroom.tn_com_c001
(
    idx           bigint auto_increment comment '일련번호 (PK)'
        primary key,
    sys_id        varchar(20)  not null comment '시스템 식별 ID (멀티 테넌트용)',
    com_cd        varchar(20)  not null comment '공통 그룹코드 (예: CTE_CD)',
    cd_nm         varchar(90)  not null comment '그룹 코드명 (예: 카테고리 구분 코드)',
    cd_expl       varchar(300) null comment '코드 그룹 설명',
    frst_rgstr_id varchar(50)  not null comment '최초등록자 ID',
    frst_reg_dt   datetime     not null comment '최초등록일시',
    last_mdfr_id  varchar(50)  null comment '최종수정자 ID',
    last_mdfcn_dt datetime     null comment '최종수정일시',
    constraint UQ_TN_COM_C001
        unique (sys_id, com_cd)
)
    comment '공통코드 그룹 테이블' charset = utf8mb4;

create table bathroom.tn_com_c002
(
    idx           bigint auto_increment comment '일련번호 (PK)'
        primary key,
    sys_id        varchar(20)      not null comment '시스템 식별 ID',
    grp_cd        varchar(20)      not null comment '소속 그룹코드 (TN_COM_C001.com_cd 논리 FK)',
    upr_com_cd    varchar(20)      not null comment '직전 부모 상세코드 (최상위 레벨일 경우 GRP_CD 또는 ROOT로 세팅)',
    com_cd        varchar(20)      not null comment '상세 세부 코드값 (예: SPORT, VEHICLE, CAR)',
    cd_nm         varchar(90)      not null comment '상세 코드명',
    cd_expl       varchar(300)     null comment '상세 코드 설명',
    sort_ord      int  default 0   null comment '동일 레벨 내 노출 정렬 순서',
    use_yn        char default 'Y' null comment '사용여부 (Y/N)',
    frst_rgstr_id varchar(50)      not null comment '최초등록자 ID',
    frst_reg_dt   datetime         not null comment '최초등록일시',
    last_mdfr_id  varchar(50)      null comment '최종수정자 ID',
    last_mdfcn_dt datetime         null comment '최종수정일시',
    constraint UQ_TN_COM_C002
        unique (sys_id, grp_cd, upr_com_cd, com_cd)
)
    comment '계층형 공통코드 상세 테이블' charset = utf8mb4;

create table bathroom.tn_com_f001
(
    file_sn       bigint auto_increment comment '파일 일련번호 (PK)'
        primary key,
    sys_id        varchar(20)      not null comment '시스템 식별 ID',
    file_grp_id   varchar(100)     not null comment '다중 파일 묶음용 그룹 식별 ID (UUID)',
    file_orgnl_nm varchar(255)     not null comment '사용자 업로드 원본 파일명',
    file_stre_nm  varchar(255)     null comment '서버 물리 저장용 변환 파일명',
    file_path     varchar(500)     null comment '서버 저장 물리 경로 또는 S3 URL',
    file_size     bigint           null comment '파일 용량(Byte)',
    file_extsn    varchar(20)      null comment '파일 확장자',
    del_yn        char default 'N' null comment '논리 삭제 여부 (Y/N)',
    frst_rgstr_id varchar(50)      not null comment '최초등록자 ID',
    frst_reg_dt   datetime         not null comment '최초등록일시',
    last_mdfr_id  varchar(50)      null comment '최종수정자 ID',
    last_mdfcn_dt datetime         null comment '최종수정일시'
)
    comment '시스템 공통 다중 파일 관리 테이블' charset = utf8mb4;

create index IX_TN_COM_F001_GRP
    on bathroom.tn_com_f001 (sys_id, file_grp_id, del_yn);

create table bathroom.tn_com_l001
(
    log_idx  bigint auto_increment comment '로그 일련번호 (PK)'
        primary key,
    sys_id   varchar(20)  not null comment '시스템 식별 ID',
    user_id  varchar(50)  not null comment '행위자 ID',
    fnctn_nm varchar(100) not null comment '수행 기능명',
    req_url  varchar(255) null comment '요청 API URL',
    oprtn_ip varchar(50)  null comment '요청자 IP 주소',
    log_cn   longtext     null comment '변경 내역 데이터 스냅샷 (JSON 형식 권장)',
    reg_dt   datetime     not null comment '로그 생성일시'
)
    comment '시스템 통합 감사 로그 테이블' charset = utf8mb4;

create table bathroom.tn_mem_m001
(
    idx           bigint auto_increment comment '일련번호 (PK)'
        primary key,
    sys_id        varchar(20) default 'CORE' not null comment '소속 시스템 식별 ID',
    user_id       varchar(50)                not null comment '유저 로그인 아이디',
    pswd          varchar(255)               not null comment '암호화된 비밀번호 해시값 (BCrypt)',
    user_nm       varchar(60)                not null comment '사용자 이름/닉네임',
    athrty_cd     varchar(20)                not null comment '부여된 권한코드 (TN_ATH_A001.athrty_com_cd 연동)',
    join_ymd      varchar(14)                not null comment '가입연월일시 (YYYYMMDDHHMMSS)',
    user_stat_cd  varchar(20) default 'ACTV' null comment '유저 상태 (공통코드 연동: ACTV, SUSP 등)',
    frst_rgstr_id varchar(50)                not null comment '최초등록자 ID',
    frst_reg_dt   datetime                   not null comment '최초등록일시',
    last_mdfr_id  varchar(50)                null comment '최종수정자 ID',
    last_mdfcn_dt datetime                   null comment '최종수정일시',
    constraint UQ_TN_MEM_M001_ID
        unique (sys_id, user_id)
)
    comment '유저 마스터 테이블' charset = utf8mb4;

create table bathroom.tn_mem_m002
(
    user_idx      bigint       not null comment '유저 마스터 일련번호 (TN_MEM_M001.idx와 1:1 결합)'
        primary key,
    email         varchar(100) null comment '이메일 주소',
    mbl_telno     varchar(20)  null comment '휴대폰 번호',
    zip_cd        varchar(10)  null comment '우편번호',
    base_addr     varchar(255) null comment '기본 주소',
    dtl_addr      varchar(255) null comment '상세 주소',
    frst_rgstr_id varchar(50)  not null comment '최초등록자 ID',
    frst_reg_dt   datetime     not null comment '최초등록일시',
    last_mdfr_id  varchar(50)  null comment '최종수정자 ID',
    last_mdfcn_dt datetime     null comment '최종수정일시'
)
    comment '유저 상세 정보 테이블' charset = utf8mb4;

create table bathroom.tn_mnu_m001
(
    sys_id        varchar(20)      not null comment '시스템 식별 ID (PK)',
    menu_id       varchar(50)      not null comment '메뉴 고유 식별 ID (PK)',
    upr_menu_id   varchar(50)      not null comment '상위 메뉴 ID (최상위는 ROOT)',
    sys_sect_cd   varchar(20)      not null comment '시스템 섹션 구분 (ADMN/USER)',
    menu_nm       varchar(100)     not null comment '메뉴 표시명',
    menu_url      varchar(255)     null comment 'React Router 이동 경로',
    comp_path     varchar(255)     null comment 'React 컴포넌트 물리 경로 (일반 화면용)',
    brd_id        varchar(50)      null comment '매핑된 게시판 ID (TN_BRD_M001.brd_id 논리 FK)',
    menu_icon     varchar(50)      null comment '메뉴 아이콘',
    menu_kwd      varchar(300)     null comment '검색 유도용 매핑 키워드 (콤마로 구분)',
    sort_ord      int  default 0   null comment '정렬 순서',
    use_yn        char default 'Y' null comment '사용여부 (Y/N)',
    del_yn        char default 'N' null comment '삭제 여부 (Y/N)',
    frst_rgstr_id varchar(50)      not null comment '최초등록자 ID',
    frst_reg_dt   datetime         not null comment '최초등록일시',
    last_mdfr_id  varchar(50)      null comment '최종수정자 ID',
    last_mdfcn_dt datetime         null comment '최종수정일시',
    primary key (sys_id, menu_id)
)
    comment '계층 및 동적 게시판 매핑 적용 메뉴 테이블' charset = utf8mb4;

create table bathroom.tn_pop_m001
(
    pop_idx       bigint auto_increment comment '팝업 일련번호 (PK)'
        primary key,
    sys_id        varchar(20) default 'CORE' not null comment '시스템 식별 ID',
    sys_se_cd     varchar(20)                not null comment '시스템 구분 코드 (US: 사용자, MG: 관리자)',
    pop_titl      varchar(200)               not null comment '팝업 제목',
    pop_cn        longtext                   null comment '팝업 내용',
    bgng_ymd      varchar(10)                not null comment '팝업 시작 일자 (YYYY-MM-DD)',
    end_ymd       varchar(10)                not null comment '팝업 종료 일자 (YYYY-MM-DD)',
    file_grp_id   varchar(100)               null comment '첨부파일 그룹 ID',
    use_yn        char        default 'Y'    null comment '사용 여부 (Y/N)',
    del_yn        char        default 'N'    null comment '논리 삭제 여부 (Y/N)',
    frst_rgstr_id varchar(50)                not null comment '최초등록자 ID',
    frst_reg_dt   datetime                   not null comment '최초등록일시',
    last_mdfr_id  varchar(50)                null comment '최종수정자 ID',
    last_mdfcn_dt datetime                   null comment '최종수정일시'
)
    comment '팝업 관리 마스터 테이블' charset = utf8mb4;

create index IX_TN_POP_M001_SE
    on bathroom.tn_pop_m001 (sys_id, sys_se_cd, use_yn, del_yn);

create table bathroom.tn_sys_m001
(
    sys_id        varchar(20)      not null comment '시스템/사이트 식별 ID (PK, 예: CORE, ERP_A, CMNTY)'
        primary key,
    sys_nm        varchar(100)     not null comment '시스템/사이트 명',
    use_yn        char default 'Y' null comment '사용여부 (Y/N)',
    frst_rgstr_id varchar(50)      not null comment '최초등록자 ID',
    frst_reg_dt   datetime         not null comment '최초등록일시'
)
    comment '시스템/사이트 마스터 테이블' charset = utf8mb4;

create table bathroom.tn_ath_h001
(
    hist_seq          bigint auto_increment comment '이력 일련번호 (PK)'
        primary key,
    sys_id            varchar(20)      not null comment '시스템 식별 ID',
    old_athrty_com_cd varchar(20)      null comment '기존 권한공통코드',
    new_athrty_com_cd varchar(20)      null comment '변경 권한공통코드',
    old_athrty_nm     varchar(90)      null comment '기존 권한명',
    new_athrty_nm     varchar(90)      null comment '변경 권한명',
    chg_type          varchar(20)      not null comment '변경 유형 (CREATE, UPDATE, RENAME, DELETE)',
    frst_rgstr_id     varchar(50)      not null comment '이력 생성자 ID',
    frst_reg_dt       datetime         not null comment '이력 생성 일시'
)
    comment '권한 등급 변경 이력 테이블' charset = utf8mb4;
