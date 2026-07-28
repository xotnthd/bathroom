# Backend Architecture

`src/main/java/com/community/bathroom` 전체 소스와 `src/main/resources` 설정/매퍼를 근거로 정리한 백엔드 구조 개요입니다.
DB 컬럼 상세는 [db_schema.md](db_schema.md)를 참고하세요.

## 기술 스택

- **Spring Boot** (Maven, `pom.xml` / `mvnw`), 서버 포트 8080
- **MyBatis** — XML 매퍼 전용 (`mybatis.mapper-locations: classpath*:mapper/**/*.xml`), `map-underscore-to-camel-case: true`로 snake_case ↔ camelCase 자동 매핑. JPA/Entity 클래스 없이 전부 `Map<String,Object>` 기반 파라미터/결과.
- **MySQL** — 스키마명 `bathroom` (`application.yaml`)
- **Spring Security** — 세션 기반 인증(쿠키명 `BATH_SESSION_ID`, 30분 타임아웃), `BCrypt` 비밀번호 해시(`PasswordConfig`)
- **AOP** — `@AuditLog`(감사 로그) + `@TenantGuard`(테넌트 격리/권한 매트릭스 강제) 두 개의 어노테이션 기반 횡단 관심사가 있음

## 멀티테넌시 구조

거의 모든 테이블이 `sys_id` 컬럼을 갖고 있으며, `TN_SYS_M001`이 테넌트(시스템/사이트) 레지스트리 역할을 합니다. 신규 시스템 생성 시 `AdminSystemMapper`의 `copyXxx` 계열 쿼리들이 `sys_id = 'CORE'` 데이터(공통코드, 메뉴, 게시판, 권한그룹)를 새 `sys_id`로 복제하는 방식으로 "사이트 찍어내기"를 구현합니다.

## 패키지 레이어 구조

도메인별로 `controller → service (interface) → service.impl → mapper (interface) ↔ mapper/*.xml` 4계층이 반복되는 구조입니다.

```
com.community.bathroom
├── admin/                      # 관리자 전용 도메인
│   ├── auth/      AdminAuthController(권한/메뉴매트릭스), AdminLoginController(관리자 로그인)
│   ├── board/     AdminBoardController(레거시 고정 게시판), AdminDynamicBoardController(동적 게시판)
│   ├── code/      AdminCodeController — 공통코드 그룹/상세 CRUD
│   ├── menu/      AdminMenuController, AdminMenuDebugController — 메뉴 트리 CRUD
│   ├── popup/     PopupController — 팝업 CRUD (+설문 매핑)
│   ├── survey/    AdminSurveyController — 설문 CRUD/결과통계
│   ├── sys/       AdminSystemController — 시스템(사이트) 생성/설정 (교차 테넌트 전용)
│   ├── user/      AdminUserController — 관리자 로그인 계정 CRUD
│   └── hr/        AdminHrController — 직원(HR) 마스터 CRUD (로그인 계정과 분리된 별도 도메인, TN_MEM_M001과 무관)
├── comn/                        # 도메인 횡단 공통 기능
│   ├── code/      CommonCodeController — 프론트 공용 코드 조회 (CommonCodePicker가 호출)
│   ├── comment/   CommonCommentController — 게시글 댓글(대댓글) — 관리자/사용자 공용
│   ├── config/    MyBatisConfig, PasswordConfig, WebConfig
│   ├── file/      CommonFileController — 파일 업로드/다운로드/삭제 공용
│   ├── log/       AuditLog 어노테이션 + AuditLogAspect + AuditLogMapper
│   └── security/  SecurityConfig, DynamicAdminAuthorizationManager, CommonUserDetailsService, CommonAuthController(통합 로그인/세션체크),
│                  annotation/TenantGuard, aspect/TenantGuardAspect, model/AdminPrincipal — 서버사이드 sysId 검증 + 메뉴별 CRUD 권한 매트릭스 강제
├── customer/main/ MainController — 사용자 메인 화면용 API
├── user/
│   ├── board/     UserDynamicBoardController — 사용자용 동적 게시판 조회
│   └── survey/    UserSurveyController — 설문 응답 제출
└── BathRoomApplication.java
```

## 인증/인가 흐름

1. **로그인**: `CommonAuthController` (`/api/auth/login`)가 Spring Security 인증을 트리거 → `CommonUserDetailsService.loadUserByUsername`이 `SecurityMapper.selectAdminById`(`TN_MEM_M001`+`TN_ATH_A001` 조인)로 1차 조회, 실패 시 `selectUserById`(`TN_USR_M001`, 실제 라이브 DB엔 이 테이블이 없어 이 폴백 경로는 항상 에러남)로 폴백. 조회된 `sysId`/`athrtyLevel`은 이제 `AdminPrincipal`(커스텀 `UserDetails`)에 실려 세션 내내 유지됨.
2. **관리자 화면 접근 제어(1차, 거친 게이트)**: `DynamicAdminAuthorizationManager`가 요청마다 로그인한 사용자의 권한코드(role)가 `TN_ATH_M001`/`TN_MNU_M001` 조인 기준으로 `sys_sect_cd = 'MG'`(관리자) 메뉴에 하나라도 매핑돼 있는지 검사(`/admin/api/**` 전체 진입 여부만 결정, sysId/메뉴별 CRUD는 모름). `S001`/`SUPR`은 `TN_ATH_M001`에 매핑이 하나도 없어도(부트스트랩 직후 등) 이 게이트를 무조건 통과한다(`AdminPrincipal.isSuperAdmin()`/`isTrueSuperAdmin()` 체크).
3. **테넌트 격리 + 메뉴별 CRUD 권한(2차, 정밀 게이트)**: `@TenantGuard(action=..., menuId=...)`가 붙은 컨트롤러 메서드는 `TenantGuardAspect`가 가로채서 (a) 요청의 `sysId`가 로그인한 관리자의 실제 소속과 일치하는지(불일치 시 403, `S001`/`SUPR`/`CORE`의 `A001`만 예외적으로 다른 테넌트 지정 가능), (b) `TN_MNU_M001.menu_id`(불변 키)로 그 테넌트에 해당 메뉴가 실제 사용 중인지(+`sensitive_yn`)를 확인하고 `TN_ATH_M001`의 조회/등록·수정/삭제 플래그를 만족하는지 검사한다. `SUPR`은 민감 메뉴 포함 항상 통과, `S001`은 `sensitive_yn='N'`인 메뉴만 무조건 통과하고 `sensitive_yn='Y'`인 메뉴는 다른 역할과 동일하게 매트릭스를 실제로 확인받는다(2026-07-25 이전엔 `S001`이 모든 메뉴를 예외 없이 통과했음). 프론트의 `menuAuth`(UI 힌트)와 별개로 서버에서 강제되는 실제 권한 경계는 이쪽.
4. 새 관리자 도메인을 추가할 때는 컨트롤러 메서드에 `@TenantGuard`를 붙이고 해당 화면의 `menu_id`(예: `"MNU_USER_01"`)를 지정하기만 하면 이 두 검사가 자동으로 적용된다 (`admin/user/controller/AdminUserController`가 그 예).
5. **권한 레벨(`athrty_level`) 변경 관련 서버측 검증**: `AdminAuthController`의 `role/save`/`role/delete`/`role/level/save`는 클라이언트가 보낸 레벨 관련 값을 신뢰하지 않고 `SecurityContextHolder`의 `AdminPrincipal.getAthrtyLevel()`을 서버에서 직접 읽어 덮어쓴다(과거엔 프론트 `sessionStorage`값을 그대로 믿는 취약점이 있었음 — 2026-07-25 수정). 신규 역할 등록은 항상 최저 등급(99)으로 고정 생성되고, 이후 레벨 조정은 `AuthManage.jsx` 목록의 ▲▼ 버튼 + `role/level/save` 일괄 저장으로만 가능. `athrty_com_cd`가 `S`로 시작하는 역할은 `sys_id='CORE'`가 아니면 생성/개명이 서버에서 거부된다.

### 화면 권한 체크는 URL이 아니라 menu_id로 한다 (2026-07-28)

`TN_MNU_M001.menu_url`은 **사이드바 네비게이션 목적지** 하나의 역할만 한다. 예전에는 이 값을 백엔드 `@TenantGuard(menuUrl=...)`의 exact-match 키, 프론트 `useMenuAuth()`의 prefix-match 키로도 같이 썼는데, 리스트/상세 화면을 URL 모양이 어긋나게 분리하면(상세 경로가 리스트 경로보다 짧아지는 등) 사이드바 링크와 권한 체크가 서로 다른 가정을 하게 되어 깨졌다 (투표 결과 관리 화면이 완전히 안 보이는 사고로 발현, 근본 원인은 하드코딩된 라우트 경로 · DB `menu_url` · 백엔드 어노테이션 문자열 세 곳이 우연히 맞아떨어져야만 하는 구조였음).

- **백엔드**: `@TenantGuard(menuId = "MNU_XXX")`로 `TN_MNU_M001.menu_id`를 직접 지정한다. `TenantGuardAspect`는 `sys_id + menu_id`로 정확히 조회하므로 URL 모양과 완전히 무관하다.
- **프론트**: 화면이 자신이 속한 menu_id를 `admin/menuIds.js`의 `MENU_IDS` 상수로 명시하고 `useMenuAuth(MENU_IDS.XXX)`를 호출한다. `useMenuAuth`는 `menuAuths.find(m => m.menuId === menuId)`로 바로 찾는다.
- **예외**: 동적 게시판(`AdminDynamicBoardList/Detail/Write.jsx`)처럼 화면 하나가 여러 `menu_id`(게시판마다 다름)를 오가는 경우는 menu_id를 하드코딩할 수 없어 `useMenuAuth()`를 인자 없이 호출하는 레거시 prefix-매칭 경로를 그대로 쓴다. 이 경로를 쓰려면 상세/쓰기 라우트가 반드시 목록 라우트의 하위 경로(`.../write`, `.../detail` 등)여야 한다 — 형제 경로나 더 짧은 경로로 만들면 다시 깨진다.
- 새 화면을 추가할 때: 목록/상세가 완전히 분리된 별도 메뉴라면 반드시 각각 명시적 `menu_id`를 선언한다. 절대로 URL 문자열 관계에 의존해서 권한을 추측하지 않는다.

## 감사 로그 (AOP)

컨트롤러 메서드에 `@AuditLog(actionName = "...")`를 붙이면 `AuditLogAspect`가 메서드 실행 후 요청 URL, 호출자 IP, 첫 번째 파라미터를 JSON 직렬화해 `TN_COM_L001`에 비동기 아님(동기) INSERT. 로그 실패는 본 요청에 영향을 주지 않도록 별도 try/catch.

---

## 테이블 ↔ API 매핑

### 관리자 (`/admin/api/**`)

| 도메인 | 컨트롤러 | 주요 엔드포인트 | 관련 테이블 |
|---|---|---|---|
| 로그인 | `AdminLoginController` | `POST /admin/api/auth/login` | `TN_MEM_M001` |
| 권한/메뉴매트릭스 | `AdminAuthController` | `GET /role/list`(호출자가 `SUPR`이 아니면 `SUPR` 행 제외), `POST /role/save`(레벨은 서버 고정, 신규는 항상 99), `POST /role/level/save`(▲▼ 버튼으로 조정된 레벨 일괄 반영, 자신보다 강하게는 서버가 거부), `DELETE /role/delete/{sysId}/{athrtyComCd}`, `GET /matrix`, `POST /matrix/save`(대상이 `SUPR`이면 호출자도 `SUPR`이어야 함, 아니면 403) | `TN_ATH_A001`, `TN_ATH_M001`, `TN_ATH_H001`, `TN_MNU_M001` |
| 권한 템플릿(구조 전용, 요금제 아님) — CORE 전용, 전 엔드포인트 `SUPER_ADMIN_ONLY` | `AdminAuthTplController` | `POST /tpl/list`, `/tpl/save`, `DELETE /tpl/delete/{tplCd}`, `POST /dept/list`, `/dept/save`, `DELETE /dept/delete/{deptIdx}`, `POST /role/list`, `/role/save`, `DELETE /role/delete/{athrtyIdx}`, `POST /menu-map/list`, `/menu-map/save` | `TN_ATH_TPL_P001/D001/A001/M001` (신규 테넌트 생성 시 선택된 요금제가 가리키는 템플릿이 `TN_ATH_A001`/`TN_ATH_M001`로 복제됨) |
| 요금제(상업 조건 — 결제방식/가격/할인/템플릿 참조) — CORE 전용, `SUPER_ADMIN_ONLY` | `AdminPayController` | `POST /pay/list`, `/pay/save`(할인가 서버 계산), `DELETE /pay/delete/{payPlanCd}`(적용 이력 있으면 거부), `GET /pay/history/{sysId}`, `POST /pay/assign`(업체별 요금제 배정/변경 — 이력만 기록, 권한 데이터 재동기화는 안 함) | `TN_PAY_M001`, `TN_PAY_H001`, `TN_ATH_TPL_P001`(참조), `TN_SYS_M001.current_pay_idx` |
| 레거시 게시판 관리 | `AdminBoardController` | `POST /managing/list`, `/managing/save`, `DELETE /managing/delete/{sysId}/{brdId}`, `POST /post/monitor`, `/post/save`, `DELETE /post/kick/{idx}`, `POST /post/kick/bulk`, `/post/restore/{idx}`, `/post/restore/bulk` | `TN_BRD_M001`, `TN_BRD_M002`, `TN_BRD_M003`, `TN_BRD_C001`(댓글수), `TN_COM_F001` |
| 동적 게시판 조회 | `AdminDynamicBoardController` | `POST /board/dynamic/list`, `/detail`, `/master` | `TN_BRD_M001`, `TN_BRD_M002`, `TN_BRD_M003`, `TN_COM_F001`(썸네일), `TN_BRD_C001`(댓글수) |
| 공통코드 | `AdminCodeController` | `GET /group/list`, `POST /group/save`, `DELETE /group/delete/{sysId}/{comCd}`, `GET /detail/list`, `POST /detail/save`, `DELETE /detail/delete/{sysId}/{grpCd}/{uprComCd}/{comCd}` | `TN_COM_C001`, `TN_COM_C002` |
| 메뉴 | `AdminMenuController` | `POST /hierarchical/list`(호출자가 `SUPR`이 아니면 `sensitive_yn='Y'` 메뉴 제외), `/save`(민감 메뉴 생성/수정은 `SUPR`만), `DELETE /delete/{sysId}/{menuId}`, `POST /sidebar/list` | `TN_MNU_M001`, `TN_ATH_M001` |
| 팝업 | `PopupController` | `GET /list`, `/active`, `POST /save`, `DELETE /delete/{popIdx}` | `TN_POP_M001`, `TN_COM_F001`, `TN_SURVEY_M001` |
| 설문 | `AdminSurveyController` | `POST /list`, `/detail`, `/save`, `DELETE /delete/{survId}`, `POST /result/list`, `/result/respondents`, `/result/answers`, `/result/statistics` | `TN_SURVEY_M001/M002/M003`, `TN_SURVEY_P001/P002`, `TN_MEM_M001` |
| 시스템(사이트) | `AdminSystemController` | `POST /list`(요금제명 조인 노출), `GET /detail/{sysId}`, `POST /save`, `GET /check-id`, `POST /create`(생성 시 `payPlanIdx` 필수 — 요금제가 가리키는 템플릿을 `TN_ATH_A001`/`TN_ATH_M001`로 복제하고 `TN_PAY_H001`에 최초 이력 기록) | `TN_SYS_M001`, `TN_COM_F001`, `TN_MEM_M001`, `TN_MEM_M002`, `TN_COM_C001/C002`, `TN_MNU_M001`, `TN_BRD_M001/M002`, `TN_ATH_A001`, `TN_ATH_M001`, `TN_ATH_TPL_P001/D001/A001/M001`(조회만), `TN_PAY_M001/H001` |
| 관리자 계정 (직원 정보 포함, 2026-07-25부로 HR 도메인 통합) | `AdminUserController` | `GET /search`(호출자가 `SUPR`이 아니면 `spadmin` 계정 제외), `POST /save`(사번 중복 시 `RuntimeException`, `athrtyCd='SUPR'` 지정은 `SUPR`만 가능), `DELETE /delete/{sysId}/{userId}`(`spadmin` 삭제는 `SUPR`만 가능) | `TN_MEM_M001`, `TN_MEM_M002`(`emp_no`/`dept_cd`/`position_cd`/`emp_stat_cd`/`hire_dt`/`resign_dt` 포함), `TN_ATH_A001` |

### 사용자 (`/user/api/**`, `/api/**`)

| 도메인 | 컨트롤러 | 주요 엔드포인트 | 관련 테이블 |
|---|---|---|---|
| 동적 게시판 | `UserDynamicBoardController` | `POST /user/api/board/dynamic/list`, `/detail`, `/master` | `TN_BRD_M001/M002/M003`, `TN_COM_F001`, `TN_BRD_C001` |
| 설문 응답 | `UserSurveyController` | `POST /user/api/survey/submit` | `TN_SURVEY_P001`, `TN_SURVEY_P002` |
| 메인화면 | `MainController` | `GET /api/customer/main` | (도메인별 조회 위임) |

### 공통 (`/api/**`, `admin/api/comn/**`)

| 도메인 | 컨트롤러 | 주요 엔드포인트 | 관련 테이블 |
|---|---|---|---|
| 통합 로그인/세션 | `CommonAuthController` | `POST /api/auth/login`, `GET /expired`, `/check` | `TN_MEM_M001`, `TN_ATH_A001`, `TN_USR_M001`(폴백) |
| 공용 코드 조회 | `CommonCodeController` | `GET /api/comn/code/list` | `TN_COM_C002` |
| 게시글 댓글 | `CommonCommentController` | `POST /api/board/comment/list`, `/save`, `DELETE /delete/{cmtIdx}` | `TN_BRD_C001` |
| 공용 파일 | `CommonFileController` | `GET /admin/api/comn/file/list/{fileGrpId}`, `/download/{fileSn}`, `DELETE /delete/{fileSn}` | `TN_COM_F001` |

---

*최종 갱신: 권한 템플릿(구조)과 요금제(상업 조건: 가격/할인/결제방식)를 완전히 분리 — `TN_ATH_TPL_P001`은 `plan_*`→`tpl_*` 컬럼 리네이밍으로 순수 구조 전용이 되고, 신설된 `TN_PAY_M001`/`TN_PAY_H001`이 요금제·업체별 적용 이력을 담당 (2026-07-25).*
