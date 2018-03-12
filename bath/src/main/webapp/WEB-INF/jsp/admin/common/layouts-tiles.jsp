<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<%
//스크립틀릿 영역
%>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="<c:url value='/resources/admin/css/layout/layout.css'/>" />
<html>
<head>
	<meta charset="utf-8">
	<style type="text/css"></style>
	<title>목욕탕 - 관리자</title>
</head>
<body>
	<div class="wrap">
      <div class="frm_wrap">
        <div class="header"><tiles:insertAttribute name="header"/></div>
		<div class="center"><tiles:insertAttribute name="body"/></div>
        <div class="footer"><tiles:insertAttribute name="footer"/></div>
      </div> 
    </div>
</body>
</html>
