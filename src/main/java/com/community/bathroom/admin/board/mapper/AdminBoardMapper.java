package com.community.bathroom.admin.board.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminBoardMapper {
    // 기존 기능
    List<Map<String, Object>> selectBoardManagingList(Map<String, Object> searchParam);
    Map<String, Object> selectBoardManagingDetail(Map<String, Object> param);
    List<Map<String, Object>> selectCommonCodeList(@Param("sysId") String sysId, @Param("grpCd") String grpCd, @Param("uprComCd") String uprComCd);

    // 게시판 관리
    int checkBoardManagingExists(Map<String, Object> param);
    void insertBoardManaging(Map<String, Object> param);
    void insertBoardManagingConfig(Map<String, Object> param);
    void updateBoardManaging(Map<String, Object> param);
    void updateBoardManagingConfig(Map<String, Object> param);
    void deleteBoardManaging(@Param("sysId") String sysId, @Param("brdId") String brdId);
    void deletePostsByBrdId(@Param("sysId") String sysId, @Param("brdId") String brdId);

    // 게시글 및 파일
    List<Map<String, Object>> selectMonitorPostList(@Param("sysId") String sysId, @Param("brdId") String brdId);
    void insertBoardPost(Map<String, Object> param);
    void updateBoardPost(Map<String, Object> param);
    void logicalDeleteBoardPost(@Param("idx") Long idx);
    void updateBoardPostBulkDelete(@Param("ids") List<Long> ids);
    void restoreBoardPost(@Param("idx") Long idx);
    void updateBoardPostBulkRestore(@Param("ids") List<Long> ids);

    List<Map<String, Object>> selectCommonFileList(@Param("sysId") String sysId, @Param("fileGrpId") String fileGrpId);

}