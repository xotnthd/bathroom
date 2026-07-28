package com.community.bathroom.comn.log.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.Map;

@Mapper
public interface AuditLogMapper {
    void insertAuditLog(Map<String, Object> logParam);
}