package com.community.bathroom.admin.vote.service;

import java.util.List;
import java.util.Map;

public interface AdminVoteService {
    List<Map<String, Object>> getVoteList(Map<String, Object> param);
    Map<String, Object> getVoteDetail(String sysId, Long voteIdx);
    Map<String, Object> saveVote(Map<String, Object> param);
    void deleteVote(String sysId, Long voteIdx);

    Map<String, Object> getEligibility(String sysId, Long voteIdx, String userId);
    void castVote(String sysId, Long voteIdx, String userId, Long optIdx);
    Map<String, Object> getResult(String sysId, Long voteIdx);
    Map<String, Object> drawWinner(String sysId, Long voteIdx);
}
