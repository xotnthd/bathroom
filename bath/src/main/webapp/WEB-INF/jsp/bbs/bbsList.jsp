<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
<script type="text/javascript">
function fn_regiBoard(){
	var f = document.form1;
	
	f.action = "<c:url value='/bbs/boardWriteForm.do' />";
	f.submit();
}
</script>
<title>게시판</title>
</head>
<body>
<form name="form1" id="form1" method="post">
<h2>게시판 목록</h2>
	<table style="width:100%;height:80%; border:1px solid #ccc">
	    <colgroup>
	        <col width="10%"/>
	        <col width="*"/>
	        <col width="15%"/>
	        <col width="20%"/>
	        <col width="20%"/>
	    </colgroup>
	    <thead>
	        <tr>
	            <th scope="col">글번호</th>
	            <th scope="col">제목</th>
	            <th scope="col">내용</th>
	            <th scope="col">작성자</th>
	            <th scope="col">작성일</th>
	        </tr>
	    </thead>
	    <tbody>
	        <c:choose>
	            <c:when test="${fn:length(list) > 0}">
	                <c:forEach items="${list }" var="list">
	                    <tr>
	                        <td>${list.SEQ }</td>
	                        <td>${list.TITLE }</td>
	                        <td>${list.CONTENTS }</td>
	                        <td>${list.CRUSER }</td>
	                        <td>${list.CRDT }</td>
	                    </tr>
	                </c:forEach>
	            </c:when>
	            <c:otherwise>
	                <tr>
	                    <td colspan="5">조회된 결과가 없습니다.</td>
	                </tr>
	            </c:otherwise>
	        </c:choose>
	         
	    </tbody>
	</table>
	<div>
		<button type="button" onclick="fn_regiBoard();">등록</button>
	</div>
</form>
</body>
</html>