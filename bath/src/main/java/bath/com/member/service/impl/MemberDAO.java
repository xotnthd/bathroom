package bath.com.member.service.impl;

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
}
