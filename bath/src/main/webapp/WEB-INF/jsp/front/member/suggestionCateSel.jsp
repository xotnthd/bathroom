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

function fn_writeForm(val){
	var f = document.form1;
	f.p_product_cate.value = val;
	f.action ="<c:url value='/usr/member/suggestionWrite.do' />";
	f.submit();
}
</script>
<body>
<form id="form1" name="form1" method="post" enctype="multipart/form-data">
<input type="hidden" name="p_order_cate" 	id="p_order_cate" 	value="${map.p_order_cate }"/>
<input type="hidden" name="p_product_cate" 	id="p_product_cate" value=""/>
<div style="align-content: center;">
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
	<h3>제품 카테고리</h3>
	
	<div style="float: left;width:1600px;">
		<div style="width:85%;height:33%;border:solid 1px #050099;">
			<h3>화장품</h3>
			<p>화장품 화장품은 일반화장품과 기능성화장품(특수용도)로 분류됩니다. </p>
			<p>•기능성화장품은 염색류, 퍼머류, 기미제거류(미백류 포함), 자외 선차단류, 등이며 일반화장품에 비해 많은 비용이 소요됩니다. </p>
			<p>•NMPA가 공표한 화장품 원료명칭목록에 포함된 원료를 사 용해야 하며, 신규 화장품 원료는 우선 원료에 대한 허가를 취득 해야 합니다.</p>
			<div > 
				<a href="javascript:void(0);" onclick="fn_writeForm('A');">화장품 
					<c:choose>
						<c:when test="${map.p_order_cate eq 'A'}">
							사전검토 접수
						</c:when>
						<c:when test="${map.p_order_cate eq 'B'}">
							NMPA 접수
						</c:when>
						<c:otherwise>
							사전검역 서비스
						</c:otherwise>
					</c:choose>
				</a>
			</div>
		</div>
		<div style="width:85%;height: 33%;border:solid 1px #050099;">
			<h3>보건식품(건강식품)</h3>
			<p>특정 보건 기능이 있다고 표명하거나 비타민, 광물질 등의 보충을 목적으로 하는 식품입니다.</p>
			<p>질병 치료를 목적으로 하지 않으며 인체에 어떤 급성, 아급성 또는 만성 위해를 가하지 않는 식품을 말합니다.</p>
			<div> 
				<a href="javascript:void(0);" onclick="fn_writeForm('B');">보건식품
					<c:choose>
						<c:when test="${map.p_order_cate eq 'A'}">
							사전검토 접수
						</c:when>
						<c:when test="${map.p_order_cate eq 'B'}">
							NMPA 접수
						</c:when>
						<c:otherwise>
							사전검역 서비스
						</c:otherwise>
					</c:choose>
				</a>
			</div>
		</div>
		<div style="width:85%;height: 33%;border:solid 1px #050099;">
			<h3>의료기기</h3>
			<p>중국의 의료기기 감독 및 관리규정 제3조에 따르면 의료기기란 기구, 장비, 장치, 재료 또는 기타 물품으로써 단독 또는 조합으로 사용할 수 있고,</p>
			<p>적절하게 적용하기 위해 필요한 소프트웨어를 포함하기도 한다. 약학적, 면역학적 또는 신진대사에 따른 인체내의 주요한 활동을 이루는 것이 아니라</p>
			<p>이러한 방법 에 의하여 그 기능을 보조할 수 있다. - 질병의 진단, 예방, 감시, 치료 또는 완화</p>
			<p>- 상해 또는 장애의 진단, 감시, 치료, 완화 또는 보충</p>
			<p>- 해부학 또는 생리학에 대한 연구</p>
			<p>- 임신(conception)조절</p>
			<div>
				<a href="javascript:void(0);" onclick="fn_writeForm('C');">의료기기
					<c:choose>
						<c:when test="${map.p_order_cate eq 'A'}">
							사전검토 접수
						</c:when>
						<c:when test="${map.p_order_cate eq 'B'}">
							NMPA 접수
						</c:when>
						<c:otherwise>
							사전검역 서비스
						</c:otherwise>
					</c:choose>
				</a>
			</div>
		</div>
		<div style="width:85%;height: 33%;border:solid 1px #050099;">
			<h3>영유아 조제분유</h3>
			<p>기업별로 분유 브랜드 3개, 조제법 9종으로 제안 또한 제품포장 라벨에 등록번호를 명시해야 한다.</p>
			<div>
				<a href="javascript:void(0);" onclick="fn_writeForm('D');">영유아 조제분유
					<c:choose>
						<c:when test="${map.p_order_cate eq 'A'}">
							사전검토 접수
						</c:when>
						<c:when test="${map.p_order_cate eq 'B'}">
							NMPA 접수
						</c:when>
						<c:otherwise>
							사전검역 서비스
						</c:otherwise>
					</c:choose>
				</a>
			</div>
		</div>
		<div style="width:85%;height: 33%;border:solid 1px #050099;">
			<h3>의학품</h3>
			<p>중약재, 중약음편, 중약, 화학원료약, 항생소, 생 화학약품, 방사성 약품, 혈청, 백신, 혈액제품 및 진 단용 약품 등임 수입산 약품은</p>
			<p>국무원식품약품감독관리부서의 규정에 따라 등록 신 청하여 <수입 약품 등록증>을 취득해야만 수입 가능.</p>
			<div>
				<a href="javascript:void(0);" onclick="fn_writeForm('E');">의학품
					<c:choose>
						<c:when test="${map.p_order_cate eq 'A'}">
							사전검토 접수
						</c:when>
						<c:when test="${map.p_order_cate eq 'B'}">
							NMPA 접수
						</c:when>
						<c:otherwise>
							사전검역 서비스
						</c:otherwise>
					</c:choose>
				</a>
			</div>
		</div>
		<div style="width:85%;height: 33%;border:solid 1px #050099;">
			<h3>특수 의학용 조제식품</h3>
			<p>소화흡수장애, 대사문란 혹은 특정 질병환자의 영양소 혹은 특수 식사수요를 만족시키기 위하여 전문적으로 가공 및 조제한 식품</p>
			<div>
				<a href="javascript:void(0);" onclick="fn_writeForm('F');">특수 의학용 조제식품
					<c:choose>
						<c:when test="${map.p_order_cate eq 'A'}">
							사전검토 접수
						</c:when>
						<c:when test="${map.p_order_cate eq 'B'}">
							NMPA 접수
						</c:when>
						<c:otherwise>
							사전검역 서비스
						</c:otherwise>
					</c:choose>
				</a>
			</div>
		</div>
	</div>
	
</div>
</form>
</body>
</html>