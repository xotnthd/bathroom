package bath.com.admin.bbs.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import bath.com.admin.bbs.service.AdminBbsService;
import bath.com.common.CommandMap;

import org.apache.log4j.Logger;

@Controller
public class AdminBbsController {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="AdminBbsService")
	private AdminBbsService adminBbsService;
	
	@RequestMapping(value="/admin/bbs/adminBoardList.do")
	public ModelAndView adminBoardList(CommandMap commandMap,HttpServletRequest request, HttpServletResponse response,HttpSession session) throws Exception{
		ModelAndView mv = new ModelAndView("admin/admin/bbs/bbsManageList");
		
		return mv;
	}
}
