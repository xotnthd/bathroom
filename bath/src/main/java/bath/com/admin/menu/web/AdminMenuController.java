package bath.com.admin.menu.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import bath.com.admin.menu.service.AdminMenuService;
import bath.com.common.CommandMap;

@Controller
public class AdminMenuController {
	Logger log = Logger.getLogger(this.getClass());
	
	@Resource(name="AdminMenuService")
	private AdminMenuService adminMenuService;
	
	@RequestMapping(value="/admin/menu/adminMenuManageList.do")
	public ModelAndView adminBoardList(CommandMap commandMap,HttpServletRequest request, HttpServletResponse response,HttpSession session) throws Exception{
		ModelAndView mv = new ModelAndView("admin/admin/menu/menuManageList");
		
		return mv;
	}
}
