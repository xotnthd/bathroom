package com.community.bathroom.customer.main.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

/*
 * 작업 경로: src/main/java/com/community/bathroom/customer/main/controller/MainController.java
 * 설명: 사용자(Customer) 영역의 메인 화면 API 컨트롤러
 */
@RestController
@RequestMapping("/api/customer") // 사용자 도메인 전용 API 루트 경로
public class MainController {

    /**
     * 사용자 메인 화면에 필요한 기본 데이터를 반환합니다.
     * @return 메인 화면 노출용 응답 맵
     */
    @GetMapping("/main")
    public Map<String, Object> getCustomerMain() {
        Map<String, Object> response = new HashMap<>();

        // 메인 화면에 띄울 임시 데이터 세팅
        response.put("status", "SUCCESS");
        response.put("message", "bathRoom 커뮤니티에 오신 것을 환영합니다!");
        response.put("serviceName", "사용자 메인 서비스");

        return response;
    }
}