package bath.com.bbs.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface BbsService {

	/**
	 * 게시판 리스트 가져오기
	 * @param map
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> selectBoardList(Map<String, Object> map) throws Exception;
	
	/**
	 * 게시판 글쓰기
	 * @param map
	 * @param request
	 * @throws Exception
	 */
	void insertbbsWrite(Map<String, Object> map, HttpServletRequest request) throws Exception;
}
