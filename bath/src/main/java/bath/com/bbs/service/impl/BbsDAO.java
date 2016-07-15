package bath.com.bbs.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import bath.com.dao.AbstractDAO;

@Repository("BbsDAO")
public class BbsDAO extends AbstractDAO{

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectBoardList(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return (List<Map<String, Object>>)selectList("bbs.selectBoardList", map);
	}
	
	public void insertbbsWrite(Map<String, Object> map) throws Exception{
		insert("bbs.insertbbsWrite", map);
	}
	
	public void insertFile(Map<String, Object> map) throws Exception{
		insert("bbs.insertBbsFile", map);
	}
}
