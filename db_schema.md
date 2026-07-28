# Database Schema

이 문서는 프로젝트의 전체 데이터베이스 스키마 상태를 기록하는 핵심 참조(Memory Medium) 문서입니다.
테이블의 컬럼 추가, 제거, 변경이 발생할 때마다 반드시 이 문서를 최신화해야 합니다.
모든 AI 에이전트는 DB 관련 작업 전 이 문서를 필수적으로 참조해야 합니다.

> **출처**: 로컬 MySQL(`localhost:3306/bathroom`)에 JDBC로 직접 접속해 `INFORMATION_SCHEMA` + `SHOW CREATE TABLE`로 21개 테이블 전체를 덤프한 결과 기준입니다 (mapper XML 추정치를 라이브 스키마로 검증·보정 완료).
> DB 엔진: MySQL, 스키마명 `bathroom` (`application.yaml`의 `spring.datasource.url` 참고).
> MyBatis `map-underscore-to-camel-case: true` — snake_case 컬럼이 자동으로 camelCase로 매핑됩니다.

## ⚠️ 기존 `schema.sql` / 이 문서와의 불일치 (중요)

리포지토리 루트의 `schema.sql`과 이 문서의 과거 버전은 **현재 실행 중인 백엔드 코드가 실제로 사용하는 스키마와 상당 부분 다릅니다.** 확인된 주요 차이:

| 항목 | `schema.sql` (구버전) | 실제 코드가 사용하는 구조 |
|---|---|---|
| 게시글 테이블 | `tn_brd_p001` | `TN_BRD_M001`(마스터) + `TN_BRD_M002`(설정) + `TN_BRD_M003`(게시글)로 3분리 |
| 게시글 댓글 | 없음 | `TN_BRD_C001` 신설 (대댓글 계층 지원) |
| 설문조사 전체 | 테이블 정의 없음 | `TN_SURVEY_M001/M002/M003`, `TN_SURVEY_P001/P002` 신설 |
| `TN_SYS_M001` | `sys_id, sys_nm, use_yn`만 존재 | `service_bgnde/endde`, `logo_file_grp_id`, `admin_theme_cd`, `user_theme_cd` 컬럼 추가됨 |
| `TN_ATH_A001` | `athrty_level` 없음 | `athrty_level`(권한 등급 비교용 정수) 컬럼 추가됨 |
| `TN_MEM_M001` | `rgst_bgng_dt/rgst_end_dt` 없음 | 등록 유효기간 컬럼 추가됨 |
| `TN_MEM_M002` | `img_file_sn`, `rmrk` 없음 | 프로필 이미지·비고 컬럼 추가됨 |
| `TN_POP_M001` | `surv_id` 없음 | 팝업-설문 매핑용 `surv_id` 컬럼 추가됨 |
| `TN_BRD_M003` | (해당 없음) | `secret_pwd`(비밀글 비밀번호) 컬럼 존재 |
| `TN_USR_M001` | 없음 | **라이브 DB에 테이블 자체가 존재하지 않음** (아래 참고) |

**결론**: DB 관련 작업(쿼리 작성, 마이그레이션, 신규 매퍼 추가) 전에는 이 문서 또는 실제 mapper XML을 우선 신뢰하고, `schema.sql`은 과거 스냅샷 정도로만 참고하세요. 가능하면 IntelliJ의 `Generate DDL` 기능으로 `schema.sql`을 최신화하는 것을 권장합니다.

---

## 테이블 목록

모든 테이블은 공통적으로 `frst_rgstr_id`(최초등록자), `frst_reg_dt`(최초등록일시), `last_mdfr_id`(최종수정자), `last_mdfcn_dt`(최종수정일시) 감사 컬럼을 가지며(로그/이력성 테이블 제외), 거의 모든 테이블에 `sys_id`(시스템/사이트 식별자)가 있어 **멀티테넌시** 구조를 이룹니다. 테넌트 자체는 `TN_SYS_M001`에 등록됩니다.

### 시스템 / 테넌트

#### `TN_SYS_M001` — 시스템(사이트) 마스터
| 컬럼 | 설명 |
|---|---|
| sys_id (PK) | 시스템/사이트 식별 ID (예: CORE, ERP_A) |
| sys_nm | 시스템명 |
| use_yn | 사용 여부 |
| service_bgnde / service_endde | 서비스 이용 시작/종료일 |
| logo_file_grp_id | 로고 이미지 (`TN_COM_F001.file_grp_id`) |
| admin_theme_cd / user_theme_cd | 관리자/사용자 화면 테마 코드 |
| position_scheme_cd | 이 테넌트가 선택한 직급 체계 (`TN_COM_C002` `POSITION_CD` 그룹의 2뎁스 `com_cd`, 예: `GENERAL`/`RESEARCH`) — 직원 등록 화면의 3뎁스 직급 드롭다운이 이 값으로 필터링됨 |
| dept_scheme_cd | 이 테넌트가 선택한 부서 체계 (`TN_COM_C002` `DEPT_CD` 그룹의 2뎁스 `com_cd`, 예: `STANDARD`/`DIVISION`) — 직원 등록 화면의 3뎁스 부서 드롭다운이 이 값으로 필터링됨 |
| current_pay_idx | (2026-07-25 추가) 현재 적용 중인 요금제 (`TN_PAY_M001.idx` FK, nullable) — 빠른 조회용 캐시. 정본은 `TN_PAY_H001`(적용 이력, `applied_end_dt IS NULL`인 행이 현재 적용중) |

새 시스템 생성 시(`copyBoards`, `copyAdminMenus` 등) `sys_id = 'CORE'` 데이터를 템플릿으로 복제합니다. **공통코드(`TN_COM_C001`/`C002`)는 2026-07-25부로 더 이상 업체별로 복제하지 않음** — 아래 "공통코드" 섹션 참고. `copyAdminMenus`도 `core_only_yn='Y'`인 CORE 전용 메뉴는 복제 대상에서 제외한다.

### 회원 / 권한

#### `TN_MEM_M001` — 통합 회원 마스터 (관리자 + 일반회원 겸용)
| 컬럼 | 설명 |
|---|---|
| idx (PK, auto) | 일련번호 |
| sys_id, user_id | 로그인 ID (unique: sys_id+user_id) |
| pswd | BCrypt 해시 |
| user_nm | 이름 |
| athrty_cd | 권한코드 (FK: `TN_ATH_A001.athrty_com_cd`) |
| join_ymd | 가입일시 (YYYYMMDDHHMMSS) |
| user_stat_cd | 상태 (ACTV 등) |
| rgst_bgng_dt / rgst_end_dt | 계정 등록 유효기간 |

관리자 로그인(`CommonUserDetailsService`)도 이 테이블을 1순위로 조회합니다. `athrty_cd = 'A001'`이면 시스템 최고관리자(마스터).

#### `TN_MEM_M002` — 회원 상세 (1:1)
`user_idx`(PK, FK: `TN_MEM_M001.idx`), `email`, `mbl_telno`, `zip_cd`, `base_addr`, `dtl_addr`, `img_file_sn`(프로필 이미지, FK: `TN_COM_F001.file_sn`), `rmrk`(비고, 리치텍스트), `sys_id`(`TN_MEM_M001.sys_id` 비정규화 — 아래 `emp_no` 유니크 인덱스용).

**직원(HR) 필드 — 옛 `TN_HR_M001`을 여기로 통합함 (2026-07-25)**: `emp_no`(사번, `UNIQUE(sys_id, emp_no)`, 선택), `dept_cd`/`position_cd`(각각 `TN_COM_C002`의 `DEPT_CD`/`POSITION_CD` 3뎁스 그룹 연동, `TN_SYS_M001.deptSchemeCd`/`positionSchemeCd`로 지정된 체계의 하위 값), `emp_stat_cd`(재직상태, `EMP_STAT_CD` 그룹 — 계정 상태인 `user_stat_cd`와는 별개 축), `hire_dt`/`resign_dt`. `sys_se_cd='MG'`(관리자) 계정에서만 의미 있게 쓰이며, "인턴이라도 로그인 계정 없이 존재할 수 없다"는 정책에 따라 별도 인사 테이블 없이 계정 등록(`/admin/user`)과 같은 화면·같은 저장 트랜잭션에서 함께 입력한다. 사번은 선택 항목(필수 아님).

#### `TN_USR_M001` — **라이브 DB에 존재하지 않는 죽은 참조**
`SecurityMapper.xml`의 `selectUserById` 쿼리가 이 테이블을 조회하지만, 실제 DB(`bathroom` 스키마, 21개 테이블 전수 확인)에는 이 테이블이 **없습니다**. `CommonUserDetailsService`에서 관리자 조회(`TN_MEM_M001`) 실패 시 폴백으로 이 쿼리를 타는데, 그 경로가 실행되면 `Table 'bathroom.tn_usr_m001' doesn't exist` SQL 에러가 발생합니다. 즉 "관리자가 아닌 일반회원 로그인" 경로는 현재 코드상 고장난 상태입니다. 회원가입/설문 응답 등 모든 실제 기능은 `TN_MEM_M001`만 사용합니다.

#### `TN_ATH_A001` — 권한 등급 마스터
`idx`(PK), `sys_id`, `sys_se_cd`(MG/US), `athrty_com_cd`(unique with sys_id), `athrty_nm`, `cd_expl`, `athrty_level`(정수, 낮을수록 상위 권한 — 사용자 목록 검색 시 `>=` 비교로 하위 권한만 조회), `use_yn`, `del_yn`.

> **`SUPR` — S001보다 위에 있는, 존재 자체가 숨겨진 진짜 최고관리자 (2026-07-25 도입)**: `sys_id='CORE'`, `athrty_level`이 그 시점 최저값보다 1 낮게(=더 상위) 부여됨. 로그인 계정은 `TN_MEM_M001.user_id='spadmin'` (초기 비밀번호는 문서에 남기지 않음 — 최초 로그인 후 즉시 변경 필요). `AdminPrincipal.isTrueSuperAdmin()`이 `"SUPR".equals(role)`로 하드코딩 검사하며, `TenantGuardAspect`/`DynamicAdminAuthorizationManager`에서 `S001`과 동일하게 전면 통과되지만 `sensitive_yn='Y'` 메뉴는 `S001`도 못 보는 것과 달리 `SUPR`은 그것까지 다 본다. `selectRoleList`/`selectSearchUserList` 양쪽 다 호출자가 `SUPR`이 아니면 이 역할/계정 자체를 결과에서 제외해 시스템회원관리·권한매트릭스관리 어디에서도 노출되지 않는다. `athrty_com_cd`가 `S`로 시작하는 역할은 `sys_id='CORE'`가 아니면 생성 자체가 서버에서 차단됨(다른 테넌트가 흉내 낼 수 없도록).

#### `TN_ATH_M001` — 권한별 메뉴 접근/CRUD 권한 매핑
`idx`(PK), `sys_id`, `athrty_com_cd`, `menu_id` (unique 조합), `menu_show_yn`, `inqire_yn`(조회), `rgst_yn`(등록), `mdfcn_yn`(수정), `del_yn`(삭제), `use_yn`. 프론트의 `menuAuth` 객체가 이 테이블 값으로 채워집니다.

#### `TN_ATH_H001` — 권한 등급 변경 이력
`hist_seq`(PK), `sys_id`, `old/new_athrty_com_cd`, `old/new_athrty_nm`, `chg_type`(CREATE/UPDATE/RENAME/DELETE), `frst_rgstr_id`, `frst_reg_dt`.

### 권한 템플릿 — `sys_id` 없음, CORE 최고관리자 전용 글로벌 설정

**2026-07-25부로 "요금제"라는 이름/필드를 걷어내고 순수 권한 구조(부서×역할×메뉴권한)로 재정의했다** (`plan_cd`→`tpl_cd` 등 컬럼 리네이밍). 상업적 요금제(가격/결제방식)는 아래 `TN_PAY_M001`이 별도로 담당하며, 요금제가 이 템플릿을 참조(`TN_PAY_M001.ath_tpl_idx`)한다 — 여러 요금제(예: 월간/연간/프로모션)가 같은 템플릿 구조를 공유할 수 있다. 신규 테넌트 생성 시 선택된 요금제가 가리키는 템플릿의 부서×역할×메뉴권한 구조가 통째로 `TN_ATH_A001`/`TN_ATH_M001`에 복제된다 (`AdminSystemServiceImpl.createSystem()` → `AdminSystemMapper.copyAuthorityGroups`/`copyAuthorityMenuMappings`, `tplCd` 파라미터로 필터링). `S001`(플랫폼 최고관리자)은 템플릿 대상이 아니고 CORE의 실제 `TN_ATH_A001`에서 계속 수동 관리 — 템플릿은 A계열(테넌트에 복제될 부서×역할)만 다룬다. 관리 화면: `/admin/auth-template` (`AdminAuthTemplateManage.jsx`).

#### `TN_ATH_TPL_P001` — 템플릿 마스터
`idx`(PK, auto), `tpl_cd`(unique, 예: BASIC/STANDARD/PREMIUM), `tpl_nm`, `tpl_expl`, `sort_ord`, `use_yn`.

#### `TN_ATH_TPL_D001` — 템플릿별 부서 그룹
`idx`(PK, auto), `tpl_idx`(FK→`TN_ATH_TPL_P001.idx`), `dept_tpl_cd`(unique with `tpl_idx`, 예: A0/A1/A2), `dept_tpl_nm`(예: 인사팀), `dept_expl`, `sort_ord`, `use_yn`.

#### `TN_ATH_TPL_A001` — 부서별 역할 상세
`idx`(PK, auto), `dept_idx`(FK→`TN_ATH_TPL_D001.idx`), `athrty_tpl_cd`(unique with `dept_idx`, 복제 시 그대로 `TN_ATH_A001.athrty_com_cd`가 됨, 예: A001), `sys_se_cd`(MG/US), `athrty_nm`(예: 부서장), `cd_expl`, `athrty_level`, `use_yn`.

#### `TN_ATH_TPL_M001` — 역할별 메뉴 CRUD 매핑
`idx`(PK, auto), `athrty_idx`(FK→`TN_ATH_TPL_A001.idx`), `menu_id`(unique with `athrty_idx`, CORE 메뉴 기준 — `TN_MNU_M001 WHERE sys_id='CORE'`), `menu_show_yn`/`inqire_yn`/`rgst_yn`/`mdfcn_yn`/`del_yn`, `use_yn`.

> 4개 테이블 모두 신규 생성 시점엔 빈 테이블 — CORE 관리자가 `/admin/auth-template` 화면에서 부서/역할/메뉴권한을 직접 입력해야 아래 요금제 관리 화면에서 이 템플릿을 참조할 수 있다.

### 요금제 (상업 조건) — CORE 최고관리자 전용, `TN_ATH_TPL_P001`(권한 템플릿)과는 완전히 별개 테이블 (2026-07-25 신설)

프로모션/이벤트처럼 같은 권한 템플릿 구조를 서로 다른 가격·결제조건으로 재사용해야 하는 요구를 반영 — "STANDARD" 템플릿 하나에 "STANDARD-월간", "STANDARD-프로모션" 등 여러 요금제가 동시에 걸릴 수 있다. 관리 화면: `/admin/pay` (`AdminPayManage.jsx`).

#### `TN_PAY_M001` — 요금제 마스터
`idx`(PK, auto), `pay_plan_cd`(unique), `pay_plan_nm`, `pay_se_cd`(결제구분, `TN_COM_C002` `PAY_SE_CD` 그룹: 월결제/연결제/시스템구매/이벤트/프로모션), `ath_tpl_idx`(FK→`TN_ATH_TPL_P001.idx`, nullable — 이 요금제가 적용할 권한 템플릿), `price`(정가), `discount_rate`(할인율%), `discount_price`(할인 적용 실 결제금액 — **서비스 레이어에서 저장 시점에 계산**, DB generated column 아님), `pay_plan_expl`(비고 — 생성 의도), `sort_ord`, `use_yn`.

#### `TN_PAY_H001` — 업체별 요금제 적용 이력
`idx`(PK, auto), `sys_id`(FK→`TN_SYS_M001.sys_id`), `pay_idx`(FK→`TN_PAY_M001.idx`), `applied_start_dt`, `applied_end_dt`(NULL=현재 적용중), `chg_rsn`(변경 사유/비고). 요금제를 바꾸면 기존 활성 이력(`applied_end_dt IS NULL`)을 마감하고 새 이력을 시작하며 `TN_SYS_M001.current_pay_idx`도 함께 갱신한다 (`AdminPayServiceImpl.assignPay()`). **요금제 변경 시 이미 발급된 `TN_ATH_A001`/`TN_ATH_M001` 권한 데이터를 재동기화하는 로직은 아직 없음** — 순수 기록/추적 목적으로만 동작한다(의도적으로 보류, 추후 재검토 예정). 실제 매출/결제 처리(청구, 결제수단 연동)도 아직 없음.

> **인사(HR) 도메인은 더 이상 별도 테이블이 아님 (2026-07-25부로 `TN_MEM_M002`에 통합)**: "로그인 계정 없는 직원은 없다"는 정책 확정 이후, 예전에 분리돼 있던 `TN_HR_M001`(직원 마스터, `linked_user_id`로만 느슨하게 연동)을 없애고 그 필드들을 `TN_MEM_M002`로 이전했다. 자세한 내용은 위 `TN_MEM_M002` 항목 참고.
>
> **`POSITION_CD`, `DEPT_CD` 둘 다 3뎁스 계층 구조** (`EMP_STAT_CD`만 2뎁스 평면 목록): 2뎁스가 "체계"(직급 체계: `GENERAL`=일반기업형 사원~이사, `RESEARCH`=연구직형 주임~수석 / 부서 체계: `STANDARD`=일반 조직 팀 단위, `DIVISION`=사업부제), 3뎁스가 그 체계에 속한 실제 값. 회사마다 직급·부서 체계 자체가 다르다는 문제를 해결하기 위함 — `TN_SYS_M001.position_scheme_cd`/`dept_scheme_cd`로 테넌트가 쓸 체계를 한 번 선택해두면, 계정 등록 화면은 그 체계의 3뎁스만 보여준다.

### 메뉴

#### `TN_MNU_M001` — 메뉴 마스터
`sys_id + menu_id`(PK), `upr_menu_id`(계층), `sys_sect_cd`(관리자/사용자 구분), `menu_nm`, `menu_url`, `comp_path`(리액트 컴포넌트 경로), `brd_id`(동적 게시판 매핑, FK: `TN_BRD_M001.brd_id`), `menu_icon`, `menu_kwd`(검색 키워드), `sort_ord`, `use_yn`, `del_yn`, `sensitive_yn`(2026-07-25 추가 — `Y`면 아래 `SUPR` 역할이 아닌 이상 메뉴관리/사이드바/권한매트릭스 어디에도 노출되지 않고, `S001`조차 `TenantGuardAspect`의 전면 바이패스를 못 타고 `TN_ATH_M001` 매트릭스를 실제로 확인받아야 함 — 급여관리·매출통계처럼 최고관리자에게도 함부로 보이면 안 되는 화면용), `core_only_yn`(2026-07-25 추가 — `Y`면 `copyAdminMenus`가 신규 업체 생성 시 이 행을 복제하지 않음. CORE 전용 화면 4개(업체 관리/공통코드 관리/권한 템플릿 관리/요금제 관리)와 그 상위 그룹 헤더 `CORE 관리`가 대상).

**메뉴 URL/컴포넌트 경로는 CORE만 직접 입력 가능** (2026-07-25) — `MenuModal.jsx`가 `sysId==='CORE'`가 아니면 `menu_url`/`comp_path` 입력란 자체를 숨기고, `AdminMenuServiceImpl.saveMenu()`가 서버에서도 동일하게 강제한다: `sysId != 'CORE'`일 때 `brd_id`가 있으면 그 값 기준으로 `menu_url`을 재계산(클라이언트가 보낸 값 무시)하고, 없으면 `menu_url`/`comp_path`를 모두 `null` 처리한다. 업체 관리자는 "동적 게시판 스왑 맵핑" 토글로만 메뉴-URL을 설정할 수 있다. `comp_path`는 현재 실제 라우팅에는 쓰이지 않는 표시용 필드지만(`App.js`가 정적 import), 추후 동적 컴포넌트 라우팅을 도입하면 이 값이 실제로 쓰일 수 있어 CORE는 계속 관리 가능하게 남겨둠.

**메뉴 트리 최상위 분류(2026-07-25 재편, 같은 날 제품/재고 도메인 추가로 확장)**: `CORE 관리`(CORE 전용) / `기본 설정`(메뉴·권한 관리) / `회원 관리` / `템플릿 관리`(게시판·설문지·제품 카테고리·옵션 그룹 등 구조를 만드는 화면) / `콘텐츠 관리`(팝업·게시글·설문 배포 등 그 구조로 실제 운영하는 화면) / `결과 관리`(설문 결과 조회) / `제품 관리`(제품/재고 관리·매입처 관리·지점 관리) — 7개 그룹이 모두 `ROOT` 직속 1단계 메뉴다. CORE 전용 4개 화면은 `CORE 관리` 아래 2단계로 들어간다.

### 공통코드

#### `TN_COM_C001` — 공통코드 그룹
`idx`(PK), `sys_id`, `com_cd`(unique with sys_id), `cd_nm`, `cd_expl`.

#### `TN_COM_C002` — 공통코드 상세 (계층형)
`idx`(PK), `sys_id`, `grp_cd`(FK: `TN_COM_C001.com_cd`), `upr_com_cd`(부모 상세코드), `com_cd`, `cd_nm`, `cd_expl`, `sort_ord`, `use_yn`. unique: `sys_id+grp_cd+upr_com_cd+com_cd`.

**업체별로 복제하지 않음 (2026-07-25부터)**: `SYS_SE_CD`/`USE_YN`/`DEPT_CD` 등은 여러 화면 로직에 전제로 박혀있는 시스템 뼈대 코드라 업체가 웹 화면만으로 편집할 이유가 없고, 잘못 건드리면 해당 코드를 참조하는 화면이 깨진다. `createSystem()`에서 `copyCommonCodes`/`copyCommonCodeDetails` 호출을 제거했고, 프론트의 `CommonCodePicker`/`CommonCodePreview`/`useCodeManage`는 로그인/전환된 테넌트와 무관하게 항상 `sys_id='CORE'` 코드만 조회한다. 공통코드 관리 화면(`/admin/code`)도 CORE 전용 메뉴로 재분류됨. (온프레미스 솔루션으로 판매하는 시나리오는 배포 시점에 `sys_id`를 고정하고 CORE 데이터를 1회성으로 복사하는 별도 방식으로 처리 예정 — 현재 멀티테넌트 SaaS 구조와 무관.)

### 공통 파일 / 로그

#### `TN_COM_F001` — 공통 다중 파일
`file_sn`(PK, auto), `sys_id`, `file_grp_id`(묶음 UUID), `file_orgnl_nm`, `file_stre_nm`, `file_path`, `file_size`, `file_extsn`, `del_yn`. 업로드 물리 경로는 `application.yaml`의 `app.file.upload-dir`.

#### `TN_COM_L001` — 감사 로그
`log_idx`(PK), `sys_id`, `user_id`, `fnctn_nm`, `req_url`, `oprtn_ip`, `log_cn`(요청 파라미터 JSON 스냅샷), `reg_dt`. `@AuditLog` 어노테이션 + `AuditLogAspect`(AOP)가 자동 기록.

### 게시판

#### `TN_BRD_M001` — 게시판 마스터
`sys_id + brd_id`(PK), `brd_nm`, `brd_expl`, `brd_type`, `use_yn`, `del_yn`.

**`cte_cd`/`cte_de_cd`(게시판 카테고리 묶음) 컬럼은 2026-07-25 제거함** — 카테고리로 게시판을 묶으려던 초기 설계였으나 이중관리 구조가 되어 폐기된 기획의 잔재로, `AdminBoardMapper.insertBoardManaging`이 항상 빈 문자열만 넣는 죽은 컬럼이었다. 두 컬럼 모두 NOT NULL·기본값 없음이라 `copyBoards`가 이 컬럼들을 채우지 않아 **신규 업체 생성이 100% 실패하는 버그**의 직접 원인이었음 — 컬럼을 완전히 드롭해서 근본 해결.

#### `TN_BRD_M002` — 게시판 상세 설정 (1:1, `TN_BRD_M001`에서 분리됨)
`sys_id + brd_id`(PK), `user_write_yn`, `user_reply_yn`, `rereply_yn`, `rereply_depth`(최대 3), `atch_file_yn`, `secret_use_yn`, `cmt_atch_file_yn`.

#### `TN_BRD_M003` — 게시글
`idx`(PK, auto), `sys_id`, `brd_id`, `post_no`, `title`, `content`, `wrtr_idx`(FK: `TN_MEM_M001.idx`), `wrtr_nm`(작성자 이름 스냅샷), `inq_cnt`, `ntc_yn`(공지 고정), `highlight_yn`, `secret_yn`, `secret_pwd`, `rls_start_dt/rls_end_dt`(예약 게시), `del_yn`(논리삭제/차단), `atch_file_grp_id`(FK: `TN_COM_F001.file_grp_id`).

#### `TN_BRD_C001` — 게시글 댓글 (대댓글 지원)
`cmt_idx`(PK, auto), `sys_id`, `brd_id`, `post_idx`(FK: `TN_BRD_M003.idx`), `parent_cmt_idx`, `cmt_grp_idx`(같은 스레드 그룹), `cmt_depth`, `sort_ord`, `cmt_content`, `wrtr_idx`, `wrtr_nm`, `secret_yn`, `del_yn`, `atch_file_grp_id`.

### 팝업

#### `TN_POP_M001` — 팝업 마스터
`pop_idx`(PK, auto), `sys_id`, `sys_se_cd`(US/MG), `pop_titl`, `pop_cn`, `bgng_ymd/end_ymd`(YYYY-MM-DD), `file_grp_id`, `surv_id`(설문 매핑, FK: `TN_SURVEY_M001.surv_id`), `use_yn`, `del_yn`.

### 설문조사 (schema.sql에 전혀 없던 도메인)

> **참고**: `TN_SURVEY_*` 5개 테이블만 `CHARSET=utf8mb3`로 생성되어 있습니다(나머지 테이블은 전부 `utf8mb4`). 일반 한글 텍스트는 문제없지만 이모지 등 4바이트 유니코드 문자는 저장 시 깨지거나 실패할 수 있습니다. 또한 이 5개 테이블은 다른 테이블과 달리 `frst_rgstr_id/frst_reg_dt` 등 감사 컬럼이 마스터(`TN_SURVEY_M001`) 외에는 전혀 없습니다.

#### `TN_SURVEY_M001` — 설문 마스터
`sys_id + surv_id`, `sys_se_cd`, `surv_nm`, `surv_expl`, `surv_ver`, `template_yn`(템플릿 여부), `use_yn`, `start_dt/end_dt`, `del_yn`.

#### `TN_SURVEY_M002` — 설문 문항
`sys_id, surv_id, qstn_sn`, `qstn_type`, `qstn_txt`, `req_yn`(필수여부), `ord_no`.

#### `TN_SURVEY_M003` — 설문 문항 선택지
`sys_id, surv_id, qstn_sn, opt_sn`, `opt_txt`, `ord_no`.

#### `TN_SURVEY_P001` — 설문 응답자
`sys_id, surv_id, resp_id`, `user_id`(FK: `TN_MEM_M001`), `frst_reg_dt`.

#### `TN_SURVEY_P002` — 설문 응답 상세
`sys_id, surv_id, resp_id, qstn_sn, ans_sn`, `opt_sn`(객관식 선택), `ans_txt`(주관식 답변).

### 제품/재고 (2026-07-25 신설)

폐기된 게시판 `cte_cd`/`cte_de_cd` 카테고리 잔재를 정리하면서, 그 근원에 있던 "제품을 카테고리로 묶어 재고까지 관리"하는 요구를 설계해 도입. 공통코드와 달리 카테고리·옵션은 업체가 자유롭게 만들고 바꾸는 비즈니스 데이터라 별도 테이블로 관리하며(공통코드 재사용 안 함), 가격/재고는 제품이 아니라 **SKU**(옵션 값 조합)에 붙는다 — 옵션 없는 단순 제품도 SKU 1건으로 처리해 범용성을 확보했다. 관리 화면은 `템플릿 관리`(카테고리·옵션 그룹 = 구조 정의) / `제품 관리`(제품·재고·매입처·지점 = 실제 운영) 두 메뉴 그룹에 나눠 배치.

#### `TN_PRD_CTE_M001` — 제품 카테고리 (자기참조 트리, 1~3뎁스)
`idx`(PK, auto), `sys_id`, `upr_cte_idx`(FK self, NULL=최상위), `cte_nm`, `cte_expl`, `sort_ord`, `use_yn`, `del_yn`. `MenuManage.jsx`의 1/2/3단계 편집 UI와 동일한 패턴(`AdminProdCategoryManage.jsx`). 관리 화면: `/admin/prd/category`.

#### `TN_PRD_OPT_G001` / `TN_PRD_OPT_D001` — 옵션 그룹 / 옵션 값
그룹(`idx`, `sys_id`, `opt_grp_nm`(예: 색상/사이즈), `sort_ord`, `use_yn`, `del_yn`) → 값(`idx`, `opt_grp_idx` FK, `opt_val_nm`(예: 빨강/M), `sort_ord`, `use_yn`, FK 제약으로 그룹 삭제 시 보호). 옵션은 업체가 직접 정의하므로 색상/사이즈를 컬럼으로 하드코딩하지 않고 이 구조로 범용 처리. 관리 화면: `/admin/prd/option` (`AdminProdOptionManage.jsx`, 공통코드 관리의 그룹→상세 2단 UI와 동일 패턴).

#### `TN_PRD_SUP_M001` — 매입처(공급업체) 마스터
`idx`(PK, auto), `sys_id`, `sup_nm`, `biz_no`, `mgr_nm`, `telno`, `addr`, `rmrk`, `use_yn`, `del_yn`. 관리 화면: `/admin/prd/supplier`.

#### `TN_PRD_LOC_M001` — 지점/창고 마스터
`idx`(PK, auto), `sys_id`, `loc_nm`, `use_yn`, `del_yn`. **업체 생성 시 "본사" 1건이 자동 삽입됨** (`AdminSystemServiceImpl.createSystem()` → `AdminPrdLocMapper.insertDefaultLocation`) — 다지점이 필요없는 업체는 이 개념을 신경 쓸 필요가 없다. 관리 화면: `/admin/prd/location`.

#### `TN_PRD_M001` — 제품 마스터 (카탈로그 정보만, 가격/재고 없음)
`idx`(PK, auto), `sys_id`, `prd_cd`(unique with sys_id), `prd_nm`, `cte_idx`(FK→`TN_PRD_CTE_M001.idx`, nullable, 리프 카테고리만 선택), `prd_expl`, `img_file_grp_id`(FK 개념: `TN_COM_F001.file_grp_id`), `use_yn`, `del_yn`.

#### `TN_PRD_OPT_MAP001` — 제품이 사용하는 옵션 그룹 매핑
`idx`, `prd_idx` FK, `opt_grp_idx` FK, `sort_ord`. unique(`prd_idx`,`opt_grp_idx`). 제품 저장 시 전체 삭제 후 재삽입하는 방식으로 갱신(`AdminProductServiceImpl.saveProduct`).

#### `TN_PRD_SKU_M001` — SKU (가격이 실제로 붙는 판매 단위)
`idx`(PK, auto), `prd_idx` FK, `sku_cd`(unique), `price`(정가), `discount_rate`, `discount_price`(요금제와 동일하게 서비스 레이어에서 `BigDecimal`로 계산 — `AdminProductServiceImpl.saveSkuList`), `barcode`, `use_yn`, `del_yn`. 옵션 조합은 프론트(`skuCombinations.js`)에서 카테시안 곱으로 계산해 후보를 만들고, 사용자가 가격을 입력한 뒤 일괄 저장한다.

#### `TN_PRD_SKU_OPT_MAP001` — SKU가 어떤 옵션 값 조합인지
`idx`, `sku_idx` FK, `opt_val_idx` FK. unique(`sku_idx`,`opt_val_idx`). 옵션 없는 단순 제품은 SKU 1건 + 이 테이블에 행 없음으로 자연 처리됨.

#### `TN_PRD_STK_M001` — 재고 마스터 (SKU × 지점 현재수량 캐시)
`idx`(PK, auto), `sku_idx` FK, `loc_idx` FK, `cur_qty`. unique(`sku_idx`,`loc_idx`). 재고 이력 insert마다 `INSERT ... ON DUPLICATE KEY UPDATE cur_qty = TN_PRD_STK_M001.cur_qty + new_row.cur_qty`(MySQL 8.0.19+ 행 별칭 문법)로 원자적 증분 갱신. **총합은 SKU 기준으로 이 테이블을 다시 SUM, 지점별 조회는 그대로** — 화면에서 토글로 전환.

#### `TN_PRD_STK_H001` — 재고 이력 (입출고 원장)
`idx`(PK, auto), `sku_idx` FK, `loc_idx` FK, `move_type_cd`(공통코드 `STK_MOVE_CD`: IN/OUT/ADJUST/RETURN), `qty`(입고/반품=양수, 출고=음수 — `AdminProductServiceImpl.processStockMove`가 `moveTypeCd`에 따라 서버에서 부호를 강제하며, ADJUST만 클라이언트가 보낸 부호를 그대로 신뢰), `sup_idx`(FK→`TN_PRD_SUP_M001.idx`, nullable, IN일 때만), `unit_cost`(매입단가, nullable, IN일 때만 — 서버가 IN이 아니면 무조건 null 처리), `mv_rsn`. **매입단가(원가) 이력을 별도 테이블로 만들지 않고 이 재고 이력의 IN 타입 행에 얹은 것** — 입고 이벤트 자체가 곧 매입 사실이라, 별도로 관리하면 `cte_cd`가 겪었던 "이중관리" 문제를 반복하게 됨.

공통코드 `STK_MOVE_CD`(`sys_id='CORE'`, 공통코드는 업체별 복제 안 함): `IN`(입고)/`OUT`(출고)/`ADJUST`(조정)/`RETURN`(반품).

---

*최종 갱신: 로컬 라이브 DB(`localhost:3306/bathroom`) JDBC 직접 접속 + `SHOW CREATE TABLE` 전수 덤프로 검증 완료 (2026-07-25). 컬럼 추가/제거 시 이 문서를 함께 갱신하세요.*
