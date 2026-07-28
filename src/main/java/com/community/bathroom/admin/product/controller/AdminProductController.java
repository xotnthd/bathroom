package com.community.bathroom.admin.product.controller;

import com.community.bathroom.admin.product.service.AdminProductService;
import com.community.bathroom.comn.security.annotation.TenantGuard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/product")
public class AdminProductController {

    @Autowired
    private AdminProductService adminProductService;

    private String getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return "system";
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRD_01")
    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> getProductList(@RequestBody Map<String, Object> param) {
        String sysId = (String) param.get("sysId");
        String searchKeyword = (String) param.get("searchKeyword");
        Long cteIdx = param.get("cteIdx") != null ? ((Number) param.get("cteIdx")).longValue() : null;
        Integer pageNum = param.get("pageNum") != null ? ((Number) param.get("pageNum")).intValue() : null;
        Integer pageSize = param.get("pageSize") != null ? ((Number) param.get("pageSize")).intValue() : null;
        return ResponseEntity.ok(adminProductService.getProductList(sysId, searchKeyword, cteIdx, pageNum, pageSize));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRD_01")
    @GetMapping("/detail/{sysId}/{idx}")
    public ResponseEntity<Map<String, Object>> getProduct(@PathVariable String sysId, @PathVariable Long idx) {
        return ResponseEntity.ok(adminProductService.getProduct(sysId, idx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_PRD_01")
    @PostMapping("/save")
    public ResponseEntity<?> saveProduct(@RequestBody Map<String, Object> param) {
        try {
            param.put("userId", getLoginUserId());
            adminProductService.saveProduct(param);
            return ResponseEntity.ok(param);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @TenantGuard(action = TenantGuard.Action.DELETE, menuId = "MNU_PRD_01")
    @DeleteMapping("/delete/{sysId}/{idx}")
    public ResponseEntity<?> deleteProduct(@PathVariable String sysId, @PathVariable Long idx) {
        adminProductService.deleteProduct(sysId, idx);
        return ResponseEntity.ok().build();
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRD_01")
    @GetMapping("/optgroup/list")
    public ResponseEntity<List<Map<String, Object>>> getProductOptGroups(@RequestParam Long prdIdx) {
        return ResponseEntity.ok(adminProductService.getProductOptGroups(prdIdx));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRD_01")
    @GetMapping("/sku/list")
    public ResponseEntity<List<Map<String, Object>>> getSkuList(@RequestParam Long prdIdx) {
        return ResponseEntity.ok(adminProductService.getSkuList(prdIdx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_PRD_01")
    @PostMapping("/sku/save")
    public ResponseEntity<?> saveSkuList(@RequestBody Map<String, Object> param) {
        try {
            Long prdIdx = ((Number) param.get("prdIdx")).longValue();
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> skus = (List<Map<String, Object>>) param.get("skus");
            adminProductService.saveSkuList(prdIdx, skus, getLoginUserId());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRD_01")
    @GetMapping("/stock/list")
    public ResponseEntity<List<Map<String, Object>>> getStockByProduct(@RequestParam String sysId, @RequestParam Long prdIdx) {
        return ResponseEntity.ok(adminProductService.getStockByProduct(sysId, prdIdx));
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRD_01")
    @GetMapping("/stock/summary")
    public ResponseEntity<List<Map<String, Object>>> getStockSummary(@RequestParam Long prdIdx) {
        return ResponseEntity.ok(adminProductService.getStockSummaryByProduct(prdIdx));
    }

    @TenantGuard(action = TenantGuard.Action.WRITE, menuId = "MNU_PRD_01")
    @PostMapping("/stock/move")
    public ResponseEntity<?> processStockMove(@RequestBody Map<String, Object> param) {
        param.put("userId", getLoginUserId());
        adminProductService.processStockMove(param);
        return ResponseEntity.ok().build();
    }

    @TenantGuard(action = TenantGuard.Action.READ, menuId = "MNU_PRD_01")
    @GetMapping("/stock/history")
    public ResponseEntity<List<Map<String, Object>>> getStockHistory(@RequestParam Long prdIdx) {
        return ResponseEntity.ok(adminProductService.getStockHistory(prdIdx));
    }
}
