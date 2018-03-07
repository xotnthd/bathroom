<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
</head>
<%-- <link rel="stylesheet" type="text/css" href="<c:url value='/resources/front/css/main/main.css'/>" /> --%>
<%-- <link rel="stylesheet" type="text/css" href="<c:url value='/resources/front/css/bbs/board.css'/>" /> --%>
<style>
#contentsWrapper {
	float: left;
	width: 100%;
	margin-right: -200px;
}

.content {
	margin-right: 200px;
}

#sidebar {
	width: 200px;
	float: right;
}
	
</style>
<script type="text/javascript">

</script>
<body>
<form name="form1" id="form1" >
<input type="hidden" id="p_bbs_id" name="p_bbs_id"  value=""/>
<!-- 등록버튼 시작 -->
<div id="contentsWrapper">
	<div class="content">이거말일세</div>
	<div class="content">한글이 나오니?</div>
</div>
<div id="sidebar">asdf</div>
</form>
</body>
</html>