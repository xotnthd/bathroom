package bath.com.member.web;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import bath.com.common.CommandMap;

@Controller
public class MemberController {
Logger log = Logger.getLogger(this.getClass());
	
	@RequestMapping(value="/usr/member/login.do")
	public ModelAndView login(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("/member/login");
		
		return mv;
	}

	@RequestMapping(value="/usr/member/join.do")
	public ModelAndView join(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("/member/join");
		
		return mv;
	}
	
		
}
