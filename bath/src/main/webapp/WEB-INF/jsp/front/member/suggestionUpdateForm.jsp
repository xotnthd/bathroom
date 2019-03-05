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
<script src="<c:url value='/resources/front/js/common.js'/>" charset="utf-8"></script>
<script type="text/javascript">

function fn_tempWriteForm(){
	//validation Check Start
	if("" == $("#p_product_nm").val()){
		alert("상품명을 입력해주세요.");
		$("#p_product_nm").focus();
		fn_showNext();
		return false;
	}
	
	if("" == $("#p_product_nm_eng").val()){
		alert("상품명(영문)을 입력해주세요.");
		fn_showNext();
		$("#p_product_nm_eng").focus();
		return false;
	}
	
	if("" == $("#p_product_nation").val()){
		alert("생산지를 선택 해주세요.");
		$("#p_product_nation").focus();
		fn_showNext();
		return false;
	}
	
	if("" == $(':radio[name="t_line"]:checked').val()){
		alert("가공여부를 선택 해주세요.");
		fn_showNext();
		return false;
	}
	
	alert($("#file_0").val());
	if("" == $("#file_0").val()){
		alert("전성분표를 등록 해주세요.");
		fn_showNext();
		return false;
	}
	
	if("" == $("#file_1").val()){
		alert("패키지 디자인 파일을 등록 해주세요.");
		fn_showNext();
		return false;
	}
	
	if("" == $("#p_pakage_text").val()){
		alert("패키지 디자인 텍스트를 입력 해주세요.");
		fn_showNext();
		$("#p_pakage_text").focus();
		return false;
	}
	
	//vaildation Check End
	
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
	f.action ="<c:url value='/usr/member/suggestionNoti.do' />";
	f.submit();
}
$(document).ready(function(){
	
	var f = document.form1;
	
	var productCate = document.form1.p_product_cate.value;
	
	if("A" == productCate){
		f.p_product_cate_txt.value = "일반 화장품";
	}else if("B" == productCate){
		f.p_product_cate_txt.value = "보건식품";
	}else if("C" == productCate){
		f.p_product_cate_txt.value = "의료기기";
	}else if("D" == productCate){
		f.p_product_cate_txt.value = "영유아 조제분유";
	}else if("E" == productCate){
		f.p_product_cate_txt.value = "의학품";
	}else if("F" == productCate){
		f.p_product_cate_txt.value = "특수의학용조제식품";
	}else if("G" == productCate){
		f.p_product_cate_txt.value = "특수 화장품";
	}
	
	$('#file_0').change(function(){
	    var file = this.files[0];
	    name = file.name;
	    size = file.size;
	    type = file.type;
	    
	    //your validation
	    var fileExtension = ['xls', 'xlsx'];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            alert("xls, xlsx 형식의 파일만 업로드 가능합니다.");
            this.value = '';
            return;
        }
        
        $("#p_file0_new").val("Y");
	    $("#file_zero").text("");
	    
	});
	
	$('#file_1').change(function(){
	    var file = this.files[0];
	    name = file.name;
	    size = file.size;
	    type = file.type;
	    
	    //your validation
	    var fileExtension = ['pdf', 'PDF'];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            alert("pdf, PDF 형식의 파일만 업로드 가능합니다.");
            this.value = '';
            return;
        }
	    
	    $("#p_file1_new").val("Y");
	    $("#file_one").text("");
	});
});
function fn_showNext(){
	
	//validation Start
	if("" == $("#p_comp_nm").val()){
		alert("회사명을 입력해주세요.");
		$("#p_comp_nm").focus();
		return;
	}
	
	if("" == $("#p_comp_nm_eng").val()){
		alert("회사명(영문)을 입력 해주세요.");
		$("#p_comp_nm_eng").focus();
		return;
	}
	
	if("" == $("#p_emailing").val()){
		alert("이메일을 입력 해주세요.");
		$("#p_emailing").focus();
		return;
	}

	if("" == $("#p_phone_no").val()){
		alert("전화번호를 입력 해주세요.");
		$("#p_phone_no").focus();
		return;
	}
	
	if("" == $("#p_addr_ko").val()){
		alert("주소를 입력 해주세요.");
		$("#p_addr_ko").focus();
		return;
	}
	
	if("" == $("#p_addr_ko2").val()){
		alert("상세주소를 입력 해주세요.");
		$("#p_addr_ko2").focus();
		return;
	}
	
	if("" == $("#p_addr_eng").val()){
		alert("주소(영문)을 입력 해주세요.");
		$("#p_addr_eng").focus();
		return;
	}
	
	if("" == $("#p_addr_eng2").val()){
		alert("상세주소(영어)를 입력 해주세요.");
		$("#p_addr_eng2").focus();
		return;
	}
	//validation End
	
	
	$("#inputVal1").hide();
	$("#inputVal2").show();
	
}

function fn_backContent(){
	$("#inputVal1").show();
	$("#inputVal2").hide();
}

function fn_fileDownLoad(val){
	var comSubmit = new ComSubmit();
    comSubmit.addParam("p_file_seq", val);
    comSubmit.setUrl("<c:url value='/common/downloadFile.do' />");
    comSubmit.submit();
}

var idx = 1;
function fn_tableAdd(){
	
	
	if(0 == parseInt($("#tbody1 tr").length)){
		idx = parseInt($("#tbody1 tr").length) +1;
	}else{
		idx = ((parseInt($("#tbody1 tr").length)+2)/2)
	}
	
	var html = "";
	html += "<tr>";
	html += "	<th rowspan='2'>"+idx +"</th>";
	html += "	<td>제품명</td>";
	html += "	<td><input type='text' name='p_base_product_nm' value=''/></td>";
	html += "	<td><input type='text' name='p_base_product_nm_eng' value=''/></td>";
	html += "	<td><input type='text' name='p_base_product_nm_chn' value=''/></td>";
	html += "	<td><input type='text' name='p_base_product_lot' value=''/></td>";
	html += "	<td><input type='text' name='p_base_product_sdate' value=''/></td>";
	html += "	<td><input type='text' name='p_base_product_edate' value=''/></td>";
	html += "	<td><input type='text' name='p_base_product_smell' value=''/></td>";
	html += "</tr>";
	html += "<tr>";
	html += "	<td>브랜드명</td>";
	html += "	<td><input type='text' name='p_base_brand_nm' value=''/></td>";
	html += "	<td><input type='text' name='p_base_brand_nm_eng' value=''/></td>";
	html += "	<td><input type='text' name='p_base_brand_nm_chn' value=''/></td>";
	html += "	<td><input type='text' name='p_base_brand_lot' value=''/></td>";
	html += "	<td><input type='text' name='p_base_brand_sdate' value=''/></td>";
	html += "	<td><input type='text' name='p_base_brand_edate' value=''/></td>";
	html += "	<td><input type='text' name='p_base_brand_smell' value=''/></td>";
	html += "</tr>";
	html += "<input type='hidden' name='p_base_seq' value='"+idx+"'/>  ";
	
	$("#tbody1").append(html);
}

var idx=1;
function fn_tableAdd1(){
	
	if(0 == parseInt($("#tbody2 tr").length)){
		idx = parseInt($("#tbody2 tr").length) +1;
	}else{
		idx = ((parseInt($("#tbody2 tr").length)+3)/3)
	}
	
	var html1 = "";
	html1 += "<tr>";
	html1 += "	<th rowspan='3'>"+idx+"</th>";
	html1 += "<td>한글</td>";
	html1 += "	<td><input type='text' name='p_company_nm' value=''/></td>";
	html1 += "	<td><input type='text' name='p_company_addr' value=''/></td>";
	html1 += "</tr>";
	html1 += "<tr>";
	html1 += "	<td>영어</td>";
	html1 += "	<td><input type='text' name='p_company_nm_eng' value=''/></td>";
	html1 += "	<td><input type='text' name='p_company_addr_eng' value=''/></td>";
	html1 += "</tr>";
	html1 += "<tr>";
	html1 += "	<td>중국</td>";
	html1 += "	<td><input type='text' name='p_company_nm_chn' value=''/></td>";
	html1 += "	<td><input type='text' name='p_company_addr_chn' value=''/></td>";
	html1 += "</tr>";
	html1 += "<input type='hidden' name='p_makeinfo_seq' value='"+idx+"'/>  ";
	
	$("#tbody2").append(html1);
}

function fn_tableMin(){
	var trSize = parseInt($("#tbody1 tr").length);
	if(trSize > 0){
		$("#tbody1 tr").last().remove();
		$("#tbody1 tr").last().remove();
	}
	/* idx = parseInt($("#tbody1 tr").length); */
}

function fn_tableMin1(){
	var trSize = parseInt($("#tbody2 tr").length);
	if(trSize > 0){
		$("#tbody2 tr").last().remove();
		$("#tbody2 tr").last().remove();
		$("#tbody2 tr").last().remove();
	}
	/* idx = parseInt($("#tbody1 tr").length); */
}


function fn_tempUpdateForm(){
	var f = document.form1;
	f.action = "<c:url value='/usr/member/suggestionTempUpdate.do' />";
	f.submit();
}

function fn_cateSel(){
	var f = document.form1;
	f.action = "<c:url value='/usr/member/suggestion.do' />";
	f.submit();
}


</script>
<body>
<form id="commonForm" name="commonForm"></form>
<form id="form1" name="form1" method="post" enctype="multipart/form-data">
<input type="hidden" name="p_order_seq" id="p_order_seq" value="${map.ORDER_SEQ }"/>
<input type="hidden" name="p_order_cate" id="p_order_cate" value="${map.ORDER_CATE }"/>
<input type="hidden" name="p_order_flow" id="p_order_flow" value="${map.ORDER_FLOW }"/>
<input type="hidden" name="p_file0_new" id="p_file0_new" value="N"/>
<input type="hidden" name="p_file1_new" id="p_file1_new" value="N"/>

<div>
	<c:choose>
		<c:when test="${map.ORDER_CATE eq 'A'}">
			<h2>사전검토 접수</h2>
		</c:when>
		<c:when test="${map.ORDER_CATE eq 'B'}">
			<h2>NMPA 접수</h2>
		</c:when>
		<c:otherwise>
			<h2>사전검역 서비스</h2>
		</c:otherwise>
	</c:choose>
	<div id="inputVal1">
		<h3>1. 기업정보</h3>
		<div>
			1-1 제품소유기업명(브랜드명)<br><br>
			한글명 : <input type="text" name="p_comp_nm" id="p_comp_nm" value="${map.COMP_NM }"/></br>
			영문명 : <input type="text" name="p_comp_nm_eng" id="p_comp_nm_eng" value="${map.COMP_NM_ENG }"/></br>
			중문명 : <input type="text" name="p_comp_nm_chn" id="p_comp_nm_chn" value="${map.COMP_NM_CHN }"/>
			
		</div>
		<div>
			1-2 연락처</br>
			* 이메일(필수) <input type="text" name="p_emailing" id="p_emailing" value="${map.EMAILING }"/></br>
			* 전화번호(필수) <input type="text" name="p_phone_no" id="p_phone_no" value="${map.PHONE_NO }"/></br>
			  FAX  <input type="text" name="p_fax_no" id="p_fax_no" value="${map.FAX_NO }"/>
		</div>
		<div>
			1-3 주소</br>
			* 한글주소(필수) 	<input type="text" name="p_addr_ko" id="p_addr_ko" value="${map.ADDR_KO }"/><input type="text" name="p_addr_ko2" id="p_addr_ko2" value="${map.ADDR_KO2 }"/></br>
			* 영문주소(필수) 	<input type="text" name="p_addr_eng" id="p_addr_eng" value="${map.ADDR_ENG }"/><input type="text" name="p_addr_eng2" id="p_addr_eng2" value="${map.ADDR_ENG2 }"/></br>
			    중문주소  		<input type="text" name="p_addr_chn" id="p_addr_chn" value="${map.ADDR_CHN }"/><input type="text" name="p_addr_chn2" id="p_addr_chn2" value="${map.ADDR_CHN2 }"/>
		</div>
		<a href="javascript:void(0)" onclick="fn_cateSel()">카테고리 선택으로 돌아가기</a>
		<input type="button" onclick="fn_showNext();" value="다음 (제품정보)"></input>
	</div>
	<div id="inputVal2" style="display:none;">
		<h3>2. 제품정보</h3>
		<div>
			2-1. 제품 카테고리 <input type="text" name="p_product_cate_txt" id="p_product_cate_txt"  value="${map.PRODUCT_CATE_NM }"/>
			<input type="hidden" name="p_product_cate" id="p_product_cate" value="${map.PRODUCT_CATE }">
		</div>
		</br>
		<div>
			2-2. 제품 이름</br>
			* 한글명(필수) <input type="text" name="p_product_nm" id="p_product_nm" value="${map.PRODUCT_NM }"/></br>
			* 영문명(필수) <input type="text" name="p_product_nm_eng" id="p_product_nm_eng" value="${map.PRODUCT_NM_ENG }"/></br>
			  중문명  		<input type="text" name="p_product_nm_chn" id="p_product_nm_chn" value="${map.PRODUCT_NM_CHN }"/>
		</div>
		</br>
		<div style="border:solid 1px;"> 
			2-3 제품 기초자료
			<input type="button" value="자료삭제" onclick="fn_tableMin()"/><input type="button" value="자료추가" onclick="fn_tableAdd()"/>
			<table>
				<thead>
					<th>번호</th>
					<th>구분</th>
					<th>한글</th>
					<th>영문</th>
					<th>중문</th>
					<th>Lot. No.</th>
					<th>생산일</th>
					<th>유효기간</br>(년)</th>
					<th>제품향</th>
				</thead>
				<tbody id="tbody1">
					<c:choose>
			            <c:when test="${fn:length(baseList) > 0}">
			                <c:forEach items="${baseList }" var="list" varStatus="i">
			                    <tr>
			                    	<th rowspan="2">${i.index+1 }</th>
			                    	<td>제품명</td>
			                    	<td><input type='text' name='p_base_product_nm' value='${list.PRODUCT_NM }'/></td>
			                    	<td><input type='text' name='p_base_product_nm_eng' value='${list.PRODUCT_NM_ENG }'/></td>
			                    	<td><input type='text' name='p_base_product_nm_chn' value='${list.PRODUCT_NM_CHN }'/></td>
			                    	<td><input type='text' name='p_base_product_lot' value='${list.PRODUCT_LOT }'/></td>
			                    	<td><input type='text' name='p_base_product_sdate' value='${list.PRODUCT_SDATE }'/></td>
			                    	<td><input type='text' name='p_base_product_edate' value='${list.PRODUCT_EDATE }'/></td>
			                    	<td><input type='text' name='p_base_product_smell' value='${list.PRODUCT_SMELL }'/></td>
			                    </tr>
			                    <tr>
			                    	<td>브랜드명</td>
			                    	<td><input type='text' name='p_base_brand_nm' value='${list.BRAND_NM }'/></td>
			                    	<td><input type='text' name='p_base_brand_nm_eng' value='${list.BRAND_NM_ENG }'/></td>
			                    	<td><input type='text' name='p_base_brand_nm_chn' value='${list.BRAND_NM_CHN }'/></td>
			                    	<td><input type='text' name='p_base_brand_lot' value='${list.BRAND_LOT }'/></td>
			                    	<td><input type='text' name='p_base_brand_sdate' value='${list.BRAND_SDATE }'/></td>
			                    	<td><input type='text' name='p_base_brand_edate' value='${list.BRAND_EDATE }'/></td>
			                    	<td><input type='text' name='p_base_brand_smell' value='${list.BRAND_SMELL }'/></td>
			                    	<input type='hidden' name='p_base_seq' value='${i.index+1 }'/>
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
		</br>
		<div>
			2-4. 제품 생산정보 </br>
			제품 생산국 : 
			<select name="p_product_nation">
				<option value="">국가선택</option>
				<option <c:if test="${map.PRODUCT_NATION eq '가나(GHANA)' }">selected="selected"</c:if> value="가나(GHANA)">가나(GHANA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '가봉(GABONG)' }">selected="selected"</c:if> value="가봉(GABONG)">가봉(GABONG)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '가나(GHANA)' }">selected="selected"</c:if> value="가나(GHANA)">가나(GHANA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '가이아나(GUYANA)' }">selected="selected"</c:if> value="가이아나(GUYANA)">가이아나(GUYANA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '가나(GHANA)' }">selected="selected"</c:if> value="가나(GHANA)">감비아(GAMBIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '가나(GHANA)' }">selected="selected"</c:if> value="가나(GHANA)">건지 섬(GUERNSEY)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '과들루프(GUADELOUPE)' }">selected="selected"</c:if> value="과들루프(GUADELOUPE)">과들루프(GUADELOUPE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '과테말라(GUATEMALA)' }">selected="selected"</c:if> value="과테말라(GUATEMALA)">과테말라(GUATEMALA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '괌(GUAM)' }">selected="selected"</c:if> value="괌(GUAM)">괌(GUAM)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '그레나다(GRENADA)' }">selected="selected"</c:if> value="그레나다(GRENADA)">그레나다(GRENADA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '그리스(GREECE)' }">selected="selected"</c:if> value="그리스(GREECE)">그리스(GREECE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '그린란드(GREENLAND)' }">selected="selected"</c:if> value="그린란드(GREENLAND)">그린란드(GREENLAND)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '기니(GUINEA)' }">selected="selected"</c:if> value="기니(GUINEA)">기니(GUINEA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '기니비사우(GUINEA-BISSAU)' }">selected="selected"</c:if> value="기니비사우(GUINEA-BISSAU)">기니비사우(GUINEA-BISSAU)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '나미비아(NAMIBIA)' }">selected="selected"</c:if> value="나미비아(NAMIBIA)">나미비아(NAMIBIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '나우루(NAURU)' }">selected="selected"</c:if> value="나우루(NAURU)">나우루(NAURU)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '나이지리아(NIGERIA)' }">selected="selected"</c:if> value="나이지리아(NIGERIA)">나이지리아(NIGERIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '남극(ANTARCTICA)' }">selected="selected"</c:if> value="남극(ANTARCTICA)">남극(ANTARCTICA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '남수단(REPUBLIC OF SOUTH SUDAN)' }">selected="selected"</c:if> value="남수단(REPUBLIC OF SOUTH SUDAN)">남수단(REPUBLIC OF SOUTH SUDAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '남아프리카 공화국(SOUTH AFRICA)' }">selected="selected"</c:if> value="남아프리카 공화국(SOUTH AFRICA)">남아프리카 공화국(SOUTH AFRICA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '네덜란드(NETHERLANDS)' }">selected="selected"</c:if> value="네덜란드(NETHERLANDS)">네덜란드(NETHERLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '네덜란드령 안틸레스(NETHERLANDS ANTILLES)' }">selected="selected"</c:if> value="네덜란드령 안틸레스(NETHERLANDS ANTILLES)">네덜란드령 안틸레스(NETHERLANDS ANTILLES)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '네팔(NEPAL)' }">selected="selected"</c:if> value="네팔(NEPAL)">네팔(NEPAL)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '노르웨이(NORWAY)' }">selected="selected"</c:if> value="노르웨이(NORWAY)">노르웨이(NORWAY)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '노퍽 섬(NORFOLK ISLAND)' }">selected="selected"</c:if> value="노퍽 섬(NORFOLK ISLAND)">노퍽 섬(NORFOLK ISLAND)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '누벨칼레도니(NEW CALEDONIA)' }">selected="selected"</c:if> value="누벨칼레도니(NEW CALEDONIA)">누벨칼레도니(NEW CALEDONIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '뉴질랜드(NEW ZEALAND)' }">selected="selected"</c:if> value="뉴질랜드(NEW ZEALAND)">뉴질랜드(NEW ZEALAND)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '니우에(NIUE)' }">selected="selected"</c:if> value="니우에(NIUE)">니우에(NIUE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '니제르(NIGER)' }">selected="selected"</c:if> value="니제르(NIGER)">니제르(NIGER)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '니카라과(NICARAGUA)' }">selected="selected"</c:if> value="니카라과(NICARAGUA)">니카라과(NICARAGUA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '대한민국(KOREA, REPUBLIC OF)' }">selected="selected"</c:if> value="대한민국(KOREA, REPUBLIC OF)">대한민국(KOREA, REPUBLIC OF)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '덴마크(DENMARK)' }">selected="selected"</c:if> value="덴마크(DENMARK)">덴마크(DENMARK)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '도미니카 공화국(DOMINICAN REPUBLIC)' }">selected="selected"</c:if> value="도미니카 공화국(DOMINICAN REPUBLIC)">도미니카 공화국(DOMINICAN REPUBLIC)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '도미니카 연방(DOMINICA)' }">selected="selected"</c:if> value="도미니카 연방(DOMINICA)">도미니카 연방(DOMINICA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '독일(GERMANY)' }">selected="selected"</c:if> value="독일(GERMANY)">독일(GERMANY)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '동티모르(EAST TIMOR)' }">selected="selected"</c:if> value="동티모르(EAST TIMOR)">동티모르(EAST TIMOR)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '라오스(LAO PEOPLES DEMOCRATIC REPUBLIC)' }">selected="selected"</c:if> value="라오스(LAO PEOPLES DEMOCRATIC REPUBLIC)">라오스(LAO PEOPLE'S DEMOCRATIC REPUBLIC)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '라이베리아(LIBERIA)' }">selected="selected"</c:if> value="라이베리아(LIBERIA)">라이베리아(LIBERIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '라트비아(LATVIA)' }">selected="selected"</c:if> value="라트비아(LATVIA)">라트비아(LATVIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '러시아(RUSSIAN FEDERATION)' }">selected="selected"</c:if> value="러시아(RUSSIAN FEDERATION)">러시아(RUSSIAN FEDERATION)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '레바논(LEBANON)' }">selected="selected"</c:if> value="레바논(LEBANON)">레바논(LEBANON)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '레소토(LESOTHO)' }">selected="selected"</c:if> value="레소토(LESOTHO)">레소토(LESOTHO)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '레위니옹(REUNION)' }">selected="selected"</c:if> value="레위니옹(REUNION)">레위니옹(REUNION)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '루마니아(ROMANIA)' }">selected="selected"</c:if> value="루마니아(ROMANIA)">루마니아(ROMANIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '룩셈부르크(LUXEMBOURG)' }">selected="selected"</c:if> value="룩셈부르크(LUXEMBOURG)">룩셈부르크(LUXEMBOURG)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '르완다(RWANDA)' }">selected="selected"</c:if> value="르완다(RWANDA)">르완다(RWANDA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '리비아(LIBYAN ARAB JAMAHIRIYA)' }">selected="selected"</c:if> value="리비아(LIBYAN ARAB JAMAHIRIYA)">리비아(LIBYAN ARAB JAMAHIRIYA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '리투아니아(LITHUANIA)' }">selected="selected"</c:if> value="리투아니아(LITHUANIA)">리투아니아(LITHUANIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '리히텐슈타인(LIECHTENSTEIN)' }">selected="selected"</c:if> value="리히텐슈타인(LIECHTENSTEIN)">리히텐슈타인(LIECHTENSTEIN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '마다가스카르(MADAGASCAR)' }">selected="selected"</c:if> value="마다가스카르(MADAGASCAR)">마다가스카르(MADAGASCAR)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '마르티니크(MARTINIQUE)' }">selected="selected"</c:if> value="마르티니크(MARTINIQUE)">마르티니크(MARTINIQUE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '마셜 제도(MARSHALL ISLANDS)' }">selected="selected"</c:if> value="마셜 제도(MARSHALL ISLANDS)">마셜 제도(MARSHALL ISLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '마요트(MAYOTTE)' }">selected="selected"</c:if> value="마요트(MAYOTTE)">마요트(MAYOTTE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '마카오(MACAU)' }">selected="selected"</c:if> value="마카오(MACAU)">마카오(MACAU)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '마케도니아 공화국(REPUBLIC OF MACEDONIA)' }">selected="selected"</c:if> value="마케도니아 공화국(REPUBLIC OF MACEDONIA)">마케도니아 공화국(REPUBLIC OF MACEDONIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '말라위(MALAWI)' }">selected="selected"</c:if> value="말라위(MALAWI)">말라위(MALAWI)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '말레이시아(MALAYSIA)' }">selected="selected"</c:if> value="말레이시아(MALAYSIA)">말레이시아(MALAYSIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '말리(MALI)' }">selected="selected"</c:if> value="말리(MALI)">말리(MALI)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '맨 섬(ISLE OF MAN)' }">selected="selected"</c:if> value="맨 섬(ISLE OF MAN)">맨 섬(ISLE OF MAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '멕시코(MEXICO)' }">selected="selected"</c:if> value="멕시코(MEXICO)">멕시코(MEXICO)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '모나코(MONACO)' }">selected="selected"</c:if> value="모나코(MONACO)">모나코(MONACO)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '모로코(MOROCCO)' }">selected="selected"</c:if> value="모로코(MOROCCO)">모로코(MOROCCO)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '모리셔스(MAURITIUS)' }">selected="selected"</c:if> value="모리셔스(MAURITIUS)">모리셔스(MAURITIUS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '모리타니(MAURITANIA)' }">selected="selected"</c:if> value="모리타니(MAURITANIA)">모리타니(MAURITANIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '모잠비크(MOZAMBIQUE)' }">selected="selected"</c:if> value="모잠비크(MOZAMBIQUE)">모잠비크(MOZAMBIQUE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '몬테네그로(MONTENEGRO)' }">selected="selected"</c:if> value="몬테네그로(MONTENEGRO)">몬테네그로(MONTENEGRO)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '몬트세랫(MONTSERRAT)' }">selected="selected"</c:if> value="몬트세랫(MONTSERRAT)">몬트세랫(MONTSERRAT)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '몰도바(MOLDOVA, REPUBLIC OF)' }">selected="selected"</c:if> value="몰도바(MOLDOVA, REPUBLIC OF)">몰도바(MOLDOVA, REPUBLIC OF)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '몰디브(MALDIVES)' }">selected="selected"</c:if> value="몰디브(MALDIVES)">몰디브(MALDIVES)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '몰타(MALTA)' }">selected="selected"</c:if> value="몰타(MALTA)">몰타(MALTA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '몽골(MONGOLIA)' }">selected="selected"</c:if> value="몽골(MONGOLIA)">몽골(MONGOLIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '미국(UNITED STATES)' }">selected="selected"</c:if> value="미국(UNITED STATES)">미국(UNITED STATES)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '미국령 군소 제도(UNITED STATES MINOR OUTLYING ISLANDS)' }">selected="selected"</c:if> value="미국령 군소 제도(UNITED STATES MINOR OUTLYING ISLANDS)">미국령 군소 제도(UNITED STATES MINOR OUTLYING ISLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '미국령 버진아일랜드(VIRGIN ISLANDS, U.S.)' }">selected="selected"</c:if> value="미국령 버진아일랜드(VIRGIN ISLANDS, U.S.)">미국령 버진아일랜드(VIRGIN ISLANDS, U.S.)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '미얀마(MYANMAR)' }">selected="selected"</c:if> value="미얀마(MYANMAR)">미얀마(MYANMAR)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '미크로네시아 연방(MICRONESIA)' }">selected="selected"</c:if> value="미크로네시아 연방(MICRONESIA)">미크로네시아 연방(MICRONESIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '바누아투(VANUATU)' }">selected="selected"</c:if> value="바누아투(VANUATU)">바누아투(VANUATU)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '바레인(BAHRAIN)' }">selected="selected"</c:if> value="바레인(BAHRAIN)">바레인(BAHRAIN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '바베이도스(BARBADOS)' }">selected="selected"</c:if> value="바베이도스(BARBADOS)">바베이도스(BARBADOS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '바티칸 시국(VATICAN CITY STATE)' }">selected="selected"</c:if> value="바티칸 시국(VATICAN CITY STATE)">바티칸 시국(VATICAN CITY STATE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '바하마(BAHAMAS)' }">selected="selected"</c:if> value="바하마(BAHAMAS)">바하마(BAHAMAS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '방글라데시(BANGLADESH)' }">selected="selected"</c:if> value="방글라데시(BANGLADESH)">방글라데시(BANGLADESH)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '버뮤다(BERMUDA)' }">selected="selected"</c:if> value="버뮤다(BERMUDA)">버뮤다(BERMUDA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '베냉(BENIN)' }">selected="selected"</c:if> value="베냉(BENIN)">베냉(BENIN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '베네수엘라(VENEZUELA)' }">selected="selected"</c:if> value="베네수엘라(VENEZUELA)">베네수엘라(VENEZUELA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '베트남(VIET NAM)' }">selected="selected"</c:if> value="베트남(VIET NAM)">베트남(VIET NAM)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '벨기에(BELGIUM)' }">selected="selected"</c:if> value="벨기에(BELGIUM)">벨기에(BELGIUM)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '벨라루스(BELARUS)' }">selected="selected"</c:if> value="벨라루스(BELARUS)">벨라루스(BELARUS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '벨리즈(BELIZE)' }">selected="selected"</c:if> value="벨리즈(BELIZE)">벨리즈(BELIZE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '보스니아 헤르체고비나(BOSNIA HERCEGOVINA)' }">selected="selected"</c:if> value="보스니아 헤르체고비나(BOSNIA HERCEGOVINA)">보스니아 헤르체고비나(BOSNIA HERCEGOVINA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '보츠와나(BOTSWANA)' }">selected="selected"</c:if> value="보츠와나(BOTSWANA)">보츠와나(BOTSWANA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '볼리비아(BOLIVIA)' }">selected="selected"</c:if> value="볼리비아(BOLIVIA)">볼리비아(BOLIVIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '부룬디(BURUNDI)' }">selected="selected"</c:if> value="부룬디(BURUNDI)">부룬디(BURUNDI)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '부르키나파소(BURKINA FASO)' }">selected="selected"</c:if> value="부르키나파소(BURKINA FASO)">부르키나파소(BURKINA FASO)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '부베 섬(BOUVET ISLAND)' }">selected="selected"</c:if> value="부베 섬(BOUVET ISLAND)">부베 섬(BOUVET ISLAND)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '부탄(BHUTAN)' }">selected="selected"</c:if> value="부탄(BHUTAN)">부탄(BHUTAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '북마리아나 제도(NORTHERN MARIANA ISLANDS)' }">selected="selected"</c:if> value="북마리아나 제도(NORTHERN MARIANA ISLANDS)">북마리아나 제도(NORTHERN MARIANA ISLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '불가리아(BULGARIA)' }">selected="selected"</c:if> value="불가리아(BULGARIA)">불가리아(BULGARIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '브라질(BRAZIL)' }">selected="selected"</c:if> value="브라질(BRAZIL)">브라질(BRAZIL)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '브루나이(BRUNEI DARUSSALAM)' }">selected="selected"</c:if> value="브루나이(BRUNEI DARUSSALAM)">브루나이(BRUNEI DARUSSALAM)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '사모아(SAMOA)' }">selected="selected"</c:if> value="사모아(SAMOA)">사모아(SAMOA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '사우디아라비아(SAUDI ARABIA)' }">selected="selected"</c:if> value="사우디아라비아(SAUDI ARABIA)">사우디아라비아(SAUDI ARABIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '사우스조지아 사우스샌드위치 제도(SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS)' }">selected="selected"</c:if> value="사우스조지아 사우스샌드위치 제도(SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS)">사우스조지아 사우스샌드위치 제도(SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '산마리노(SAN MARINO)' }">selected="selected"</c:if> value="산마리노(SAN MARINO)">산마리노(SAN MARINO)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '상투메 프린시페(SAO TOME AND PRINCIPE)' }">selected="selected"</c:if> value="상투메 프린시페(SAO TOME AND PRINCIPE)">상투메 프린시페(SAO TOME AND PRINCIPE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '생피에르 미클롱(ST. PIERRE AND MIQUELON)' }">selected="selected"</c:if> value="생피에르 미클롱(ST. PIERRE AND MIQUELON)">생피에르 미클롱(ST. PIERRE AND MIQUELON)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '서사하라(WESTERN SAHARA)' }">selected="selected"</c:if> value="서사하라(WESTERN SAHARA)">서사하라(WESTERN SAHARA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '세네갈(SENEGAL)' }">selected="selected"</c:if> value="세네갈(SENEGAL)">세네갈(SENEGAL)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '세르비아(SERBIA)' }">selected="selected"</c:if> value="세르비아(SERBIA)">세르비아(SERBIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '세이셸(SEYCHELLES)' }">selected="selected"</c:if> value="세이셸(SEYCHELLES)">세이셸(SEYCHELLES)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '세인트루시아(SAINT LUCIA)' }">selected="selected"</c:if> value="세인트루시아(SAINT LUCIA)">세인트루시아(SAINT LUCIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '세인트빈센트 그레나딘(SAINT VINCENT AND THE GRENADINES)' }">selected="selected"</c:if> value="세인트빈센트 그레나딘(SAINT VINCENT AND THE GRENADINES)">세인트빈센트 그레나딘(SAINT VINCENT AND THE GRENADINES)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '세인트키츠 네비스(SAINT KITTS AND NEVIS)' }">selected="selected"</c:if> value="세인트키츠 네비스(SAINT KITTS AND NEVIS)">세인트키츠 네비스(SAINT KITTS AND NEVIS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '세인트헬레나(ST. HELENA)' }">selected="selected"</c:if> value="세인트헬레나(ST. HELENA)">세인트헬레나(ST. HELENA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '소말리아(SOMALIA)' }">selected="selected"</c:if> value="소말리아(SOMALIA)">소말리아(SOMALIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '솔로몬 제도(SOLOMON ISLANDS)' }">selected="selected"</c:if> value="솔로몬 제도(SOLOMON ISLANDS)">솔로몬 제도(SOLOMON ISLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '수단(SUDAN)' }">selected="selected"</c:if> value="수단(SUDAN)">수단(SUDAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '수리남(SURINAME)' }">selected="selected"</c:if> value="수리남(SURINAME)">수리남(SURINAME)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '스리랑카(SRI LANKA)' }">selected="selected"</c:if> value="스리랑카(SRI LANKA)">스리랑카(SRI LANKA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '스발바르 얀마옌(SVALBARD AND JAN MAYEN ISLANDS)' }">selected="selected"</c:if> value="스발바르 얀마옌(SVALBARD AND JAN MAYEN ISLANDS)">스발바르 얀마옌(SVALBARD AND JAN MAYEN ISLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '스와질란드(SWAZILAND)' }">selected="selected"</c:if> value="스와질란드(SWAZILAND)">스와질란드(SWAZILAND)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '스웨덴(SWEDEN)' }">selected="selected"</c:if> value="스웨덴(SWEDEN)">스웨덴(SWEDEN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '스위스(SWITZERLAND)' }">selected="selected"</c:if> value="스위스(SWITZERLAND)">스위스(SWITZERLAND)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '스페인(SPAIN)' }">selected="selected"</c:if> value="스페인(SPAIN)">스페인(SPAIN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '슬로바키아(SLOVAKIA)' }">selected="selected"</c:if> value="슬로바키아(SLOVAKIA)">슬로바키아(SLOVAKIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '슬로베니아(SLOVENIA)' }">selected="selected"</c:if> value="슬로베니아(SLOVENIA)">슬로베니아(SLOVENIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '시리아(SYRIAN ARAB REPUBLIC)' }">selected="selected"</c:if> value="시리아(SYRIAN ARAB REPUBLIC)">시리아(SYRIAN ARAB REPUBLIC)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '시에라리온(SIERRA LEONE)' }">selected="selected"</c:if> value="시에라리온(SIERRA LEONE)">시에라리온(SIERRA LEONE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '싱가포르(SINGAPORE)' }">selected="selected"</c:if> value="싱가포르(SINGAPORE)">싱가포르(SINGAPORE)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아랍에미리트(UNITED ARAB EMIRATES)' }">selected="selected"</c:if> value="아랍에미리트(UNITED ARAB EMIRATES)">아랍에미리트(UNITED ARAB EMIRATES)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아루바(ARUBA)' }">selected="selected"</c:if> value="아루바(ARUBA)">아루바(ARUBA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아르메니아(ARMENIA)' }">selected="selected"</c:if> value="아르메니아(ARMENIA)">아르메니아(ARMENIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아르헨티나(ARGENTINA)' }">selected="selected"</c:if> value="아르헨티나(ARGENTINA)">아르헨티나(ARGENTINA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아메리칸사모아(AMERICAN SAMOA)' }">selected="selected"</c:if> value="아메리칸사모아(AMERICAN SAMOA)">아메리칸사모아(AMERICAN SAMOA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아이슬란드(ICELAND)' }">selected="selected"</c:if> value="아이슬란드(ICELAND)">아이슬란드(ICELAND)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아이티(HAITI)' }">selected="selected"</c:if> value="아이티(HAITI)">아이티(HAITI)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아일랜드(IRELAND)' }">selected="selected"</c:if> value="아일랜드(IRELAND)">아일랜드(IRELAND)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아제르바이잔(AZERBAIJAN)' }">selected="selected"</c:if> value="아제르바이잔(AZERBAIJAN)">아제르바이잔(AZERBAIJAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '아프가니스탄(AFGHANISTAN)' }">selected="selected"</c:if> value="아프가니스탄(AFGHANISTAN)">아프가니스탄(AFGHANISTAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '안도라(ANDORRA)' }">selected="selected"</c:if> value="안도라(ANDORRA)">안도라(ANDORRA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '알바니아(ALBANIA)' }">selected="selected"</c:if> value="알바니아(ALBANIA)">알바니아(ALBANIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '알제리(ALGERIA)' }">selected="selected"</c:if> value="알제리(ALGERIA)">알제리(ALGERIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '앙골라(ANGOLA)' }">selected="selected"</c:if> value="앙골라(ANGOLA)">앙골라(ANGOLA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '앤티가 바부다(ANTIGUA AND BARBUDA)' }">selected="selected"</c:if> value="앤티가 바부다(ANTIGUA AND BARBUDA)">앤티가 바부다(ANTIGUA AND BARBUDA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '앵귈라(ANGUILLA)' }">selected="selected"</c:if> value="앵귈라(ANGUILLA)">앵귈라(ANGUILLA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '에리트레아(ERITREA)' }">selected="selected"</c:if> value="에리트레아(ERITREA)">에리트레아(ERITREA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '에스토니아(ESTONIA)' }">selected="selected"</c:if> value="에스토니아(ESTONIA)">에스토니아(ESTONIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '에콰도르(ECUADOR)' }">selected="selected"</c:if> value="에콰도르(ECUADOR)">에콰도르(ECUADOR)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '에티오피아(ETHIOPIA)' }">selected="selected"</c:if> value="에티오피아(ETHIOPIA)">에티오피아(ETHIOPIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '엘살바도르(EL SALVADOR)' }">selected="selected"</c:if> value="엘살바도르(EL SALVADOR)">엘살바도르(EL SALVADOR)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '영국(UNITED KINGDOM)' }">selected="selected"</c:if> value="영국(UNITED KINGDOM)">영국(UNITED KINGDOM)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '영국령 버진아일랜드(VIRGIN ISLANDS, BRITISH)' }">selected="selected"</c:if> value="영국령 버진아일랜드(VIRGIN ISLANDS, BRITISH)">영국령 버진아일랜드(VIRGIN ISLANDS, BRITISH)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '영국령 인도양 지역(BRITISH INDIAN OCEAN TERRITORY)' }">selected="selected"</c:if> value="영국령 인도양 지역(BRITISH INDIAN OCEAN TERRITORY)">영국령 인도양 지역(BRITISH INDIAN OCEAN TERRITORY)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '예멘(YEMEN, REPUBLIC OF)' }">selected="selected"</c:if> value="예멘(YEMEN, REPUBLIC OF)">예멘(YEMEN, REPUBLIC OF)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '오만(OMAN)' }">selected="selected"</c:if> value="오만(OMAN)">오만(OMAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '오스트레일리아(AUSTRALIA)' }">selected="selected"</c:if> value="오스트레일리아(AUSTRALIA)">오스트레일리아(AUSTRALIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '오스트리아(AUSTRIA)' }">selected="selected"</c:if> value="오스트리아(AUSTRIA)">오스트리아(AUSTRIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '온두라스(HONDURAS)' }">selected="selected"</c:if> value="온두라스(HONDURAS)">온두라스(HONDURAS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '올란드 제도(ALAND ISLANDS)' }">selected="selected"</c:if> value="올란드 제도(ALAND ISLANDS)">올란드 제도(ALAND ISLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '왈리스 퓌튀나(WALLIS AND FUTUNA ISLANDS)' }">selected="selected"</c:if> value="왈리스 퓌튀나(WALLIS AND FUTUNA ISLANDS)">왈리스 퓌튀나(WALLIS AND FUTUNA ISLANDS)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '요르단(JORDAN)' }">selected="selected"</c:if> value="요르단(JORDAN)">요르단(JORDAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '우간다(UGANDA)' }">selected="selected"</c:if> value="우간다(UGANDA)">우간다(UGANDA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '우루과이(URUGUAY)' }">selected="selected"</c:if> value="우루과이(URUGUAY)">우루과이(URUGUAY)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '이탈리아(ITALY)' }">selected="selected"</c:if> value="이탈리아(ITALY)">이탈리아(ITALY)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '인도(INDIA)' }">selected="selected"</c:if> value="인도(INDIA)">인도(INDIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '일본(JAPAN)' }">selected="selected"</c:if> value="일본(JAPAN)">일본(JAPAN)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '조선민주주의인민공화국(KOREA, DEMOCRATIC PEOPLE S REPUBLIC OF)' }">selected="selected"</c:if> value="조선민주주의인민공화국(KOREA, DEMOCRATIC PEOPLE S REPUBLIC OF)">조선민주주의인민공화국(KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '조지아(GEORGIA)' }">selected="selected"</c:if> value="조지아(GEORGIA)">조지아(GEORGIA)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '중앙아프리카 공화국(CENTRAL AFRICAN REPUBLIC)' }">selected="selected"</c:if> value="중앙아프리카 공화국(CENTRAL AFRICAN REPUBLIC)">중앙아프리카 공화국(CENTRAL AFRICAN REPUBLIC)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '쿠웨이트(KUWAIT)' }">selected="selected"</c:if> value="쿠웨이트(KUWAIT)">쿠웨이트(KUWAIT)</option>
				<option <c:if test="${map.PRODUCT_NATION eq '홍콩(HONG KONG)' }">selected="selected"</c:if> value="홍콩(HONG KONG)">홍콩(HONG KONG)</option>
			</select>
		</div>
		</br>
		<div style="border:solid 1px;">
			2-5. 실제 가공업체
			<input type="button" value="가공업체 삭제" onclick="fn_tableMin1()"/><input type="button" value="가공업체 추가" onclick="fn_tableAdd1()"/>
			<table>
				<thead>
					<th>번호</th>
					<th>구분</th>
					<th>회사명</th>
					<th>주소</th>
				</thead>
				<tbody id="tbody2">
					<c:choose>
			            <c:when test="${fn:length(makeList) > 0}">
			                <c:forEach items="${makeList }" var="list" varStatus="i">
			                    <tr>
			                    	<th rowspan='3'>${i.index+1 }</th>
			                    	<td>한글</td>
			                    	<td><input type='text' name='p_company_nm' value='${list.COMPANY_NM }'/></td>
			                    	<td><input type='text' name='p_company_addr' value='${list.COMPANY_ADDR }'/></td>
			                    </tr>
			                    <tr>
			                    	<td>영어</td>
			                    	<td><input type='text' name='p_company_nm_eng' value='${list.COMPANY_NM_ENG }'/></td>
			                    	<td><input type='text' name='p_company_addr_eng' value='${list.COMPANY_ADDR_ENG }'/></td>
			                    </tr>
			                    <tr>
			                    	<td>중국</td>
			                    	<td><input type='text' name='p_company_nm_chn' value='${list.COMPANY_NM_CHN }'/></td>
			                    	<td><input type='text' name='p_company_addr_chn' value='${list.COMPANY_ADDR_CHN }'/></td>
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
			<div>브랜드 소유 기업과 실제 가공업체와의 관계 <input type="radio" name="p_gagong_yn" id="p_gagong_yn" <c:if test="${map.GAGONG_YN eq 'Y'}">checked="checked"</c:if> value="Y">동일 &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="p_gagong_yn" id="p_gagong_yn" <c:if test="${map.GAGONG_YN eq 'N'}">checked="checked"</c:if> value="N"> 위탁가공</div>
		</div>
		</br>
		
		<c:choose>
            <c:when test="${fn:length(fileList) > 0}">
                <c:forEach items="${fileList }" var="list" varStatus="i">
                	<c:if test="${i.index eq 0 }">
                	<div>
                		전성분표 &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="file" id="file_0" name="file_0" /></br>
                		<span id="file_zero"><a href="javascript:void(0);" onclick="fn_fileDownLoad('${list.FILE_SEQ}');"> ${list.ORIGINAL_FILE_NM }</a></span></br>
               		</div>
                	</c:if>
                	<c:if test="${i.index eq 1 }">
                	<div>
                		패키지  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="file" name="file_1" id="file_1" /> </br> 
                		<span id="file_one"><a href="javascript:void(0);" onclick="fn_fileDownLoad('${list.FILE_SEQ}');">${list.ORIGINAL_FILE_NM }</a></span></br>
               		</div>
                	</c:if>
                </c:forEach>
            </c:when>
        </c:choose>
		
		<div>
			2-8. 패키지 디자인의 텍스트</br>
			패키지의 디지털 파일에 포함되어 있는 텍스트 내용.</br>
			제품명 / 제품설명 / 제품성분 / 사용방법 등의 제품의 패키지 디자인의 포홤된 모든 텍스트 내용을 기록하셔야 합니다.
			<textarea rows="20" cols="200" name="p_pakage_text">${map.PAKAGE_TEXT }</textarea>
		</div>
		</br>
		<div style="display:inline-block;">
			<button value="<< 이전단계" onclick="fn_backContent();">이전단계</button>
			<button value="약관동의 후 카테고리 선택하기" onclick="fn_tempUpdateForm();">미리보기 (저장)</button>
		</div>
		</br>
		</br>
		</br>
		</br>
		</br>
		
		
	</div>
	
</div>
</form>
</body>
</html>