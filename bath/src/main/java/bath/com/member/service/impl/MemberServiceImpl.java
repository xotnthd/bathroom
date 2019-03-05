package bath.com.member.service.impl;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import bath.com.common.util.FileUtils;
import bath.com.member.service.MemberService;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@Service("MemberService")
public class MemberServiceImpl implements MemberService {
	Logger log = Logger.getLogger(this.getClass());

	@Resource(name="fileUtils")
    private FileUtils fileUtils;
	 
	@Resource(name="MemberDAO")
	private MemberDAO memberDAO;
	
	@Override
	public void insertJoinUser(Map<String, Object> map, HttpServletRequest request) throws Exception{
		memberDAO.insertJoinUser(map);
		
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
            memberDAO.insertFile(list.get(i));
        }
	}
	
	
	@Override
	public void insertSuggestionTempWrite(Map<String, Object> map, HttpServletRequest request) throws Exception{
		
		try {
			
			memberDAO.insertSuggestionTempWrite(map);
			
			//베이스 정보
			String[] base_seq = request.getParameterValues("p_base_seq");
			String[] makeinfo_seq = request.getParameterValues("p_makeinfo_seq");
			
			
			if(null != base_seq) {
				String[] p_base_product_nm = request.getParameterValues("p_base_product_nm");
				String[] p_base_product_nm_eng = request.getParameterValues("p_base_product_nm_eng");
				String[] p_base_product_nm_chn = request.getParameterValues("p_base_product_nm_chn");
				String[] p_base_product_lot = request.getParameterValues("p_base_product_lot");
				String[] p_base_product_sdate = request.getParameterValues("p_base_product_sdate");
				String[] p_base_product_edate = request.getParameterValues("p_base_product_edate");
				String[] p_base_product_smell = request.getParameterValues("p_base_product_smell");
				
				String[] p_base_brand_nm = request.getParameterValues("p_base_brand_nm");
				String[] p_base_brand_nm_eng = request.getParameterValues("p_base_brand_nm_eng");
				String[] p_base_brand_nm_chn = request.getParameterValues("p_base_brand_nm_chn");
				String[] p_base_brand_lot = request.getParameterValues("p_base_brand_lot");
				String[] p_base_brand_sdate = request.getParameterValues("p_base_brand_sdate");
				String[] p_base_brand_edate = request.getParameterValues("p_base_brand_edate");
				String[] p_base_brand_smell = request.getParameterValues("p_base_brand_smell");
				
				for(int i=0; i<base_seq.length;i++) {
					Map<String, Object> baseMap = new HashMap<String,Object>();
					baseMap.put("p_order_seq", map.get("p_order_seq"));
					baseMap.put("p_base_product_nm", p_base_product_nm[i]);
					baseMap.put("p_base_product_nm_eng", p_base_product_nm_eng[i]);
					baseMap.put("p_base_product_nm_chn", p_base_product_nm_chn[i]);
					baseMap.put("p_base_product_lot", p_base_product_lot[i]);
					baseMap.put("p_base_product_sdate", p_base_product_sdate[i]);
					baseMap.put("p_base_product_edate", p_base_product_edate[i]);
					baseMap.put("p_base_product_smell", p_base_product_smell[i]);
					
					baseMap.put("p_base_brand_nm", p_base_brand_nm[i]);
					baseMap.put("p_base_brand_nm_eng", p_base_brand_nm_eng[i]);
					baseMap.put("p_base_brand_nm_chn", p_base_brand_nm_chn[i]);
					baseMap.put("p_base_brand_lot", p_base_brand_lot[i]);
					baseMap.put("p_base_brand_sdate", p_base_brand_sdate[i]);
					baseMap.put("p_base_brand_edate", p_base_brand_edate[i]);
					baseMap.put("p_base_brand_smell", p_base_brand_smell[i]);
					
					memberDAO.insertBaseInfo(baseMap);
				}
			}
			//베이스 정보 끝
			
			if(null != makeinfo_seq) {
				String[] p_company_nm = request.getParameterValues("p_company_nm");
				String[] p_company_addr = request.getParameterValues("p_company_addr");
				String[] p_company_nm_eng = request.getParameterValues("p_company_nm_eng");
				String[] p_company_addr_eng = request.getParameterValues("p_company_addr_eng");
				String[] p_company_nm_chn = request.getParameterValues("p_company_nm_chn");
				String[] p_company_addr_chn = request.getParameterValues("p_company_addr_chn");
				
				for(int i=0; i<makeinfo_seq.length;i++) {
					Map<String, Object> makeMap = new HashMap<String,Object>();
					
					makeMap.put("p_order_seq", map.get("p_order_seq"));
					makeMap.put("p_company_nm", p_company_nm[i]);
					makeMap.put("p_company_addr", p_company_addr[i]);
					makeMap.put("p_company_nm_eng", p_company_nm_eng[i]);
					makeMap.put("p_company_addr_eng", p_company_addr_eng[i]);
					makeMap.put("p_company_nm_chn", p_company_nm_chn[i]);
					makeMap.put("p_company_addr_chn", p_company_addr_chn[i]);
					
					memberDAO.insertMakeInfo(makeMap);
				}
			}
			
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
				memberDAO.insertFile(list.get(i));
			}
			
			//이력 등록
			memberDAO.insertSuggestionHistoryWrite(map);
			
		} catch (Exception e) {
			System.out.println(e);
		}
	}
	
	@Override
    public List<Map<String, Object>> selectSuggestionList(Map<String, Object> map) throws Exception {
        return memberDAO.selectSuggestionList(map);
    }
	
	@Override
	public Map<String, Object> selectSuggestionDetail(Map<String, Object> map) throws Exception {
		Map<String, Object> resultMap = new HashMap<String,Object>();
	    Map<String, Object> tempMap = memberDAO.selectSuggestionDetail(map);
	    resultMap.put("map", tempMap);
	    List<Map<String,Object>> baselist = memberDAO.selectSuggestionBaseList(map);
	    resultMap.put("baselist", baselist);
	    List<Map<String,Object>> makelist = memberDAO.selectSuggestionMakeList(map);
	    resultMap.put("makelist", makelist);
	    
	    List<Map<String,Object>> list = memberDAO.selectSuggestionFileList(map);
	    resultMap.put("list", list);

	    List<Map<String,Object>> historyList = memberDAO.selectSuggestionHistoryList(map);
	    resultMap.put("historyList", historyList);
	    
	    return resultMap;
	}

	@Override
	public Map<String, Object> selectSuggestionFailDetail(Map<String, Object> map) throws Exception {
		Map<String, Object> resultMap = new HashMap<String,Object>();
		Map<String, Object> tempMap = memberDAO.selectSuggestionDetail(map);
		resultMap.put("map", tempMap);
		List<Map<String,Object>> baselist = memberDAO.selectSuggestionBaseList(map);
		resultMap.put("baselist", baselist);
		List<Map<String,Object>> makelist = memberDAO.selectSuggestionMakeList(map);
		resultMap.put("makelist", makelist);
		
		List<Map<String,Object>> list = memberDAO.selectSuggestionFileList(map);
		resultMap.put("list", list);
		
		List<Map<String,Object>> failList = memberDAO.selectSuggestionFailList(map);
		resultMap.put("failList", failList);
		
		List<Map<String,Object>> historyList = memberDAO.selectSuggestionHistoryList(map);
		resultMap.put("historyList", historyList);
		
		return resultMap;
	}
	
	@Override
	public void updateSuggestionTempWrite(Map<String, Object> map, HttpServletRequest request) throws Exception{
		
		try {
			memberDAO.updateSuggestionTempWrite(map);
			
			//베이스 정보
			String[] base_seq = request.getParameterValues("p_base_seq");
			String[] makeinfo_seq = request.getParameterValues("p_makeinfo_seq");
			
			
			if(null != base_seq) {
				
				memberDAO.deleteSuggestionBaseInfo(map);
				
				String[] p_base_product_nm = request.getParameterValues("p_base_product_nm");
				String[] p_base_product_nm_eng = request.getParameterValues("p_base_product_nm_eng");
				String[] p_base_product_nm_chn = request.getParameterValues("p_base_product_nm_chn");
				String[] p_base_product_lot = request.getParameterValues("p_base_product_lot");
				String[] p_base_product_sdate = request.getParameterValues("p_base_product_sdate");
				String[] p_base_product_edate = request.getParameterValues("p_base_product_edate");
				String[] p_base_product_smell = request.getParameterValues("p_base_product_smell");
				
				String[] p_base_brand_nm = request.getParameterValues("p_base_brand_nm");
				String[] p_base_brand_nm_eng = request.getParameterValues("p_base_brand_nm_eng");
				String[] p_base_brand_nm_chn = request.getParameterValues("p_base_brand_nm_chn");
				String[] p_base_brand_lot = request.getParameterValues("p_base_brand_lot");
				String[] p_base_brand_sdate = request.getParameterValues("p_base_brand_sdate");
				String[] p_base_brand_edate = request.getParameterValues("p_base_brand_edate");
				String[] p_base_brand_smell = request.getParameterValues("p_base_brand_smell");
				
				for(int i=0; i<base_seq.length;i++) {
					Map<String, Object> baseMap = new HashMap<String,Object>();
					baseMap.put("p_order_seq", map.get("p_order_seq"));
					baseMap.put("p_base_product_nm", p_base_product_nm[i]);
					baseMap.put("p_base_product_nm_eng", p_base_product_nm_eng[i]);
					baseMap.put("p_base_product_nm_chn", p_base_product_nm_chn[i]);
					baseMap.put("p_base_product_lot", p_base_product_lot[i]);
					baseMap.put("p_base_product_sdate", p_base_product_sdate[i]);
					baseMap.put("p_base_product_edate", p_base_product_edate[i]);
					baseMap.put("p_base_product_smell", p_base_product_smell[i]);
					
					baseMap.put("p_base_brand_nm", p_base_brand_nm[i]);
					baseMap.put("p_base_brand_nm_eng", p_base_brand_nm_eng[i]);
					baseMap.put("p_base_brand_nm_chn", p_base_brand_nm_chn[i]);
					baseMap.put("p_base_brand_lot", p_base_brand_lot[i]);
					baseMap.put("p_base_brand_sdate", p_base_brand_sdate[i]);
					baseMap.put("p_base_brand_edate", p_base_brand_edate[i]);
					baseMap.put("p_base_brand_smell", p_base_brand_smell[i]);
					
					memberDAO.insertBaseInfo(baseMap);
				}
			}
			//베이스 정보 끝
			
			if(null != makeinfo_seq) {
				
				memberDAO.deleteSuggestionMakeInfo(map);
				
				String[] p_company_nm = request.getParameterValues("p_company_nm");
				String[] p_company_addr = request.getParameterValues("p_company_addr");
				String[] p_company_nm_eng = request.getParameterValues("p_company_nm_eng");
				String[] p_company_addr_eng = request.getParameterValues("p_company_addr_eng");
				String[] p_company_nm_chn = request.getParameterValues("p_company_nm_chn");
				String[] p_company_addr_chn = request.getParameterValues("p_company_addr_chn");
				
				for(int i=0; i<makeinfo_seq.length;i++) {
					Map<String, Object> makeMap = new HashMap<String,Object>();
					
					makeMap.put("p_order_seq", map.get("p_order_seq"));
					makeMap.put("p_company_nm", p_company_nm[i]);
					makeMap.put("p_company_addr", p_company_addr[i]);
					makeMap.put("p_company_nm_eng", p_company_nm_eng[i]);
					makeMap.put("p_company_addr_eng", p_company_addr_eng[i]);
					makeMap.put("p_company_nm_chn", p_company_nm_chn[i]);
					makeMap.put("p_company_addr_chn", p_company_addr_chn[i]);
					
					memberDAO.insertMakeInfo(makeMap);
				}
			}
			
			//기존 파일 리스트 항목 가져오기 
			List<Map<String,Object>> fileList = memberDAO.selectSuggestionFileList(map);
			
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
			// 업로드 된 파일 목록 가져오기 
			List<Map<String,Object>> list = fileUtils.parseInsertFileInfo(map, request);
			if(list.size()>0) {
				
				memberDAO.deleteFileList(map);
				
				for(int i=0; i<2; i++){
					Map<String, Object> tempMap = new HashMap<String,Object>();
					if(i == 0) {
						if("Y".equals(map.get("p_file0_new"))) {
							
							memberDAO.insertFile(list.get(i));
							
						}else if("N".equals(map.get("p_file0_new"))){
							
							tempMap.put("p_order_seq", map.get("p_order_seq"));
							tempMap.put("p_original_file_nm", fileList.get(i).get("ORIGINAL_FILE_NM"));
							tempMap.put("p_order_seq", fileList.get(i).get("STORED_FILE_NM"));
							tempMap.put("p_order_seq", fileList.get(i).get("FILE_SIZE"));
							
							memberDAO.insertFile(tempMap);
						}
					}else if(i == 1) {
						if("Y".equals(map.get("p_file1_new"))) {
							
							memberDAO.insertFile(list.get(i));
							
						}else if("N".equals(map.get("p_file1_new"))){
							
							tempMap.put("p_order_seq", map.get("p_order_seq"));
							tempMap.put("p_original_file_nm", fileList.get(i).get("ORIGINAL_FILE_NM"));
							tempMap.put("p_order_seq", fileList.get(i).get("STORED_FILE_NM"));
							tempMap.put("p_order_seq", fileList.get(i).get("FILE_SIZE"));
							memberDAO.insertFile(tempMap);
						}
					}
				}
			}
			
			//이력 등록
			memberDAO.insertSuggestionHistoryWrite(map);
			
		} catch (Exception e) {
			System.out.println(e);
		}
	}

	@Override
	public void updateSuggestionFailTempWrite(Map<String, Object> map, HttpServletRequest request) throws Exception{
		
		try {
			memberDAO.updateSuggestionFailTempWrite(map);
			
			//베이스 정보
			String[] base_seq = request.getParameterValues("p_base_seq");
			String[] makeinfo_seq = request.getParameterValues("p_makeinfo_seq");
			
			
			if(null != base_seq) {
				
				memberDAO.deleteSuggestionBaseInfo(map);
				
				String[] p_base_product_nm = request.getParameterValues("p_base_product_nm");
				String[] p_base_product_nm_eng = request.getParameterValues("p_base_product_nm_eng");
				String[] p_base_product_nm_chn = request.getParameterValues("p_base_product_nm_chn");
				String[] p_base_product_lot = request.getParameterValues("p_base_product_lot");
				String[] p_base_product_sdate = request.getParameterValues("p_base_product_sdate");
				String[] p_base_product_edate = request.getParameterValues("p_base_product_edate");
				String[] p_base_product_smell = request.getParameterValues("p_base_product_smell");
				
				String[] p_base_brand_nm = request.getParameterValues("p_base_brand_nm");
				String[] p_base_brand_nm_eng = request.getParameterValues("p_base_brand_nm_eng");
				String[] p_base_brand_nm_chn = request.getParameterValues("p_base_brand_nm_chn");
				String[] p_base_brand_lot = request.getParameterValues("p_base_brand_lot");
				String[] p_base_brand_sdate = request.getParameterValues("p_base_brand_sdate");
				String[] p_base_brand_edate = request.getParameterValues("p_base_brand_edate");
				String[] p_base_brand_smell = request.getParameterValues("p_base_brand_smell");
				
				for(int i=0; i<base_seq.length;i++) {
					Map<String, Object> baseMap = new HashMap<String,Object>();
					baseMap.put("p_order_seq", map.get("p_order_seq"));
					baseMap.put("p_base_product_nm", p_base_product_nm[i]);
					baseMap.put("p_base_product_nm_eng", p_base_product_nm_eng[i]);
					baseMap.put("p_base_product_nm_chn", p_base_product_nm_chn[i]);
					baseMap.put("p_base_product_lot", p_base_product_lot[i]);
					baseMap.put("p_base_product_sdate", p_base_product_sdate[i]);
					baseMap.put("p_base_product_edate", p_base_product_edate[i]);
					baseMap.put("p_base_product_smell", p_base_product_smell[i]);
					
					baseMap.put("p_base_brand_nm", p_base_brand_nm[i]);
					baseMap.put("p_base_brand_nm_eng", p_base_brand_nm_eng[i]);
					baseMap.put("p_base_brand_nm_chn", p_base_brand_nm_chn[i]);
					baseMap.put("p_base_brand_lot", p_base_brand_lot[i]);
					baseMap.put("p_base_brand_sdate", p_base_brand_sdate[i]);
					baseMap.put("p_base_brand_edate", p_base_brand_edate[i]);
					baseMap.put("p_base_brand_smell", p_base_brand_smell[i]);
					
					memberDAO.insertBaseInfo(baseMap);
				}
			}
			//베이스 정보 끝
			
			if(null != makeinfo_seq) {
				
				memberDAO.deleteSuggestionMakeInfo(map);
				
				String[] p_company_nm = request.getParameterValues("p_company_nm");
				String[] p_company_addr = request.getParameterValues("p_company_addr");
				String[] p_company_nm_eng = request.getParameterValues("p_company_nm_eng");
				String[] p_company_addr_eng = request.getParameterValues("p_company_addr_eng");
				String[] p_company_nm_chn = request.getParameterValues("p_company_nm_chn");
				String[] p_company_addr_chn = request.getParameterValues("p_company_addr_chn");
				
				for(int i=0; i<makeinfo_seq.length;i++) {
					Map<String, Object> makeMap = new HashMap<String,Object>();
					
					makeMap.put("p_order_seq", map.get("p_order_seq"));
					makeMap.put("p_company_nm", p_company_nm[i]);
					makeMap.put("p_company_addr", p_company_addr[i]);
					makeMap.put("p_company_nm_eng", p_company_nm_eng[i]);
					makeMap.put("p_company_addr_eng", p_company_addr_eng[i]);
					makeMap.put("p_company_nm_chn", p_company_nm_chn[i]);
					makeMap.put("p_company_addr_chn", p_company_addr_chn[i]);
					
					memberDAO.insertMakeInfo(makeMap);
				}
			}
			
			//기존 파일 리스트 항목 가져오기 
			List<Map<String,Object>> fileList = memberDAO.selectSuggestionFileList(map);
			
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
			// 업로드 된 파일 목록 가져오기 
			List<Map<String,Object>> list = fileUtils.parseInsertFileInfo(map, request);
			if(list.size()>0) {
				
				memberDAO.deleteFileList(map);
				
				for(int i=0; i<2; i++){
					Map<String, Object> tempMap = new HashMap<String,Object>();
					if(i == 0) {
						if("Y".equals(map.get("p_file0_new"))) {
							
							memberDAO.insertFile(list.get(i));
							
						}else if("N".equals(map.get("p_file0_new"))){
							
							tempMap.put("p_order_seq", map.get("p_order_seq"));
							tempMap.put("p_original_file_nm", fileList.get(i).get("ORIGINAL_FILE_NM"));
							tempMap.put("p_order_seq", fileList.get(i).get("STORED_FILE_NM"));
							tempMap.put("p_order_seq", fileList.get(i).get("FILE_SIZE"));
							
							memberDAO.insertFile(tempMap);
						}
					}else if(i == 1) {
						if("Y".equals(map.get("p_file1_new"))) {
							
							memberDAO.insertFile(list.get(i));
							
						}else if("N".equals(map.get("p_file1_new"))){
							
							tempMap.put("p_order_seq", map.get("p_order_seq"));
							tempMap.put("p_original_file_nm", fileList.get(i).get("ORIGINAL_FILE_NM"));
							tempMap.put("p_order_seq", fileList.get(i).get("STORED_FILE_NM"));
							tempMap.put("p_order_seq", fileList.get(i).get("FILE_SIZE"));
							memberDAO.insertFile(tempMap);
						}
					}
				}
			}
			
			//이력 등록
			memberDAO.insertSuggestionHistoryWrite(map);
			
		} catch (Exception e) {
			System.out.println(e);
		}
	}
	
	@Override
	public void updateSuggestionStep(Map<String, Object> map) throws Exception{
		String v_order_flow_next = "";
		if("E".equals(map.get("p_order_flow"))){
			v_order_flow_next = "A";
		}
		
		map.put("p_order_flow_next", v_order_flow_next);
		memberDAO.updateSuggestionStep(map);
		map.put("p_order_flow", v_order_flow_next);
		memberDAO.insertSuggestionHistoryWrite(map);
	}
	
	@Override
	public void changeSuggestionInfo(Map<String, Object> map) throws Exception{
		
		/**
		 * 상태값 변경 로직을 위한 리스트 추출
		 * 
		 * 검토요청 중 -> 검토 중
		 * A -> C
		 * 
		 * 검토 중 -> 접수 중  이거나 반려로  가야 한다 8:2 확률로
		 * C-> B OR C -> F
		 * 
		 * 접수 중일 경우 완료
		 * B -> D 
		 * 
		 * 만약 F를 거쳤다가 왔을 경우.fail_yn 이 y인 것. 
		 * 무조건 완료 D
		 * 
		 */
		List<Map<String, Object>> infoList = memberDAO.selectSuggestionInfoList(map);
		
		if(infoList.size()>0) {
			for(int i=0;i<infoList.size();i++) {
				
				//임시 저장용 맵 객체 생성
				Map<String, Object> tempMap = new HashMap<String,Object>();
	
				//history 이력용.
				tempMap.put("p_order_seq", infoList.get(i).get("ORDER_SEQ"));
				tempMap.put("p_order_cate", infoList.get(i).get("ORDER_CATE"));
				tempMap.put("p_product_cate", infoList.get(i).get("PRODUCT_CATE"));
				tempMap.put("p_product_nm", infoList.get(i).get("PRODUCT_NM"));
				if(!"Y".equals(infoList.get(i).get("FAIL_YN"))) {
					
					if("A".equals(infoList.get(i).get("ORDER_FLOW"))) { // 검토 요청 중일 경우
						tempMap.put("p_order_flow_next", "C");
					}else if("C".equals(infoList.get(i).get("ORDER_FLOW"))) { // 검토 중 일 경우
						Random randomGenerator = new Random();
						int randomInt = randomGenerator.nextInt(10); //0 ~ 9 사이의 int를 랜덤으로 생성
						
						if(randomInt <= 8) { // 80% 확률로 접수 
							tempMap.put("p_order_flow_next", "F");
							//반려 사유 저장 하기
							int returnInt = randomGenerator.nextInt(5); // 0~4 사이의 int를 랜덤으로 생성
							returnInt = returnInt + 1;
							tempMap.put("p_return_seq", returnInt);
							
							memberDAO.insertSuggentionReturnInfo(tempMap);
						}else {
							tempMap.put("p_order_flow_next", "B");
						}
					}else if("B".equals(infoList.get(i).get("ORDER_FLOW"))) { // 접수 중 일 경우
						tempMap.put("p_order_flow_next", "D");
						
					}
				}else {  //반려 되었던 것일 경우.
					if("C".equals(infoList.get(i).get("ORDER_FLOW"))) { // 검토 중 일 경우
						tempMap.put("p_order_flow_next", "B");
					}else {
						tempMap.put("p_order_flow_next", "D");
					}
				}
				memberDAO.updateSuggestionStep(tempMap);
				tempMap.put("p_order_flow", tempMap.get("p_order_flow_next"));
				memberDAO.insertSuggestionHistoryWrite(tempMap);
				if("F".equals(tempMap.get("p_order_flow_next"))) {
					memberDAO.updateSuggestionValue(tempMap);
				}
			
			}
		}
		
		//반려시 오류 목록 만들기 화 
	}
}
