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
	    //$("#file_zero").text("");
	    
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
	    //$("#file_one").text("");
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
</script>
<body>
<form id="form1" name="form1" method="post" enctype="multipart/form-data" onsubmit="return false">
<input type="hidden" name="p_order_cate" id="p_order_cate" value="${map.p_order_cate }"/>
<input type="hidden" name="p_product_cate" id="p_product_cate" value="${map.p_product_cate }"/>
<input type="hidden" name="p_order_flow" id="p_order_flow" value="E"/>
<input type="hidden" name="nextyn" id="nextyn" value="N"/>
<div>
	<c:choose>
		<c:when test="${map.p_order_cate eq 'A'}">
			<h2>사전검토 접수</h2>
		</c:when>
		<c:when test="${map.p_order_cate eq 'B'}">
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
			* 한글명 : <input type="text" name="p_comp_nm" id="p_comp_nm" value="한글회사명"/></br>
			* 영문명 : <input type="text" name="p_comp_nm_eng" id="p_comp_nm_eng" value="EnglishCompNm"/></br>
			중문명 : <input type="text" name="p_comp_nm_chn" id="p_comp_nm_chn" value=""/>
			
		</div>
		<div>
			1-2 연락처</br>
			* 이메일(필수) <input type="text" name="p_emailing" id="p_emailing" value="testComp@testComp.com"/></br>
			* 전화번호(필수) <input type="text" name="p_phone_no" id="p_phone_no" value="02-3723-2311"/></br>
			  FAX  <input type="text" name="p_fax_no" id="p_fax_no" value=""/>
		</div>
		<div>
			1-3 주소</br>
			* 한글주소(필수) 	<input type="text" name="p_addr_ko" id="p_addr_ko" value="한글 주소 입력란"/><input type="text" name="p_addr_ko2" id="p_addr_ko2" value="주소 상세내용"/></br>
			* 영문주소(필수) 	<input type="text" name="p_addr_eng" id="p_addr_eng" value="English Address"/><input type="text" name="p_addr_eng2" id="p_addr_eng2" value="Detail Address"/></br>
			    중문주소  		<input type="text" name="p_addr_chn" id="p_addr_chn" value=""/><input type="text" name="p_addr_chn2" id="p_addr_chn2" value=""/>
		</div>
		<a href="javascript:void(0)" onclick="fn_cateSel">카테고리 선택으로 돌아가기</a>
		<input type="button" onclick="fn_showNext();" value="다음 (제품정보)"></input>
	</div>
	<div id="inputVal2" style="display:none;">
		<h3>2. 제품정보</h3>
		<div>
			2-1. 제품 카테고리 <input type="text" name="p_product_cate_txt" id="p_product_cate_txt"  value=""/>
		</div>
		</br>
		<div>
			2-2. 제품 이름</br>
			* 한글명(필수) <input type="text" name="p_product_nm" id="p_product_nm" value=""/></br>
			* 영문명(필수) <input type="text" name="p_product_nm_eng" id="p_product_nm_eng" value=""/></br>
			  중문명  		<input type="text" name="p_product_nm_chn" id="p_product_nm_chn" value=""/>
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
				</tbody>
			</table>
		</div>
		</br>
		<div>
			2-4. 제품 생산정보 </br>
			제품 생산국 : 
			<select name="p_product_nation">
				<option value="">국가선택</option>
				<option value="가나(GHANA)">가나(GHANA)</option>
				<option value="가봉(GABONG)">가봉(GABONG)</option>
				<option value="가나(GHANA)">가나(GHANA)</option>
				<option value="가이아나(GUYANA)">가이아나(GUYANA)</option>
				<option value="가나(GHANA)">감비아(GAMBIA)</option>
				<option value="가나(GHANA)">건지 섬(GUERNSEY)</option>
				<option value="과들루프(GUADELOUPE)">과들루프(GUADELOUPE)</option>
				<option value="과테말라(GUATEMALA)">과테말라(GUATEMALA)</option>
				<option value="괌(GUAM)">괌(GUAM)</option>
				<option value="그레나다(GRENADA)">그레나다(GRENADA)</option>
				<option value="그리스(GREECE)">그리스(GREECE)</option>
				<option value="그린란드(GREENLAND)">그린란드(GREENLAND)</option>
				<option value="기니(GUINEA)">기니(GUINEA)</option>
				<option value="기니비사우(GUINEA-BISSAU)">기니비사우(GUINEA-BISSAU)</option>
				<option value="나미비아(NAMIBIA)">나미비아(NAMIBIA)</option>
				<option value="나우루(NAURU)">나우루(NAURU)</option>
				<option value="나이지리아(NIGERIA)">나이지리아(NIGERIA)</option>
				<option value="남극(ANTARCTICA)">남극(ANTARCTICA)</option>
				<option value="남수단(REPUBLIC OF SOUTH SUDAN)">남수단(REPUBLIC OF SOUTH SUDAN)</option>
				<option value="남아프리카 공화국(SOUTH AFRICA)">남아프리카 공화국(SOUTH AFRICA)</option>
				<option value="네덜란드(NETHERLANDS)">네덜란드(NETHERLANDS)</option>
				<option value="네덜란드령 안틸레스(NETHERLANDS ANTILLES)">네덜란드령 안틸레스(NETHERLANDS ANTILLES)</option>
				<option value="네팔(NEPAL)">네팔(NEPAL)</option>
				<option value="노르웨이(NORWAY)">노르웨이(NORWAY)</option>
				<option value="노퍽 섬(NORFOLK ISLAND)">노퍽 섬(NORFOLK ISLAND)</option>
				<option value="누벨칼레도니(NEW CALEDONIA)">누벨칼레도니(NEW CALEDONIA)</option>
				<option value="뉴질랜드(NEW ZEALAND)">뉴질랜드(NEW ZEALAND)</option>
				<option value="니우에(NIUE)">니우에(NIUE)</option>
				<option value="니제르(NIGER)">니제르(NIGER)</option>
				<option value="니카라과(NICARAGUA)">니카라과(NICARAGUA)</option>
				<option value="대한민국(KOREA, REPUBLIC OF)">대한민국(KOREA, REPUBLIC OF)</option>
				<option value="덴마크(DENMARK)">덴마크(DENMARK)</option>
				<option value="도미니카 공화국(DOMINICAN REPUBLIC)">도미니카 공화국(DOMINICAN REPUBLIC)</option>
				<option value="도미니카 연방(DOMINICA)">도미니카 연방(DOMINICA)</option>
				<option value="독일(GERMANY)">독일(GERMANY)</option>
				<option value="동티모르(EAST TIMOR)">동티모르(EAST TIMOR)</option>
				<option value="라오스(LAO PEOPLE'S DEMOCRATIC REPUBLIC)">라오스(LAO PEOPLE'S DEMOCRATIC REPUBLIC)</option>
				<option value="라이베리아(LIBERIA)">라이베리아(LIBERIA)</option>
				<option value="라트비아(LATVIA)">라트비아(LATVIA)</option>
				<option value="러시아(RUSSIAN FEDERATION)">러시아(RUSSIAN FEDERATION)</option>
				<option value="레바논(LEBANON)">레바논(LEBANON)</option>
				<option value="레소토(LESOTHO)">레소토(LESOTHO)</option>
				<option value="레위니옹(REUNION)">레위니옹(REUNION)</option>
				<option value="루마니아(ROMANIA)">루마니아(ROMANIA)</option>
				<option value="룩셈부르크(LUXEMBOURG)">룩셈부르크(LUXEMBOURG)</option>
				<option value="르완다(RWANDA)">르완다(RWANDA)</option>
				<option value="리비아(LIBYAN ARAB JAMAHIRIYA)">리비아(LIBYAN ARAB JAMAHIRIYA)</option>
				<option value="리투아니아(LITHUANIA)">리투아니아(LITHUANIA)</option>
				<option value="리히텐슈타인(LIECHTENSTEIN)">리히텐슈타인(LIECHTENSTEIN)</option>
				<option value="마다가스카르(MADAGASCAR)">마다가스카르(MADAGASCAR)</option>
				<option value="마르티니크(MARTINIQUE)">마르티니크(MARTINIQUE)</option>
				<option value="마셜 제도(MARSHALL ISLANDS)">마셜 제도(MARSHALL ISLANDS)</option>
				<option value="마요트(MAYOTTE)">마요트(MAYOTTE)</option>
				<option value="마카오(MACAU)">마카오(MACAU)</option>
				<option value="마케도니아 공화국(REPUBLIC OF MACEDONIA)">마케도니아 공화국(REPUBLIC OF MACEDONIA)</option>
				<option value="말라위(MALAWI)">말라위(MALAWI)</option>
				<option value="말레이시아(MALAYSIA)">말레이시아(MALAYSIA)</option>
				<option value="말리(MALI)">말리(MALI)</option>
				<option value="맨 섬(ISLE OF MAN)">맨 섬(ISLE OF MAN)</option>
				<option value="멕시코(MEXICO)">멕시코(MEXICO)</option>
				<option value="모나코(MONACO)">모나코(MONACO)</option>
				<option value="모로코(MOROCCO)">모로코(MOROCCO)</option>
				<option value="모리셔스(MAURITIUS)">모리셔스(MAURITIUS)</option>
				<option value="모리타니(MAURITANIA)">모리타니(MAURITANIA)</option>
				<option value="모잠비크(MOZAMBIQUE)">모잠비크(MOZAMBIQUE)</option>
				<option value="몬테네그로(MONTENEGRO)">몬테네그로(MONTENEGRO)</option>
				<option value="몬트세랫(MONTSERRAT)">몬트세랫(MONTSERRAT)</option>
				<option value="몰도바(MOLDOVA, REPUBLIC OF)">몰도바(MOLDOVA, REPUBLIC OF)</option>
				<option value="몰디브(MALDIVES)">몰디브(MALDIVES)</option>
				<option value="몰타(MALTA)">몰타(MALTA)</option>
				<option value="몽골(MONGOLIA)">몽골(MONGOLIA)</option>
				<option value="미국(UNITED STATES)">미국(UNITED STATES)</option>
				<option value="미국령 군소 제도(UNITED STATES MINOR OUTLYING ISLANDS)">미국령 군소 제도(UNITED STATES MINOR OUTLYING ISLANDS)</option>
				<option value="미국령 버진아일랜드(VIRGIN ISLANDS, U.S.)">미국령 버진아일랜드(VIRGIN ISLANDS, U.S.)</option>
				<option value="미얀마(MYANMAR)">미얀마(MYANMAR)</option>
				<option value="미크로네시아 연방(MICRONESIA)">미크로네시아 연방(MICRONESIA)</option>
				<option value="바누아투(VANUATU)">바누아투(VANUATU)</option>
				<option value="바레인(BAHRAIN)">바레인(BAHRAIN)</option>
				<option value="바베이도스(BARBADOS)">바베이도스(BARBADOS)</option>
				<option value="바티칸 시국(VATICAN CITY STATE)">바티칸 시국(VATICAN CITY STATE)</option>
				<option value="바하마(BAHAMAS)">바하마(BAHAMAS)</option>
				<option value="방글라데시(BANGLADESH)">방글라데시(BANGLADESH)</option>
				<option value="버뮤다(BERMUDA)">버뮤다(BERMUDA)</option>
				<option value="베냉(BENIN)">베냉(BENIN)</option>
				<option value="베네수엘라(VENEZUELA)">베네수엘라(VENEZUELA)</option>
				<option value="베트남(VIET NAM)">베트남(VIET NAM)</option>
				<option value="벨기에(BELGIUM)">벨기에(BELGIUM)</option>
				<option value="벨라루스(BELARUS)">벨라루스(BELARUS)</option>
				<option value="벨리즈(BELIZE)">벨리즈(BELIZE)</option>
				<option value="보스니아 헤르체고비나(BOSNIA HERCEGOVINA)">보스니아 헤르체고비나(BOSNIA HERCEGOVINA)</option>
				<option value="보츠와나(BOTSWANA)">보츠와나(BOTSWANA)</option>
				<option value="볼리비아(BOLIVIA)">볼리비아(BOLIVIA)</option>
				<option value="부룬디(BURUNDI)">부룬디(BURUNDI)</option>
				<option value="부르키나파소(BURKINA FASO)">부르키나파소(BURKINA FASO)</option>
				<option value="부베 섬(BOUVET ISLAND)">부베 섬(BOUVET ISLAND)</option>
				<option value="부탄(BHUTAN)">부탄(BHUTAN)</option>
				<option value="북마리아나 제도(NORTHERN MARIANA ISLANDS)">북마리아나 제도(NORTHERN MARIANA ISLANDS)</option>
				<option value="불가리아(BULGARIA)">불가리아(BULGARIA)</option>
				<option value="브라질(BRAZIL)">브라질(BRAZIL)</option>
				<option value="브루나이(BRUNEI DARUSSALAM)">브루나이(BRUNEI DARUSSALAM)</option>
				<option value="사모아(SAMOA)">사모아(SAMOA)</option>
				<option value="사우디아라비아(SAUDI ARABIA)">사우디아라비아(SAUDI ARABIA)</option>
				<option value="사우스조지아 사우스샌드위치 제도(SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS)">사우스조지아 사우스샌드위치 제도(SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS)</option>
				<option value="산마리노(SAN MARINO)">산마리노(SAN MARINO)</option>
				<option value="상투메 프린시페(SAO TOME AND PRINCIPE)">상투메 프린시페(SAO TOME AND PRINCIPE)</option>
				<option value="생피에르 미클롱(ST. PIERRE AND MIQUELON)">생피에르 미클롱(ST. PIERRE AND MIQUELON)</option>
				<option value="서사하라(WESTERN SAHARA)">서사하라(WESTERN SAHARA)</option>
				<option value="세네갈(SENEGAL)">세네갈(SENEGAL)</option>
				<option value="세르비아(SERBIA)">세르비아(SERBIA)</option>
				<option value="세이셸(SEYCHELLES)">세이셸(SEYCHELLES)</option>
				<option value="세인트루시아(SAINT LUCIA)">세인트루시아(SAINT LUCIA)</option>
				<option value="세인트빈센트 그레나딘(SAINT VINCENT AND THE GRENADINES)">세인트빈센트 그레나딘(SAINT VINCENT AND THE GRENADINES)</option>
				<option value="세인트키츠 네비스(SAINT KITTS AND NEVIS)">세인트키츠 네비스(SAINT KITTS AND NEVIS)</option>
				<option value="세인트헬레나(ST. HELENA)">세인트헬레나(ST. HELENA)</option>
				<option value="소말리아(SOMALIA)">소말리아(SOMALIA)</option>
				<option value="솔로몬 제도(SOLOMON ISLANDS)">솔로몬 제도(SOLOMON ISLANDS)</option>
				<option value="수단(SUDAN)">수단(SUDAN)</option>
				<option value="수리남(SURINAME)">수리남(SURINAME)</option>
				<option value="스리랑카(SRI LANKA)">스리랑카(SRI LANKA)</option>
				<option value="스발바르 얀마옌(SVALBARD AND JAN MAYEN ISLANDS)">스발바르 얀마옌(SVALBARD AND JAN MAYEN ISLANDS)</option>
				<option value="스와질란드(SWAZILAND)">스와질란드(SWAZILAND)</option>
				<option value="스웨덴(SWEDEN)">스웨덴(SWEDEN)</option>
				<option value="스위스(SWITZERLAND)">스위스(SWITZERLAND)</option>
				<option value="스페인(SPAIN)">스페인(SPAIN)</option>
				<option value="슬로바키아(SLOVAKIA)">슬로바키아(SLOVAKIA)</option>
				<option value="슬로베니아(SLOVENIA)">슬로베니아(SLOVENIA)</option>
				<option value="시리아(SYRIAN ARAB REPUBLIC)">시리아(SYRIAN ARAB REPUBLIC)</option>
				<option value="시에라리온(SIERRA LEONE)">시에라리온(SIERRA LEONE)</option>
				<option value="싱가포르(SINGAPORE)">싱가포르(SINGAPORE)</option>
				<option value="아랍에미리트(UNITED ARAB EMIRATES)">아랍에미리트(UNITED ARAB EMIRATES)</option>
				<option value="아루바(ARUBA)">아루바(ARUBA)</option>
				<option value="아르메니아(ARMENIA)">아르메니아(ARMENIA)</option>
				<option value="아르헨티나(ARGENTINA)">아르헨티나(ARGENTINA)</option>
				<option value="아메리칸사모아(AMERICAN SAMOA)">아메리칸사모아(AMERICAN SAMOA)</option>
				<option value="아이슬란드(ICELAND)">아이슬란드(ICELAND)</option>
				<option value="아이티(HAITI)">아이티(HAITI)</option>
				<option value="아일랜드(IRELAND)">아일랜드(IRELAND)</option>
				<option value="아제르바이잔(AZERBAIJAN)">아제르바이잔(AZERBAIJAN)</option>
				<option value="아프가니스탄(AFGHANISTAN)">아프가니스탄(AFGHANISTAN)</option>
				<option value="안도라(ANDORRA)">안도라(ANDORRA)</option>
				<option value="알바니아(ALBANIA)">알바니아(ALBANIA)</option>
				<option value="알제리(ALGERIA)">알제리(ALGERIA)</option>
				<option value="앙골라(ANGOLA)">앙골라(ANGOLA)</option>
				<option value="앤티가 바부다(ANTIGUA AND BARBUDA)">앤티가 바부다(ANTIGUA AND BARBUDA)</option>
				<option value="앵귈라(ANGUILLA)">앵귈라(ANGUILLA)</option>
				<option value="에리트레아(ERITREA)">에리트레아(ERITREA)</option>
				<option value="에스토니아(ESTONIA)">에스토니아(ESTONIA)</option>
				<option value="에콰도르(ECUADOR)">에콰도르(ECUADOR)</option>
				<option value="에티오피아(ETHIOPIA)">에티오피아(ETHIOPIA)</option>
				<option value="엘살바도르(EL SALVADOR)">엘살바도르(EL SALVADOR)</option>
				<option value="영국(UNITED KINGDOM)">영국(UNITED KINGDOM)</option>
				<option value="영국령 버진아일랜드(VIRGIN ISLANDS, BRITISH)">영국령 버진아일랜드(VIRGIN ISLANDS, BRITISH)</option>
				<option value="영국령 인도양 지역(BRITISH INDIAN OCEAN TERRITORY)">영국령 인도양 지역(BRITISH INDIAN OCEAN TERRITORY)</option>
				<option value="예멘(YEMEN, REPUBLIC OF)">예멘(YEMEN, REPUBLIC OF)</option>
				<option value="오만(OMAN)">오만(OMAN)</option>
				<option value="오스트레일리아(AUSTRALIA)">오스트레일리아(AUSTRALIA)</option>
				<option value="오스트리아(AUSTRIA)">오스트리아(AUSTRIA)</option>
				<option value="온두라스(HONDURAS)">온두라스(HONDURAS)</option>
				<option value="올란드 제도(ALAND ISLANDS)">올란드 제도(ALAND ISLANDS)</option>
				<option value="왈리스 퓌튀나(WALLIS AND FUTUNA ISLANDS)">왈리스 퓌튀나(WALLIS AND FUTUNA ISLANDS)</option>
				<option value="요르단(JORDAN)">요르단(JORDAN)</option>
				<option value="우간다(UGANDA)">우간다(UGANDA)</option>
				<option value="우루과이(URUGUAY)">우루과이(URUGUAY)</option>
				<option value="이탈리아(ITALY)">이탈리아(ITALY)</option>
				<option value="인도(INDIA)">인도(INDIA)</option>
				<option value="일본(JAPAN)">일본(JAPAN)</option>
				<option value="조선민주주의인민공화국(KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF)">조선민주주의인민공화국(KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF)</option>
				<option value="조지아(GEORGIA)">조지아(GEORGIA)</option>
				<option value="중앙아프리카 공화국(CENTRAL AFRICAN REPUBLIC)">중앙아프리카 공화국(CENTRAL AFRICAN REPUBLIC)</option>
				<option value="쿠웨이트(KUWAIT)">쿠웨이트(KUWAIT)</option>
				<option value="홍콩(HONG KONG)">홍콩(HONG KONG)</option>
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
				</tbody>
			</table>
			<div>브랜드 소유 기업과 실제 가공업체와의 관계 <input type="radio" name="p_gagong_yn" id="p_gagong_yn" value="Y">동일 &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="p_gagong_yn" id="p_gagong_yn" value="N"> 위탁가공</div>
		</div>
		</br>
		<div>
			2-6. 전성분표</br>
			<input type="file" id="file_0" name="file_0" />
		</div>
		</br>
		<div>
			2-7. 패키지 디자인 파일 업로드</br>
			<input type="file" id="file_1" name="file_1" />
		</div>
		</br>
		<div>
			2-8. 패키지 디자인의 텍스트</br>
			패키지의 디지털 파일에 포함되어 있는 텍스트 내용.</br>
			제품명 / 제품설명 / 제품성분 / 사용방법 등의 제품의 패키지 디자인의 포홤된 모든 텍스트 내용을 기록하셔야 합니다.
			<textarea rows="20" cols="200" name="p_pakage_text" id="p_pakage_text"></textarea>
		</div>
		</br>
		<div style="display:inline-block;">
			<button value="<< 이전단계" onclick="fn_backContent();">이전단계</button>
			<button value="약관동의 후 카테고리 선택하기" onclick="fn_tempWriteForm();">미리보기 (저장)</button>
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