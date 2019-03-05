<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<%
	/*  템플릿 상단 
	 * 	
	 *	최초생성 		| 생성자  
	 *	-----------------------
	 *	2016.06.04  | 송태수
	 *	
	*/
	
%> 
<html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script type="text/javascript">
	$(function(){
		var menu=$('nav>ul>li');
		menu.hover(function(){
			$(this).find('ul').slideDown().parent().siblings().children('ul').slideUp();
		}, function(){
			$('nav ul ul').slideUp(600);
		})
	});
	
	
	function fn_getMenu(val,etc){
		var f = document.headerform;
		var url = '';
// 		alert(val);
		if(val == "H"){
			url = "<c:url value='/main.do' />";
		}else if(val =="B"){
			url = "<c:url value='/bbs/boardList.do' />";
		}else if(val == 'A'){
			url = "<c:url value='/usr/member/usrList.do' />";
		}
		
		f.action = url;
		f.submit();
	}
	
	function login(){
		var f = document.headerform;
		
		f.action = "<c:url value='/usr/member/login.do' />";
		f.submit();
	}
	function join(){
		var f = document.headerform;
		f.action = "<c:url value='/usr/member/join.do' />";
		f.submit();
	}
	
	function fn_goInsert(){
		var f = document.headerform;
		f.action = "<c:url value='/usr/member/suggestion.do' />";
		f.submit();
	}
	
	function fn_main(){
		var f = document.headerform;
		f.action = "<c:url value='/main.do' />";
		f.submit();
	}
</script>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="<c:url value='/resources/front/css/layout/layout.css'/>" />
	<style type="text/css"></style>
	<title>제안시스템</title>
</head>
<body>
<form id="headerform" name="headerform" method="post">
	<div class="m_wrap">
		<nav>
			<div class="logo">
				<h1><a href="javascript:void(0);" onclick="fn_goInsert();">접수하기</a></h1>
			</div> 
			<ul>
				<li>
					<a href="javascript:void(0);" onclick="fn_main();">관리자</a>
				</li>
				<li>
					<div>
						<select name="selectbox1">
							<option value="접수시스템">접수시스템</option>
							<option value="배송추적">배송추적</option>
						</select>
					</div>
					<!-- <a href="javascript:alert('서비스 준비 중');">그룹 계정 관리</a> -->
				</li>
				<li>
					<a href="javascript:void(0);">톱니바퀴</a>
				</li>
				<li>
					<a href="javascript:void(0);">벨모양</a>
				</li>
				<li>
					<a href="javascript:void(0);">사람모양</a>
				</li>
			</ul>
		</nav>
	</div><!-- .wrap End -->
</form>
</body>
</html>