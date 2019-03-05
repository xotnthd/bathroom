<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>제안시스템</title>
<style>

  #main-title {
  font-size:70pt;  
  margin-top:20%; /
  }
  </style>
</head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script type="text/javascript">
	function fn_login(){
		if($("#p_id").val() != "test"){
			alert('ID를 확인 해주세요.');
			$("#p_id").val('');
			return;
		}
		if($("#p_pw").val() != "test"){
			alert('비밀번호를 확인 해주세요.');
			$("#p_pw").val('');
			return;
		}
		var f = document.form1;
		f.action = "<c:url value='/main.do' />";
		f.submit();
		
	}
</script>
<body>
<form name="form1">
	<table align="center" height="90"> 
        <tr>
             <td><div id="main-title">LOGIN<div></td> 
       </tr>
 	</table>
	<table align="center" height="40" width="430" border="0" style="border:solid 4px #050099; margin-top:4%">  
		<tr>
			<td><input type="text" name="id" id="p_id" value="" style="height:40px; width:430px;"></td>
		</tr>  
	</table>


	<table align="center" height="40" width="430" border="0" style="border:solid 4px #050099; margin-top:1%"> 
		<tr>
			<td><input type="password" name="pw" id="p_pw" value="" style="height:40px; width:430px"></td>
		</tr>  
	</table>
	<table align="center" height="40" style="margin-top:1%">
		<tr>
			<td><input type="button" name="login" value="로그인" onclick="fn_login();" style="height:50px; width:430px;  background-color:#050099; color:white; font-size:16px; border:solid 1px #050099; "></td>
      	</tr> 
 	</table>
 	<table align="center" height="0" width="440" border="1" style="border:solid 1px #050099; margin-top:2%"></table>
	
	<table align="center" height="50" style="margin-top:1%" class="mo">
		<tr>
			<td><a style="text-decoration:none;" href="javascript:void(0);">회원가입 | </td> 
			<td><a style="text-decoration:none;" href="javascript:void(0);">아이디 찾기 | </td>
			<td><a style="text-decoration:none;" href="javascript:void(0);">비밀번호 찾기</td>
		</tr>
	</table>
</form>
</body>
</html>