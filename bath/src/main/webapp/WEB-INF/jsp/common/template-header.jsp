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
		alert(val);
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
	
</script>
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="<c:url value='/css/layout/layout.css'/>" />
	<style type="text/css"></style>
	<title>목욕탕</title>
</head>
<body>
	<form id="headerform" name="headerform" method="post">
		
	</form>
	<div class="m_login">
		<div>
			<button type="button" onclick="login();">로그인</button>
			<button type="button" onclick="join();">회원가입</button>
		</div> 
	</div>
	<div class="m_wrap">
		<nav>
			<div class="logo">
				<h1><a href="javascript:void(0);" onclick="fn_getMenu('H');">목욕탕</a></h1>
			</div>
			<ul>
				<li>
					<a href="javascript:void(0);" onclick="fn_getMenu('H');">HOME</a>
					<ul>
						<li><a href="javascript:void(0);" onclick="fn_getMenu('H');">기본정보</a></li>
						<li><a href="javascript:void(0);" onclick="fn_getMenu('A');">유저목록</a></li>
						<li><a href="#">subMenu3</a></li>
					</ul>
				</li>
				<li>
					<a href="#">남탕</a>
					<ul>
						<li><a href="javascript:void(0);" onclick="fn_getMenu('B');">기본게시판</a></li>
						<li><a href="#">subMenu2</a></li>
						<li><a href="#">subMenu3</a></li>
					</ul>
				</li>
				<li>
					<a href="#">혼탕</a>
					<ul>
						<li><a href="#">subMenu1</a></li>
						<li><a href="#">subMenu2</a></li>
						<li><a href="#">subMenu3</a></li>
					</ul>
				</li>
				<li>
					<a href="#">여탕</a>
					<ul>
						<li><a href="#">subMenu1</a></li>
						<li><a href="#">subMenu2</a></li>
						<li><a href="#">subMenu3</a></li>
					</ul>
				</li>
			</ul>
		</nav>
	</div><!-- .wrap End -->
</body>
</html>