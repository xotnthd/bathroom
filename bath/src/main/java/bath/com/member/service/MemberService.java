package bath.com.member.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface MemberService {

	void insertJoinUser(Map<String, Object> map, HttpServletRequest request) throws Exception;
	
	void insertSuggestionTempWrite(Map<String, Object> map, HttpServletRequest request) throws Exception;
	
	List<Map<String, Object>> selectSuggestionList(Map<String, Object> map) throws Exception;
	
	Map<String, Object> selectSuggestionDetail(Map<String, Object> map) throws Exception;

	Map<String, Object> selectSuggestionFailDetail(Map<String, Object> map) throws Exception;
	
	void updateSuggestionTempWrite(Map<String, Object> map, HttpServletRequest request) throws Exception;
	
	void updateSuggestionStep(Map<String, Object> map) throws Exception;
	
	void changeSuggestionInfo(Map<String, Object> map) throws Exception;
	
	void updateSuggestionFailTempWrite(Map<String, Object> map, HttpServletRequest request) throws Exception;
}
