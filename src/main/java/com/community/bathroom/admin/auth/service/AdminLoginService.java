package com.community.bathroom.admin.auth.service;

import java.util.Map;

public interface AdminLoginService {
    // 단순 조회가 아닌, 아이디와 암호화 비밀번호 매칭까지 처리하는 명확한 비즈니스 메서드로 변경합니다.
    Map<String, Object> loginProcess(String userId, String rawPswd);
}
