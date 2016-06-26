package bath.com.bbs.web;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import bath.com.common.CommandMap;

@Controller
public class BbsController {
	Logger log = Logger.getLogger(this.getClass());
	
	@RequestMapping(value="/bbs/boardWrite.do")
	public ModelAndView main(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("/bbs/bbsManageList");
		
		return mv;
	}
}
