package bath.com.member.web;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.annotate.JsonView;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

import bath.com.common.CommandMap;
import bath.com.main.service.MainService;
import bath.com.member.service.MemberService;
import bath.com.test.service.TestService;

@Controller
public class MemberController {
Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="MemberService")
	private MemberService memberService;

	@Resource(name="MainService")
	private MainService mainService;

	@RequestMapping(value="/usr/member/login.do")
	public ModelAndView login(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/login");
		
		return mv;
	}

	@RequestMapping(value="/usr/member/join.do")
	public ModelAndView join(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/join");
		
		return mv;
	}
	
	@RequestMapping(value="/usr/member/joinUser.do")
	public ModelAndView joinUser(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/main.do");
		
		memberService.insertJoinUser(commandMap.getMap(), request);
		
		return mv;
	}

	@RequestMapping(value="/usr/member/usrList.do")
	public ModelAndView usrList(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/usrList");
		
//		memberService.insertJoinUser(commandMap.getMap(), request);
		
		return mv;
	}
	
	//ajax 예제
	@RequestMapping(value="/usr/member/duplicateIdCheck.do")
	public ModelAndView main_test(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("jsonView");
		Map<String, Object> map = new HashMap<String, Object>() ;
		
		map.put("succes", "good");
		mv.addObject("succes", "good");
		return mv;
	}
		
	@RequestMapping(value="/usr/member/suggestion.do")
	public ModelAndView suggestion(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestion");
		
		//카운트 LNB용
  		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
  		mv.addObject("countList", countList);
  		
  		
  		//강제로 상태이미지 교체 
  		
		return mv;
	}

	@RequestMapping(value="/usr/member/suggestionNoti.do")
	public ModelAndView suggestionNoti(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionNoti");
		
		//카운트 LNB용
  		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
  		mv.addObject("countList", countList);
  		
		if(commandMap.isEmpty() == false){
	        Iterator<Entry<String,Object>> iterator = commandMap.getMap().entrySet().iterator();
	        Entry<String,Object> entry = null;
	        while(iterator.hasNext()){
	            entry = iterator.next();
	            log.debug("key : "+entry.getKey()+", value : "+entry.getValue());
	        }
	    }
		mv.addObject("map",commandMap.getMap());
		
		return mv;
	}
	
	@RequestMapping(value="/usr/member/suggestionCateSel.do")
	public ModelAndView suggestionCateSel(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionCateSel");
		
		//카운트 LNB용
  		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
  		mv.addObject("countList", countList);
		
		mv.addObject("map",commandMap.getMap());
		
		return mv;
	}
	
	@RequestMapping(value="/usr/member/suggestionWrite.do")
	public ModelAndView suggestionWrite(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionWrite");
		
		mv.addObject("map",commandMap.getMap());
		
		return mv;
	}

	@RequestMapping(value="/usr/member/suggestionTempWrite.do")
	public ModelAndView suggestionTempWrite(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionDetail");
		memberService.insertSuggestionTempWrite(commandMap.getMap(), request);
		
		//카운트 LNB용
  		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
  		mv.addObject("countList", countList);
	    
	    Map<String,Object> map = memberService.selectSuggestionDetail(commandMap.getMap());
	    mv.addObject("map", map.get("map"));
	    mv.addObject("fileList", map.get("list"));
	    mv.addObject("baseList", map.get("baselist"));
	    mv.addObject("makeList", map.get("makelist"));
	    mv.addObject("historyList", map.get("historyList"));
		
		return mv;
	}

	@RequestMapping(value="/usr/member/suggestionList.do")
	public ModelAndView suggestionList(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionList");
		//memberService.insertSuggestionTempWrite(commandMap.getMap(), request);
		memberService.changeSuggestionInfo(commandMap.getMap());
		//카운트 LNB용
		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
		mv.addObject("countList", countList);
		
		List<Map<String,Object>> list = memberService.selectSuggestionList(commandMap.getMap());
		mv.addObject("list", list);
		
		mv.addObject("map", commandMap.getMap());
		
		return mv;
	}
	
	@RequestMapping(value="/usr/member/suggestionDetail.do")
	public ModelAndView suggestionDetail(CommandMap commandMap) throws Exception{
	    ModelAndView mv = new ModelAndView("front/member/suggestionDetail");
	    
	    //카운트 LNB용
  		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
  		mv.addObject("countList", countList);
	    
	    Map<String,Object> map = memberService.selectSuggestionDetail(commandMap.getMap());
	    mv.addObject("map", map.get("map"));
	    mv.addObject("fileList", map.get("list"));
	    mv.addObject("baseList", map.get("baselist"));
	    mv.addObject("makeList", map.get("makelist"));
	    mv.addObject("historyList", map.get("historyList"));
	    
	    return mv;
	}
	
	@RequestMapping(value="/usr/member/suggestionUpdate.do")
	public ModelAndView suggestionUpdate(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionUpdateForm");
		
		//카운트 LNB용
		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
		mv.addObject("countList", countList);
		
		Map<String,Object> map = memberService.selectSuggestionDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("fileList", map.get("list"));
		mv.addObject("baseList", map.get("baselist"));
		mv.addObject("makeList", map.get("makelist"));
		mv.addObject("historyList", map.get("historyList"));
		
		return mv;
	}
	
	@RequestMapping(value="/usr/member/suggestionFailUpdate.do")
	public ModelAndView suggestionFailUpdate(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionFailUpdateForm");
		
		//카운트 LNB용
		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
		mv.addObject("countList", countList);
		
		Map<String,Object> map = memberService.selectSuggestionFailDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("fileList", map.get("list"));
		mv.addObject("baseList", map.get("baselist"));
		mv.addObject("makeList", map.get("makelist"));
		mv.addObject("failList", map.get("failList"));
		mv.addObject("historyList", map.get("historyList"));
		
		return mv;
	}
	
	@RequestMapping(value="/usr/member/suggestionTempUpdate.do")
	public ModelAndView suggestionTempUpdate(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionDetail");
		
		memberService.updateSuggestionTempWrite(commandMap.getMap(), request);
		
		//카운트 LNB용
		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
		mv.addObject("countList", countList);
		
		Map<String,Object> map = memberService.selectSuggestionDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("fileList", map.get("list"));
		mv.addObject("baseList", map.get("baselist"));
		mv.addObject("makeList", map.get("makelist"));
		mv.addObject("historyList", map.get("historyList"));
		
		return mv;
	}
	
	
	@RequestMapping(value="/usr/member/suggestionReviewRequest.do")
	public ModelAndView suggestionReviewRequest(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/main.do");
		memberService.updateSuggestionStep(commandMap.getMap());
		
		return mv;
	}
	
	@RequestMapping(value="/usr/member/suggestionTempFailUpdate.do")
	public ModelAndView suggestionTempFailUpdate(CommandMap commandMap,HttpServletRequest request) throws Exception{
		ModelAndView mv = new ModelAndView("front/member/suggestionDetail");
		
		memberService.updateSuggestionFailTempWrite(commandMap.getMap(), request);
		
		//카운트 LNB용
		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
		mv.addObject("countList", countList);
		
		Map<String,Object> map = memberService.selectSuggestionDetail(commandMap.getMap());
		mv.addObject("map", map.get("map"));
		mv.addObject("fileList", map.get("list"));
		mv.addObject("baseList", map.get("baselist"));
		mv.addObject("makeList", map.get("makelist"));
		mv.addObject("historyList", map.get("historyList"));
		
		return mv;
	}
}
