<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
</head>


<%-- <link rel="stylesheet" type="text/css" href="<c:url value='/css/main/main.css'/>" /> --%>
<link rel="stylesheet" type="text/css" href="<c:url value='/css/bbs/board.css'/>" />

<script type="text/javascript">
function regBoard(){
    
    var f = document.form1;
    f.action = "<c:url value='/bbs/boardWrite.do' />"
    f.method = "post";
    f.submit();  
	
}
</script>
<body>
<form name="form1" id="form1" >
<input type="hidden" id="p_bbs_id" name="p_bbs_id"  value=""/>
<!-- 등록버튼 시작 -->
<div class="box">
<!-- 	<div class="b_left"> -->
	
		<div class="boardcss_list_add_button_table">
			<div class="boardcss_list_add_button">
				<button type="button" class="add_button" onclick="regBoard()">등록</button>
				<ul></ul>
			</div>
		</div>
		<!-- 등록버튼 종료 -->
		
		<!-- 테이블 시작 -->
		<div class="boardcss_list_table">
			<table class="list_table">
				<caption>공지사항</caption>
				<colgroup>
					<col width="15%" />
					<col width="45%" />
					<col width="20%" />
					<col width="20%" />
				</colgroup>
				<thead>
					<tr>
						<th>번호</th>
						<th>제목</th>
						<th>이름</th>
						<th>등록일자</th>
					</tr>
				</thead>
				<tbody>
				<c:choose>
					<c:when test="${fn:length(noticeList) > 0}">
					<c:forEach items="${list }" var="row">
						<tr>
							<td>${row.SEQ }</td>
							<td>${row.TITLE }</td>
							<td>${row.CRUSER }</td>
							<td>${row.CRDT }</td>
						</tr>
					</c:forEach>
					</c:when>
					<c:otherwise>
						<tr>
							<td colspan="4">데이터가 없습니다.</td>
						</tr>
					</c:otherwise>
				</c:choose>
				</tbody>
			</table>
		</div>
<!-- 	</div> -->
<!-- 테이블 종료 -->
</div>
</form>
</body>
</html>