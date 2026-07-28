package com.community.bathroom.comn.security.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 컨트롤러 메서드에 붙여서 서버사이드 테넌트(sys_id) 격리와 메뉴별 CRUD 권한 매트릭스를 강제한다.
 * 실제 검사는 {@link com.community.bathroom.comn.security.aspect.TenantGuardAspect}가 수행한다.
 *
 * menuId는 TN_MNU_M001.menu_id(불변 키)를 그대로 적어야 한다 (예: "MNU_BOARD_01").
 * 프론트엔드 라우트 경로(menu_url)는 사이드바 이동 목적지로만 쓰이는 값이라 여기서는 참조하지 않는다 -
 * URL 문자열로 권한을 추측하면 리스트/상세 라우트 모양이 어긋날 때 깨지기 쉽다 (2026-07-28 투표결과 화면 사고 참고).
 * SUPER_ADMIN_ONLY일 때는 menuId를 쓰지 않는다 (테넌트 자체를 관리/생성하는 화면 전용).
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface TenantGuard {

    enum Action {
        /** 조회 (inqireYn) */
        READ,
        /** 등록 또는 수정 (rgstYn OR mdfcnYn 중 하나만 있어도 통과) */
        WRITE,
        /** 삭제 (delYn) */
        DELETE,
        /** 특정 메뉴가 아니라 "교차 테넌트 조작이 가능한 사람인가"만 확인 (시스템/테넌트 관리 화면 전용) */
        SUPER_ADMIN_ONLY
    }

    Action action();

    String menuId() default "";
}
