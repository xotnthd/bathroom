package bath.com.test.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import bath.com.dao.AbstractDAO;

@Repository("TestDAO")
public class TestDAO extends AbstractDAO{

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectBoardList(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return (List<Map<String, Object>>)selectList("test.selectBoardList", map);
	}

	public void updateHitCnt(Map<String, Object> map) throws Exception{
	    update("test.updateHitCnt", map);
	}
	 
	@SuppressWarnings("unchecked")
	public Map<String, Object> selectBoardDetail(Map<String, Object> map) throws Exception{
	    return (Map<String, Object>) selectOne("test.selectBoardDetail", map);
	}

	public void insertBoard(Map<String, Object> map) throws Exception{
	    insert("test.insertBoard", map);
	}

	public void updateBoard(Map<String, Object> map) throws Exception{
	    update("test.updateBoard", map);
	}
	
	public void deleteBoard(Map<String, Object> map) throws Exception{
	    update("test.deleteBoard", map);
	}
	
	public void insertFile(Map<String, Object> map) throws Exception{
	    insert("test.insertFile", map);
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectFileList(Map<String, Object> map) throws Exception{
	    return (List<Map<String, Object>>)selectList("test.selectFileList", map);
	}
	
	public void deleteFileList(Map<String, Object> map) throws Exception{
	    update("test.deleteFileList", map);
	}
	 
	public void updateFile(Map<String, Object> map) throws Exception{
	    update("test.updateFile", map);
	}
}
