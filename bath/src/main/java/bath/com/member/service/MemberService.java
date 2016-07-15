package bath.com.member.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface MemberService {

	void insertJoinUser(Map<String, Object> map, HttpServletRequest request) throws Exception;
}
