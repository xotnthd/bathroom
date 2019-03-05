package bath.com.member.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;
import bath.com.dao.AbstractDAO;

@Repository("MemberDAO")
public class MemberDAO extends AbstractDAO {

	public void insertJoinUser(Map<String, Object> map) throws Exception{
	    insert("member.insertJoinUser", map);
	}
	
	public void insertFile(Map<String, Object> map) throws Exception{
	    insert("member.insertFile", map);
	}

	public void insertSuggestionTempWrite(Map<String, Object> map) throws Exception{
		insert("member.insertSuggestionTempWrite", map);
	}

	public void insertBaseInfo(Map<String, Object> map) throws Exception{
		insert("member.insertBaseInfo", map);
	}

	public void insertMakeInfo(Map<String, Object> map) throws Exception{
		insert("member.insertMakeInfo", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectSuggestionList(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return (List<Map<String, Object>>)selectList("member.selectSuggestionList", map);
	}

	public void insertSuggestionHistoryWrite(Map<String, Object> map) throws Exception{
		insert("member.insertSuggestionHistoryWrite", map);
	}
	
	@SuppressWarnings("unchecked")
	public Map<String, Object> selectSuggestionDetail(Map<String, Object> map) throws Exception{
	    return (Map<String, Object>) selectOne("member.selectSuggestionDetail", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectSuggestionFileList(Map<String, Object> map) throws Exception{
	    return (List<Map<String, Object>>)selectList("member.selectSuggestionFileList", map);
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectSuggestionBaseList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("member.selectSuggestionBaseList", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectSuggestionMakeList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("member.selectSuggestionMakeList", map);
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectSuggestionHistoryList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("member.selectSuggestionHistoryList", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectSuggestionFailList(Map<String, Object> map) throws Exception{
		return (List<Map<String, Object>>)selectList("member.selectSuggestionFailList", map);
	}
	
	public void updateSuggestionTempWrite(Map<String, Object> map) throws Exception{
		update("member.updateSuggestionTempWrite", map);
	}

	public void updateSuggestionFailTempWrite(Map<String, Object> map) throws Exception{
		update("member.updateSuggestionFailTempWrite", map);
	}
	
	public void deleteSuggestionBaseInfo(Map<String, Object> map) throws Exception{
	    update("member.deleteSuggestionBaseInfo", map);
	}

	public void deleteSuggestionMakeInfo(Map<String, Object> map) throws Exception{
		update("member.deleteSuggestionMakeInfo", map);
	}

	public void deleteFileList(Map<String, Object> map) throws Exception{
		update("member.deleteFileList", map);
	}

	public void updateSuggestionStep(Map<String, Object> map) throws Exception{
		update("member.updateSuggestionStep", map);
	}

	public void updateSuggestionValue(Map<String, Object> map) throws Exception{
		update("member.updateSuggestionValue", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectSuggestionInfoList(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return (List<Map<String, Object>>)selectList("member.selectSuggestionInfoList", map);
	}
	
	public void insertSuggentionReturnInfo(Map<String, Object> map) throws Exception{
		insert("member.insertSuggentionReturnInfo", map);
	}
}
