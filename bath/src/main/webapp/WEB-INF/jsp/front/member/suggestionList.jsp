<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>제안시스템</title>
</head>
<script type="text/javascript">
$(document).ready(function(){
	var f = document.form1;
	
	var a = parseInt($("#aCnt").val());
	var b = parseInt($("#bCnt").val());
	var c = parseInt($("#cCnt").val());
	var d = parseInt($("#dCnt").val());
	var e = parseInt($("#eCnt").val());
	var fc = parseInt($("#fCnt").val());
	
	
	var totCnt = a+b+c+d+e+fc;
	
	$("#totalCnt").text(" ("+totCnt+")");
	$("#Cnt1").text(" ("+a+")"); //검토요청중
	$("#Cnt2").text(" ("+c+")"); //검토중
	$("#Cnt3").text(" ("+b+")"); //접수중
	$("#Cnt4").text(" ("+d+")"); //완료
	$("#Cnt5").text(" ("+fc+")"); //반려
	$("#Cnt6").text(" ("+e+")"); //임시보관
	
});

function fn_tempWriteForm(){
	var f = document.form1;
	f.action = "<c:url value='/usr/member/suggestionTempWrite.do' />";
	f.submit();
}

function fn_suggestion(val){
	var f = document.form1;
	
	if(val == '0'){
		f.p_order_cate.value="A";
	}else if(val == '1'){
		f.p_order_cate.value="B";
	}else if(val == '2'){
		f.p_order_cate.value="C";
		
	}
	f.action = "<c:url value='/usr/member/suggestionNoti.do' />";
	f.submit();
}

function fn_goDetail(seq,flow){
	var f = document.form1;
	
	f.p_order_seq.value = seq;
	if(flow == 'E'){
		f.action = "<c:url value='/usr/member/suggestionUpdate.do' />";
	}else if(flow=='F'){
		f.action = "<c:url value='/usr/member/suggestionFailUpdate.do' />";
	}else{
		f.action = "<c:url value='/usr/member/suggestionDetail.do' />";
	}
	f.submit();
}

function fn_goOrderList(val){
	var f = document.form1;
	
	if(val != ''){
		f.p_order_flow.value = val;
	}else {
		f.p_order_flow.value = "";
	}
	f.action ="<c:url value='/usr/member/suggestionList.do' />";
	f.submit();
}
</script>
<body>
<form id="form1" name="form1" method="post" enctype="multipart/form-data">
<input type="hidden" name="p_order_seq" id="p_order_seq" value="">
<input type="hidden" name="p_order_flow" id="p_order_flow" value="${map.p_order_flow }"/> 
<c:choose>
    <c:when test="${fn:length(countList) > 0}">
        <c:forEach items="${countList }" var="row">
        	<c:if test="${row.ORDER_FLOW eq 'A' }">
	        	<input type="hidden" name="aCnt" id="aCnt" value="${row.FLOW_CNT }"/>
        	</c:if>
        	<c:if test="${row.ORDER_FLOW eq 'B' }">
	        	<input type="hidden" name="bCnt" id="bCnt" value="${row.FLOW_CNT }"/>
        	</c:if>
        	<c:if test="${row.ORDER_FLOW eq 'C' }">
	        	<input type="hidden" name="cCnt" id="cCnt" value="${row.FLOW_CNT }"/>
        	</c:if>
        	<c:if test="${row.ORDER_FLOW eq 'D' }">
	        	<input type="hidden" name="dCnt" id="dCnt" value="${row.FLOW_CNT }"/>
        	</c:if>
        	<c:if test="${row.ORDER_FLOW eq 'E' }">
	        	<input type="hidden" name="eCnt" id="eCnt" value="${row.FLOW_CNT }"/>
        	</c:if>
        	<c:if test="${row.ORDER_FLOW eq 'F' }">
	        	<input type="hidden" name="fCnt" id="fCnt" value="${row.FLOW_CNT }"/>
        	</c:if>
        </c:forEach>
    </c:when>
    <c:otherwise>
        <tr>
            <td colspan="4">조회된 결과가 없습니다.</td>
        </tr>
    </c:otherwise>
</c:choose>
<div style="float:left;border:solid 1px;height:100%;width: 200px;">
	<div style="padding-top:10px; padding-bottom:60px;">배너이미지</div>
	<div class="lnb_menu">
		<ul>
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
			<li><a href="javascript:void(0)" onclick="fn_goOrderList('')">모든상태<p id="totalCnt"></p></a></li>
			
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
			<li><a href="javascript:void(0)" onclick="fn_goOrderList('A')">검토요청중<p id="Cnt1"></p></a></li>
			
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
			<li><a href="javascript:void(0)" onclick="fn_goOrderList('C')">검토중<p id="Cnt2"></p></a></li>
			
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
			<li><a href="javascript:void(0)" onclick="fn_goOrderList('B')">접수중<p id="Cnt3"></p></a></li>
			
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
			<li><a href="javascript:void(0)" onclick="fn_goOrderList('D')">완료<p id="Cnt4"></p></a></li>
			
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
			<li><a href="javascript:void(0)" onclick="fn_goOrderList('F')">반려<p id="Cnt5"></p></a></li>
			
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
			<li><a href="javascript:void(0)" onclick="fn_goOrderList('E')">임시보관함<p id="Cnt6"></p></a></li>
			
			<table align="center" height="0" width="200" border="1" style="border:solid 1px ; margin-top:2%; "></table>
			
		</ul>
	</div>
</div>
<div>
	<div>
		<table width="1650" style="border:solid 1px;">
			<thead>
				<th>상태</th>
				<th>접수구분</th>
				<th>제품카테고리</th>
				<th>제품명</th>
				<th>작성자</th>
				<th>작성일</th>
			</thead>
			<tbody>
				<c:choose>
	                <c:when test="${fn:length(list) > 0}">
	                    <c:forEach items="${list }" var="row">
	                        <tr>
	                            <td>${row.ORDER_FLOW_NM }</td>
	                            <td>
	                            	<c:if test="${row.ORDER_CATE eq 'A' }">사전검토</c:if>
	                            	<c:if test="${row.ORDER_CATE eq 'B' }">NMPA 접수</c:if>
	                            	<c:if test="${row.ORDER_CATE eq 'C' }">사전검역서비스</c:if>
	                            </td>
	                            <td>${row.PRODUCT_CATE_NM }</td>
	                            <td class="title">
	                                <a href="javascript:void(0);" onclick="fn_goDetail('${row.ORDER_SEQ }','${row.ORDER_FLOW }')">${row.PRODUCT_NM }</a>
	                            </td>
	                            <td>홍길동</td>
	                            <td>${row.SDATE }</td>
	                        </tr>
	                    </c:forEach>
	                </c:when>
	                <c:otherwise>
	                    <tr>
	                        <td colspan="6">조회된 결과가 없습니다.</td>
	                    </tr>
	                </c:otherwise>
	            </c:choose>
			</tbody>
		</table>
	</div>
</div>

</form>
</body>
</html>