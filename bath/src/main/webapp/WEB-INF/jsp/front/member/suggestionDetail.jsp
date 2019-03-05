<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>제안시스템</title>
</head>
<script src="<c:url value='/resources/front/js/common.js'/>" charset="utf-8"></script>
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
function fn_goOrderList(val){
	var f = document.form1;
	
	if(val != ''){
		f.p_order_flow.value = val;
	}else{
		f.p_order_flow.value = '';
	}
	f.action ="<c:url value='/usr/member/suggestionList.do' />";
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
function fn_fileDownLoad(val){
	var comSubmit = new ComSubmit();
    comSubmit.addParam("p_file_seq", val);
    comSubmit.setUrl("<c:url value='/common/downloadFile.do' />");
    comSubmit.submit();
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

function fn_reviewRequest(){
	var f = document.form1;
	
	f.action ="<c:url value='/usr/member/suggestionReviewRequest.do' />";
	f.submit();
}
</script>
<body>
<form id="commonForm" name="commonForm"></form>
<form id="form1" name="form1" method="post" enctype="multipart/form-data">
<input type="hidden" name="p_order_seq" id="p_order_seq" value="${map.ORDER_SEQ }"/>
<input type="hidden" name="p_order_cate" id="p_order_cate" value="${map.ORDER_CATE }"/>
<input type="hidden" name="p_product_cate" id="p_product_cate" value="${map.PRODUCT_CATE }"/>
<input type="hidden" name="p_product_nm" id="p_product_nm" value="${map.PRODUCT_NM }"/>
<input type="hidden" name="p_order_flow" id="p_order_flow" value="${map.ORDER_FLOW }"/>
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
	<div style="float: left;width:1600px;">
		<h2>${map.ORDER_FLOW_NM }</h2>
		<h3>${map.PRODUCT_NM }</h3>
		<div>
			<c:if test="${map.ORDER_CATE eq 'A' }">사전검토</c:if>
            <c:if test="${map.ORDER_CATE eq 'B' }">NMPA 접수</c:if>
            <c:if test="${map.ORDER_CATE eq 'C' }">사전검역서비스</c:if>
		</div>
		<div>
			<h4>기본정보</h4>
			<table>
				<tbody>
					<tr>
						<th>회사이름</th>
						<td>${map.COMP_NM} </td>
					</tr>
					<tr>
						<th>주소</th>
						<td>${map.ADDR_KO} &nbsp; ${map.ADDR_KO2}</td>
					</tr>
					<tr>
						<th>이메일</th>
						<td>${map.EMAILING} </td>
					</tr>
					<tr>
						<th>FAX</th>
						<td>${map.FAX_NO} </td>
					</tr>
					<tr>
						<th>작성자</th>
						<td>홍길동 </td>
					</tr>
					<tr>
						<th>담당자 연락처</th>
						<td>${map.PHONE_NO} </td>
					</tr>
				</tbody>
			</table>
		</div>
		<div>
			<h4>제품정보</h4>
			<div>신청종류 &nbsp;&nbsp;&nbsp; : <c:if test="${map.ORDER_CATE eq 'A' }">사전검토</c:if><c:if test="${map.ORDER_CATE eq 'B' }">NMPA 접수</c:if><c:if test="${map.ORDER_CATE eq 'C' }">사전검역서비스</c:if> </div>
			<h5>제품이름</h5>
			<table>
				<tbody>
					<tr>
						<th>한글</th>
						<td>${map.PRODUCT_NM} </td>
					</tr>
					<tr>
						<th>영문</th>
						<td>${map.PRODUCT_NM_ENG}</td>
					</tr>
					<tr>
						<th>중문</th>
						<td>${map.PRODUCT_NM_CHN} </td>
					</tr>
				</tbody>
			</table>
			<div>제품 카테고리 &nbsp;&nbsp;&nbsp; ${map.PRODUCT_CATE_NM }</div>
		</div>
		<div>
			<table>
				<thead>
					<th>번호</th>
					<th>구분</th>
					<th>한글</th>
					<th>영문</th>
					<th>중문</th>
					<th>Lot. No.</th>
					<th>생산일</th>
					<th>유효기간(년)</th>
					<th>제품향</th>
				</thead>
				<tbody>
					<c:choose>
			            <c:when test="${fn:length(baseList) > 0}">
			                <c:forEach items="${baseList }" var="list" varStatus="i">
			                    <tr>
			                    	<th rowspan="2">${i.index+1 }</th>
			                    	<td>제품명</td>
			                    	<td>${list.PRODUCT_NM }</td>
			                    	<td>${list.PRODUCT_NM_ENG }</td>
			                    	<td>${list.PRODUCT_NM_CHN }</td>
			                    	<td>${list.PRODUCT_LOT }</td>
			                    	<td>${list.PRODUCT_SDATE }</td>
			                    	<td>${list.PRODUCT_EDATE }</td>
			                    	<td>${list.PRODUCT_SMELL }</td>
			                    </tr>
			                    <tr>
			                    	<td>브랜드명</td>
			                    	<td>${list.BRAND_NM }</td>
			                    	<td>${list.BRAND_NM_ENG }</td>
			                    	<td>${list.BRAND_NM_CHN }</td>
			                    	<td>${list.BRAND_LOT }</td>
			                    	<td>${list.BRAND_SDATE }</td>
			                    	<td>${list.BRAND_EDATE }</td>
			                    	<td>${list.BRAND_SMELL }</td>
			                    </tr>
			                </c:forEach>
			            </c:when>
			            <c:otherwise>
			                <tr>
			                    <td colspan="9">조회된 결과가 없습니다.</td>
			                </tr>
			            </c:otherwise>
			        </c:choose>
				</tbody>
			</table>
		</div>
		<div>
			제품 생산국 &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${map.PRODUCT_NATION }
		</div>
		<div>
			<table>
				<thead>
					<th>번호</th>
					<th>구분</th>
					<th>가공업체 이름</th>
					<th>가공업체 주소</th>
				</thead>
				<tbody>
					<c:choose>
			            <c:when test="${fn:length(makeList) > 0}">
			                <c:forEach items="${makeList }" var="list" varStatus="i">
			                    <tr>
			                    	<th rowspan='3'>${i.index+1 }</th>
			                    	<td>한글</td>
			                    	<td>${list.COMPANY_NM }</td>
			                    	<td>${list.COMPANY_ADDR }</td>
			                    </tr>
			                    <tr>
			                    	<td>영어</td>
			                    	<td>${list.COMPANY_NM_ENG }</td>
			                    	<td>${list.COMPANY_ADDR_ENG }</td>
			                    </tr>
			                    <tr>
			                    	<td>중국</td>
			                    	<td>${list.COMPANY_NM_CHN }</td>
			                    	<td>${list.COMPANY_ADDR_CHN }</td>
			                    </tr>
			                </c:forEach>
			            </c:when>
			            <c:otherwise>
			                <tr>
			                    <td colspan="4">조회된 결과가 없습니다.</td>
			                </tr>
			            </c:otherwise>
			        </c:choose>
				</tbody>
			</table>
		</div>
		<div>
			<c:choose>
	            <c:when test="${fn:length(fileList) > 0}">
	                <c:forEach items="${fileList }" var="list" varStatus="i">
	                	<c:if test="${i.index eq 0 }">
	                		전성분표 &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="javascript:void(0);" onclick="fn_fileDownLoad('${list.FILE_SEQ}');">${list.ORIGINAL_FILE_NM }</a></br>
	                	</c:if>
	                	<c:if test="${i.index eq 1 }">
	                		패키지  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="javascript:void(0);" onclick="fn_fileDownLoad('${list.FILE_SEQ}');">${list.ORIGINAL_FILE_NM }</a></br>
	                	</c:if>
	                </c:forEach>
	            </c:when>
	        </c:choose>
			
		</div>
		<div>
			<textarea rows="20" cols="200" name="p_pakage_text" id="p_pakage_text" readonly="readonly">${map.PAKAGE_TEXT }</textarea>
		</div>
		<div>
			<h3>이력</h3>
			<table stlye="border 1px;">
				<tbody>
					<c:choose>
			            <c:when test="${fn:length(historyList) > 0}">
			                <c:forEach items="${historyList }" var="list" varStatus="i">
			                    <tr>
			                    	<td>${list.SDATE }</td>
			                    	
			                    	<td>
			                    		<c:if test="${list.ORDER_CATE eq 'A' }">사전검토</c:if>
							            <c:if test="${list.ORDER_CATE eq 'B' }">NMPA 접수</c:if>
							            <c:if test="${list.ORDER_CATE eq 'C' }">사전검역서비스</c:if>
            						</td>
			                    	<td>${list.ORDER_FLOW_NM }</td>
			                    </tr>
			                </c:forEach>
			            </c:when>
			            <c:otherwise>
			                <tr>
			                    <td colspan="3">조회된 결과가 없습니다.</td>
			                </tr>
			            </c:otherwise>
			        </c:choose>
				</tbody>
			</table>
		</div>
		</br>
		</br>
		</br>
		</br>
		</br>
		<c:if test="${map.ORDER_FLOW eq 'E' }">
			<div style="display:inline-block;">
				<button value="<< 이전단계" onclick="fn_backContent();">이전단계</button>
				<button value="약관동의 후 카테고리 선택하기" onclick="fn_reviewRequest();">검토요청하기</button>
			</div>
		</c:if>
		</br>
		</br>
		</br>
	</div>
</div>
</form>
</body>
</html>