package com.community.bathroom.admin.vote.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminVoteMapper {
    List<Map<String, Object>> selectVoteList(Map<String, Object> param);
    Map<String, Object> selectVoteDetail(@Param("sysId") String sysId, @Param("voteIdx") Long voteIdx);
    void insertVote(Map<String, Object> param);
    void updateVote(Map<String, Object> param);
    void logicalDeleteVote(@Param("sysId") String sysId, @Param("voteIdx") Long voteIdx);

    List<Map<String, Object>> selectOptions(@Param("voteIdx") Long voteIdx);
    void deleteOptionsByVoteIdx(@Param("voteIdx") Long voteIdx);
    void insertOption(Map<String, Object> param);

    List<Map<String, Object>> selectTargets(@Param("voteIdx") Long voteIdx);
    void deleteTargetsByVoteIdx(@Param("voteIdx") Long voteIdx);
    void insertTarget(Map<String, Object> param);

    Map<String, Object> selectVoterInfo(@Param("sysId") String sysId, @Param("userId") String userId);
    int checkTargetExists(@Param("voteIdx") Long voteIdx, @Param("userIdx") Long userIdx);

    Map<String, Object> selectMyVote(@Param("voteIdx") Long voteIdx, @Param("userIdx") Long userIdx);
    void upsertVoteRecord(Map<String, Object> param);

    List<Map<String, Object>> selectResultCounts(@Param("voteIdx") Long voteIdx);
    List<Map<String, Object>> selectVoters(@Param("voteIdx") Long voteIdx);

    void updateWinner(@Param("voteIdx") Long voteIdx, @Param("winnerOptIdx") Long winnerOptIdx);
}
