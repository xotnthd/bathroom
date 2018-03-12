<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<%
	/*  템플릿 상단 
	 * 	
	 *	최초생성 		| 생성자  
	 *	-----------------------
	 *	2018.03.08  | 송태수
	 *	
	*/
	
%> 

<head>
	<meta charset="utf-8">
	
	<style type="text/css"></style>
	<title>목욕탕</title>
	<link rel="stylesheet" type="text/css" href="<c:url value='/resources/admin/css/dtree/dtree.css'/>" />
	<script type="text/javascript" src="<c:url value='/resources/admin/js/dtree/dtree.js'/>"/>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
</head>
<body>
	<div>
	
	<!-- 검색 조건 영역 START -->
		<div class="dtree">
	
			<p><a href="javascript: d.openAll();">open all</a> | <a href="javascript: d.closeAll();">close all</a></p>
		
			<script type="text/javascript">
				d = new dTree('d');
		
				d.add(0,-1,'Bath');
				d.add(1,0,'Node 1','example01.html');
				d.add(2,0,'Node 2','example01.html');
				d.add(3,1,'Node 1.1','example01.html');
				d.add(4,0,'Node 3','example01.html');
				d.add(5,3,'Node 1.1.1','example01.html');
				d.add(6,5,'Node 1.1.1.1','example01.html');
				d.add(7,0,'Node 4','example01.html');
				d.add(8,1,'Node 1.2','example01.html');
				d.add(9,0,'My Pictures','example01.html','Pictures I\'ve taken over the years','','','/resources/admin/images/dtree/imgfolder.gif');
				d.add(10,9,'The trip to Iceland','example01.html','Pictures of Gullfoss and Geysir');
				d.add(11,9,'Mom\'s birthday','example01.html');
				
				document.write(d);
			</script>
	
		</div>
		<div class="input">
		</div>
	</div>
	<!-- 검색 조건 영역 END -->
</body>
