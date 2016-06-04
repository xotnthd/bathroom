package bath.com.main.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import bath.com.main.service.MainService;

@Service("MainService")
public class MainServiceImpl implements MainService {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="MainDAO")
	private MainDAO mainDAO;
	
	@Override
    public List<Map<String, Object>> selectBoardList(Map<String, Object> map) throws Exception {
        return mainDAO.selectBoardList(map);
    }
	
}
