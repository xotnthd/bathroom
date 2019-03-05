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
		
		//카운트 LNB용
		List<Map<String,Object>> countList = mainService.selectOrderCountInfo(commandMap.getMap());
		mv.addObject("countList", countList);
		
		//검토요청 중
		commandMap.put("flow_type", "A");
		List<Map<String,Object>> aFlow = mainService.selectOrderingList(commandMap.getMap());
		//검토 중
		commandMap.put("flow_type", "C");
		List<Map<String,Object>> cFlow = mainService.selectOrderingList(commandMap.getMap());
		//접수 중
		commandMap.put("flow_type", "B");
		List<Map<String,Object>> bFlow = mainService.selectOrderingList(commandMap.getMap());
		//반려
		commandMap.put("flow_type", "F");
		List<Map<String,Object>> fFlow = mainService.selectOrderingList(commandMap.getMap());
		
		mv.addObject("aList", aFlow);
		mv.addObject("bList", bFlow);
		mv.addObject("cList", cFlow);
		mv.addObject("fList", fFlow);
		
		return mv;
	}
	
	@RequestMapping(value="/maintest.do")
	public ModelAndView main_test(CommandMap commandMap) throws Exception{
		ModelAndView mv = new ModelAndView("front/main/main");
		
		
		
		return mv;
	}
}
