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
<link rel="stylesheet" type="text/css" href="<c:url value='/resources/admin/css/menu/menu.css'/>" />
<head>
	<meta charset="utf-8">
	
	<style type="text/css"></style>
	<title>목욕탕</title>
</head>
<body>
	<div id="topMenu" >
		<ul>
			<li class="topMenuLi">
                <a class="menuLink" href="#">운영관리</a>
                <ul class="submenu">
                    <li><a href="/admin/menu/adminMenuManageList.do" class="submenuLink longLink">메뉴 관리</a></li>
                    <li><a href="#" class="submenuLink longLink">권한 관리</a></li>
                    <li><a href="#" class="submenuLink longLink">공지사항 관리</a></li>
                </ul>
            </li>
			<li>|</li>
            <li class="topMenuLi">
                <a class="menuLink" href="#">게시판 관리</a>
                <ul class="submenu">
                    <li><a href="/admin/menu/adminBbsManageList.do" class="submenuLink longLink">메뉴 관리</a></li>
                    <li><a href="#" class="submenuLink longLink">권한 관리</a></li>
                    <li><a href="#" class="submenuLink longLink">공지사항 관리</a></li>
                </ul>
            </li>
			<li>|</li>
            <li class="topMenuLi">
                <a class="menuLink" href="#">몰라</a>
                <ul class="submenu">
                    <li><a href="#" class="submenuLink">자바스크립트</a></li>
                    <li><a href="#" class="submenuLink">강좌</a></li>
                    <li><a href="#" class="submenuLink">K100D</a></li>
                </ul>
            </li>
			<li>|</li>
            <li class="topMenuLi">
                <a class="menuLink" href="#">막해</a>
            </li>
			<li>|</li>
            <li class="topMenuLi">
                <a class="menuLink" href="#">바보</a>
            </li>
		</ul>
	</div>
</body>
</html>