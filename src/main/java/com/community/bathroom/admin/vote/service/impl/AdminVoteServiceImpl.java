package com.community.bathroom.admin.vote.service.impl;

import com.community.bathroom.admin.vote.mapper.AdminVoteMapper;
import com.community.bathroom.admin.vote.service.AdminVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AdminVoteServiceImpl implements AdminVoteService {

    @Autowired
    private AdminVoteMapper adminVoteMapper;

    @Override
    public List<Map<String, Object>> getVoteList(Map<String, Object> param) {
        return adminVoteMapper.selectVoteList(param);
    }

    @Override
    public Map<String, Object> getVoteDetail(String sysId, Long voteIdx) {
        Map<String, Object> vote = adminVoteMapper.selectVoteDetail(sysId, voteIdx);
        if (vote == null) return null;
        vote.put("options", adminVoteMapper.selectOptions(voteIdx));
        vote.put("targets", adminVoteMapper.selectTargets(voteIdx));
        return vote;
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public Map<String, Object> saveVote(Map<String, Object> param) {
        boolean isInsert = param.get("idx") == null || String.valueOf(param.get("idx")).isEmpty();
        if (isInsert) {
            adminVoteMapper.insertVote(param);
        } else {
            param.put("voteIdx", param.get("idx"));
            adminVoteMapper.updateVote(param);
        }
        Long voteIdx = ((Number) param.get("idx")).longValue();

        // 보기(옵션) - 매번 전체 삭제 후 재등록
        adminVoteMapper.deleteOptionsByVoteIdx(voteIdx);
        List<Map<String, Object>> options = (List<Map<String, Object>>) param.get("options");
        if (options != null) {
            int sortOrd = 0;
            for (Map<String, Object> opt : options) {
                Map<String, Object> optParam = new HashMap<>();
                optParam.put("voteIdx", voteIdx);
                optParam.put("optNm", opt.get("optNm"));
                optParam.put("sortOrd", sortOrd++);
                optParam.put("userId", param.get("userId"));
                adminVoteMapper.insertOption(optParam);
            }
        }

        // 지정 인원 대상 - target_type이 SELECTED가 아니게 되어도 기존 행은 정리
        adminVoteMapper.deleteTargetsByVoteIdx(voteIdx);
        if ("SELECTED".equals(param.get("targetType"))) {
            List<Object> targetUserIdxList = (List<Object>) param.get("targetUserIdxList");
            if (targetUserIdxList != null) {
                for (Object userIdxObj : targetUserIdxList) {
                    Map<String, Object> tParam = new HashMap<>();
                    tParam.put("voteIdx", voteIdx);
                    tParam.put("userIdx", ((Number) userIdxObj).longValue());
                    tParam.put("userId", param.get("userId"));
                    adminVoteMapper.insertTarget(tParam);
                }
            }
        }

        param.put("idx", voteIdx);
        return param;
    }

    @Override
    @Transactional
    public void deleteVote(String sysId, Long voteIdx) {
        adminVoteMapper.logicalDeleteVote(sysId, voteIdx);
    }

    private boolean isEligible(Map<String, Object> vote, Map<String, Object> voterInfo, Long voteIdx) {
        String targetType = (String) vote.get("targetType");
        if ("ALL".equals(targetType)) return true;
        if ("DEPT".equals(targetType)) {
            String targetAthrtyCd = (String) vote.get("targetAthrtyCd");
            return targetAthrtyCd != null && targetAthrtyCd.equals(voterInfo.get("athrtyCd"));
        }
        if ("SELECTED".equals(targetType)) {
            Long userIdx = ((Number) voterInfo.get("userIdx")).longValue();
            return adminVoteMapper.checkTargetExists(voteIdx, userIdx) > 0;
        }
        return false;
    }

    private boolean isWithinPeriod(Map<String, Object> vote) {
        LocalDate today = LocalDate.now();
        LocalDate bgngDt = toLocalDate(vote.get("bgngDt"));
        LocalDate endDt = toLocalDate(vote.get("endDt"));
        return !today.isBefore(bgngDt) && !today.isAfter(endDt);
    }

    private LocalDate toLocalDate(Object dateObj) {
        if (dateObj instanceof LocalDate localDate) return localDate;
        if (dateObj instanceof java.sql.Date sqlDate) return sqlDate.toLocalDate();
        if (dateObj instanceof java.util.Date utilDate) {
            return utilDate.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        }
        return LocalDate.parse(String.valueOf(dateObj));
    }

    @Override
    public Map<String, Object> getEligibility(String sysId, Long voteIdx, String userId) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> vote = adminVoteMapper.selectVoteDetail(sysId, voteIdx);
        Map<String, Object> voterInfo = adminVoteMapper.selectVoterInfo(sysId, userId);
        if (vote == null || voterInfo == null) {
            result.put("eligible", false);
            result.put("withinPeriod", false);
            result.put("myOptIdx", null);
            return result;
        }
        boolean eligible = isEligible(vote, voterInfo, voteIdx);
        result.put("eligible", eligible);
        result.put("withinPeriod", isWithinPeriod(vote));
        Map<String, Object> myVote = adminVoteMapper.selectMyVote(voteIdx, ((Number) voterInfo.get("userIdx")).longValue());
        result.put("myOptIdx", myVote != null ? myVote.get("optIdx") : null);
        return result;
    }

    @Override
    @Transactional
    public void castVote(String sysId, Long voteIdx, String userId, Long optIdx) {
        Map<String, Object> vote = adminVoteMapper.selectVoteDetail(sysId, voteIdx);
        if (vote == null) throw new IllegalArgumentException("존재하지 않는 투표입니다.");
        Map<String, Object> voterInfo = adminVoteMapper.selectVoterInfo(sysId, userId);
        if (voterInfo == null) throw new IllegalArgumentException("계정 정보를 확인할 수 없습니다.");
        if (!isEligible(vote, voterInfo, voteIdx)) throw new IllegalStateException("투표 대상이 아닙니다.");
        if (!isWithinPeriod(vote)) throw new IllegalStateException("투표 기간이 아닙니다.");

        Map<String, Object> param = new HashMap<>();
        param.put("voteIdx", voteIdx);
        param.put("optIdx", optIdx);
        param.put("userIdx", ((Number) voterInfo.get("userIdx")).longValue());
        adminVoteMapper.upsertVoteRecord(param);
    }

    @Override
    public Map<String, Object> getResult(String sysId, Long voteIdx) {
        Map<String, Object> vote = adminVoteMapper.selectVoteDetail(sysId, voteIdx);
        if (vote == null) return null;

        List<Map<String, Object>> counts = adminVoteMapper.selectResultCounts(voteIdx);
        long total = 0;
        for (Map<String, Object> c : counts) {
            total += ((Number) c.get("voteCnt")).longValue();
        }

        Long winnerOptIdx;
        if ("RANDOM".equals(vote.get("voteMode"))) {
            winnerOptIdx = vote.get("winnerOptIdx") != null ? ((Number) vote.get("winnerOptIdx")).longValue() : null;
        } else {
            winnerOptIdx = null;
            long maxCnt = -1;
            for (Map<String, Object> c : counts) {
                long cnt = ((Number) c.get("voteCnt")).longValue();
                if (cnt > 0 && cnt > maxCnt) {
                    maxCnt = cnt;
                    winnerOptIdx = ((Number) c.get("optIdx")).longValue();
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("vote", vote);
        result.put("counts", counts);
        result.put("totalVoteCnt", total);
        result.put("winnerOptIdx", winnerOptIdx);
        result.put("voters", "N".equals(vote.get("anonymousYn")) ? adminVoteMapper.selectVoters(voteIdx) : new ArrayList<>());
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> drawWinner(String sysId, Long voteIdx) {
        Map<String, Object> vote = adminVoteMapper.selectVoteDetail(sysId, voteIdx);
        if (vote == null) throw new IllegalArgumentException("존재하지 않는 투표입니다.");
        if (!"RANDOM".equals(vote.get("voteMode"))) throw new IllegalStateException("랜덤 추첨 방식의 투표가 아닙니다.");
        if (!LocalDate.now().isAfter(toLocalDate(vote.get("endDt")))) {
            throw new IllegalStateException("투표 마감 후에만 추첨할 수 있습니다.");
        }
        if (vote.get("winnerOptIdx") == null) {
            List<Map<String, Object>> options = adminVoteMapper.selectOptions(voteIdx);
            if (options.isEmpty()) throw new IllegalStateException("보기가 없습니다.");
            Map<String, Object> picked = options.get(ThreadLocalRandom.current().nextInt(options.size()));
            Long winnerOptIdx = ((Number) picked.get("idx")).longValue();
            adminVoteMapper.updateWinner(voteIdx, winnerOptIdx);
        }
        return getResult(sysId, voteIdx);
    }
}
