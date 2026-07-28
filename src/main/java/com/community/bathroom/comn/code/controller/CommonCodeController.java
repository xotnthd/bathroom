package com.community.bathroom.comn.code.controller;

import com.community.bathroom.comn.code.service.CommonCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comn/code")
public class CommonCodeController {

    @Autowired
    private CommonCodeService commonCodeService;

    // 공통코드 목록 반환 API (권한 체크 없이 공용으로 사용 가능하도록 설계)
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getCommonCodeList(
            @RequestParam(defaultValue = "CORE") String sysId,
            @RequestParam String grpCd,
            @RequestParam(required = false) String uprComCd) {

        return ResponseEntity.ok(commonCodeService.getCommonCodeList(sysId, grpCd, uprComCd));
    }
}