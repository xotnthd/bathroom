<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
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
function fn_suggestion(val){
	var f = document.form1;
	if(val == '0'){
		f.p_order_cate.value="A";
	}else if(val == '1'){
		f.p_order_cate.value="B";
	}else if(val == '2'){
		f.p_order_cate.value="C";
		
	}
	f.action ="<c:url value='/usr/member/suggestionNoti.do' />";
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
	f.action ="<c:url value='/usr/member/suggestionNoti.do' />";
	f.submit();
}
function fn_goOrderList(val){
	var f = document.form1;
	
	if(val != ''){
		f.p_order_flow.value = val;
	}
	f.action ="<c:url value='/usr/member/suggestionList.do' />";
	f.submit();
}
</script>
<body>
<form id="form1" name="form1" method="post" enctype="multipart/form-data">
<input type="hidden" name="p_order_cate" id="p_order_cate" value=""/>
<input type="hidden" name="p_order_flow" id="p_order_flow" value=""/>
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
</c:choose>
<div>
	<div style="float:left;border:solid 1px;height:100%;width: 200px; position: relative;">
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
	<div style="float: left;width:1600px;">
		<div style="width:85%;height:33%;border:solid 1px #050099;">
			<h3>사전검토</h3>
			<p>NMPA 승인 가능성 여부, 진행 기간등 제품 성분표를 바탕으로 1차 검토 진행 (NMPA 진행과정 중 변경 될 수 있습니다)</p>
			<div > 
				<input type="button" name="login" value="사전검토 접수하기" onclick="fn_suggestion('0');" style="height:50px; width:430px;  background-color:glay; color:glay; font-size:12px;">
				<br/>
				<a href="javascript:void(0);" onclick="fn_guied('0');">사전검토 접수 가이드 보기 ></a>
			</div>
		</div>
		<div style="width:85%;height: 33%;border:solid 1px #050099;">
			<h3>NMPA접수</h3>
			<p>NMPA란 특수식품, 화장품, 의약품, 의료기기등에 대한 관리감독의 책임을 지고 있는 중국 국가의약품관리총국</p>
			<p>(National Medical Products Administration)의 약어로 NMPA대상 제품에 대해서는 사전에 NMPA에 제품을 등록하고 인증</p>
			<p>을 취득해야 합니다</p>
			<div> 
				<input type="button" name="login" value="NMPA 접수하기" onclick="fn_suggestion('1');" style="height:50px; width:430px;  background-color:red; color:black; font-size:12px; border:solid 1px #050099; ">
				<br/>
				<a href="javascript:void(0);" onclick="fn_guied('1');">NMPA 접수 가이드 보기 ></a>
			</div>
		</div>
		<div style="width:85%;height: 33%;border:solid 1px #050099;">
			<h3>사전검역 서비스</h3>
			<p>CAIQTEST는 수입 상품이 중국세관통관 중 발생하는 불합격과 반송위험 을 대폭 감소시키는</p>
			<p>사전검역을 원스톱 서비스로 제공합니다.</p>
			<div>
				<input type="button" name="login" value="사전검역 접수하기" onclick="fn_suggestion('2');" style="height:50px; width:430px;  background-color:white; color:black; font-size:12px; border:solid 1px #050099; ">
				<br/>
				<a href="javascript:void(0);" onclick="fn_guied('2');">사전검역 접수 가이드 보기 ></a>
			</div>
		</div>
	</div>
</div>
</form>
</body>
</html>