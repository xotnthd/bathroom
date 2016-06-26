package bath.com.main.service;

import java.util.List;
import java.util.Map;

import bath.com.common.CommandMap;

public interface MainService {

	List<Map<String, Object>> selectBoardList(Map<String, Object> map) throws Exception;

//	List<Map<String, Object>> selectBoardList(CommandMap commandMap);
	
}
