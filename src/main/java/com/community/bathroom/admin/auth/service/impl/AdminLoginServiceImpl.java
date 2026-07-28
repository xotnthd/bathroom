package com.community.bathroom.admin.auth.service.impl;

import com.community.bathroom.admin.auth.mapper.AdminLoginMapper;
import com.community.bathroom.admin.auth.service.AdminLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AdminLoginServiceImpl implements AdminLoginService {

    @Autowired
    private AdminLoginMapper adminLoginMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // PasswordConfig에서 등록한 빈을 주입받습니다.

    @Override
    public Map<String, Object> loginProcess(String userId, String rawPswd) {
        // 1. 입력받은 단건 ID 정보를 기반으로 DB에서 암호화된 비밀번호가 포함된 유저 데이터를 가져옵니다.
        Map<String, Object> userInfo = adminLoginMapper.selectAdminUserInfo(userId);

        if (userInfo != null) {
            // DB에 저장된 BCrypt 암호화 해시 문자열을 추출합니다.
            String encodedPswd = (String) userInfo.get("pswd");

            // 2. 가상으로 전달받은 평문 비밀번호(rawPswd)와 DB의 해시 비밀번호(encodedPswd)를 내부 알고리즘으로 비교합니다.
            if (passwordEncoder.matches(rawPswd, encodedPswd)) {
                // 로그인 인증 성공 시, 외부 유출 방지를 위해 결과 Map 데이터에서 암호화 비밀번호 컬럼을 소거합니다.
                userInfo.remove("pswd");
                return userInfo;
            }
        }

        // 유저 정보가 없거나 비밀번호 검증이 실패한 경우 통일된 실패 규격(null)을 반환합니다.
        return null;
    }
}