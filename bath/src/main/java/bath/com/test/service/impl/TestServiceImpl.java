package bath.com.test.service.impl;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import bath.com.common.util.FileUtils;
import bath.com.test.service.TestService;

@Service("TestService")
public class TestServiceImpl implements TestService {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="TestDAO")
	private TestDAO testDAO;
	
	@Resource(name="fileUtils")
    private FileUtils fileUtils;
	
	@Override
    public List<Map<String, Object>> selectBoardList(Map<String, Object> map) throws Exception {
        return testDAO.selectBoardList(map);
    }
	
	@Override
	public Map<String, Object> selectBoardDetail(Map<String, Object> map) throws Exception {
		testDAO.updateHitCnt(map);
		Map<String, Object> resultMap = new HashMap<String,Object>();
	    Map<String, Object> tempMap = testDAO.selectBoardDetail(map);
	    resultMap.put("map", tempMap);
	     
	    List<Map<String,Object>> list = testDAO.selectFileList(map);
	    resultMap.put("list", list);
	    
	    return resultMap;
	}
	
	@Override
	public void insertBoard(Map<String, Object> map, HttpServletRequest request) throws Exception {
		testDAO.insertBoard(map);
		
		//file upload 관련
	    MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest)request;
	    Iterator<String> iterator = multipartHttpServletRequest.getFileNames();
	    MultipartFile multipartFile = null;
	    while(iterator.hasNext()){
	        multipartFile = multipartHttpServletRequest.getFile(iterator.next());
	        if(multipartFile.isEmpty() == false){
	            log.debug("------------- file start -------------");
	            log.debug("name : "+multipartFile.getName());
	            log.debug("filename : "+multipartFile.getOriginalFilename());
	            log.debug("size : "+multipartFile.getSize());
	            log.debug("-------------- file end --------------\n");
	        }
	    }
	    
	    List<Map<String,Object>> list = fileUtils.parseInsertFileInfo(map, request);
        for(int i=0, size=list.size(); i<size; i++){
        	testDAO.insertFile(list.get(i));
        }
	}
	
	@Override
	public void updateBoard(Map<String, Object> map, HttpServletRequest request) throws Exception{
		testDAO.updateBoard(map);
		
		testDAO.deleteFileList(map);
	    List<Map<String,Object>> list = fileUtils.parseUpdateFileInfo(map, request);
	    Map<String,Object> tempMap = null;
	    for(int i=0, size=list.size(); i<size; i++){
	        tempMap = list.get(i);
	        if(tempMap.get("IS_NEW").equals("Y")){
	        	testDAO.insertFile(tempMap);
	        }
	        else{
	        	testDAO.updateFile(tempMap);
	        }
	    }
	}
	
	@Override
	public void deleteBoard(Map<String, Object> map) throws Exception {
		testDAO.deleteBoard(map);
	}
}
