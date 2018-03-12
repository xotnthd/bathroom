package bath.com.member.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.annotate.JsonView;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

import bath.com.common.CommandMap;
import bath.com.member.service.MemberService;
import bath.com.test.service.TestService;

@Controller
public class MemberController {
Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="MemberService")
	private MemberService memberService;

	@RequestMapping(value="/usr/member/login.do")
	public ModelAndView login(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("/front/member/login");
		
		return mv;
	}

	@RequestMapping(value="/usr/member/join.do")
	public ModelAndView join(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("/front/member/join");
		
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
		ModelAndView mv = new ModelAndView("/front/member/usrList");
		
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
		
}
