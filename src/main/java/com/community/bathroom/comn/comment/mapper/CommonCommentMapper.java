package com.community.bathroom.comn.comment.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface CommonCommentMapper {
    List<Map<String, Object>> selectCommentList(Map<String, Object> param);
    Map<String, Object> selectCommentById(Long cmtIdx);
    int insertComment(Map<String, Object> param);
    int updateComment(Map<String, Object> param);
    int logicalDeleteComment(Long cmtIdx);
}
