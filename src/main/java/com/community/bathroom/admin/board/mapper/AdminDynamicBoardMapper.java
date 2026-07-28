package com.community.bathroom.admin.board.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminDynamicBoardMapper {
    List<Map<String, Object>> selectDynamicBoardList(Map<String, Object> param);
    int selectDynamicBoardCount(Map<String, Object> param);
    Map<String, Object> selectDynamicBoardDetail(Map<String, Object> param);
    Map<String, Object> selectBoardMasterInfo(@Param("sysId") String sysId, @Param("brdId") String brdId);
}
