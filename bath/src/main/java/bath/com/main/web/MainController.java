package bath.com.main.web;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.jcraft.jsch.Session;

import bath.com.common.CommandMap;
import bath.com.main.service.MainService;

@Controller
public class MainController {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="MainService")
	private MainService mainService;
	
	@RequestMapping(value="/main.do")
	public ModelAndView main(CommandMap commandMap,HttpServletRequest request, HttpServletResponse response,HttpSession session) throws Exception{
		ModelAndView mv = new ModelAndView("front/main/main");
		
//		request.getSession();
		String v_usrid = (String)session.getAttribute("p_usrid");
		
		System.out.println(v_usrid);
		
		
//		commandMap.put("p_bbs_id", "1"); //��������
//		System.out.println(commandMap.get("p_bbs_id"));
//		List<Map<String,Object>> noticeList = mainService.selectBoardList(commandMap.getMap());
//		mv.addObject("noticeList", noticeList);
		
		return mv;
	}
	
	@RequestMapping(value="/maintest.do")
	public ModelAndView main_test(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("front/main/main");
		
		return mv;
	}
}
