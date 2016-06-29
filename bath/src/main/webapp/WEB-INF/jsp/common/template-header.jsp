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
	</script>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="<c:url value='/css/layout/layout.css'/>" />
		<style type="text/css"></style>
		<title>목욕탕</title>
	</head>
	<body>
		<!-- <div id="header_menu">
			<ul>
				<li><a>menu1</a></li>
				<li><a>menu2</a></li>
				<li><a>menu3</a></li>
				<li><a>menu4</a></li>
			</ul>
		</div> -->
		<div class="m_wrap">
			<nav>
				<div class="logo">
					<h1>목욕탕</h1>
				</div>
				<ul>
					<li>
						<a href="#">HOME</a>
						<ul>
							<li><a href="#">subMenu1</a></li>
							<li><a href="#">subMenu2</a></li>
							<li><a href="#">subMenu3</a></li>
						</ul>
					</li>
					<li>
						<a href="#">남성게시판</a>
						<ul>
							<li><a href="#">subMenu1</a></li>
							<li><a href="#">subMenu2</a></li>
							<li><a href="#">subMenu3</a></li>
						</ul>
					</li>
					<li>
						<a href="#">공통게시판</a>
						<ul>
							<li><a href="#">subMenu1</a></li>
							<li><a href="#">subMenu2</a></li>
							<li><a href="#">subMenu3</a></li>
						</ul>
					</li>
					<li>
						<a href="#">여성게시판</a>
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