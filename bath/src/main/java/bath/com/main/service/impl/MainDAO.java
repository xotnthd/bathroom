package bath.com.main.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import bath.com.dao.AbstractDAO;

@Repository("MainDAO")
public class MainDAO extends AbstractDAO{

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> selectBoardList(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return (List<Map<String, Object>>)selectList("main.selectBoardList", map);
	}

}
