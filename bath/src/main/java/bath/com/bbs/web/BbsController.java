package bath.com.bbs.web;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import bath.com.common.CommandMap;
import bath.com.bbs.service.BbsService;

@Controller
public class BbsController {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="BbsService")
	private BbsService bbsService;
	
	@RequestMapping(value="/bbs/boardList.do")
	public ModelAndView boardList(CommandMap commandMap,HttpServletRequest request, HttpServletResponse response,HttpSession session) throws Exception{
		ModelAndView mv = new ModelAndView("/bbs/bbsList");
		
		List<Map<String,Object>> list = bbsService.selectBoardList(commandMap.getMap());
		mv.addObject("list", list);
		
		return mv;
	}
	
	@RequestMapping(value="/bbs/boardWriteForm.do")
	public ModelAndView boardWriteForm(CommandMap commandMap,HttpServletRequest request, HttpServletResponse response,HttpSession session) throws Exception{
		ModelAndView mv = new ModelAndView("/bbs/bbsWriteForm");
		
		return mv;
	}

	@RequestMapping(value="/bbs/boardWrite.do")
	public ModelAndView boardWrite(CommandMap commandMap,HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception{
		ModelAndView mv = new ModelAndView("redirect:/bbs/boardList.do");
		
		bbsService.insertbbsWrite(commandMap.getMap(), request);
		return mv;
	}
}
