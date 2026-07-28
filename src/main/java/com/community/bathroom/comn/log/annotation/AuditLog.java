package com.community.bathroom.comn.log.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD) // 메서드에만 적용 가능
@Retention(RetentionPolicy.RUNTIME) // 런타임까지 유지
public @interface AuditLog {
    // 로그에 남길 '수행 기능명' (예: "메뉴 등록", "게시글 수정")
    String actionName() default "";
}