<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>회원가입</title>
</head>
<script type="text/javascript">
function pw_check(val){
	
	if($("#p_pw").val() == $("#p_pw_reward").val()){
		$("#pw_check").html("동일하다");
	}else{
		$("#pw_check").html("틀려 다시 입력해봐");
	} 
}
function joinMember(){
	var f = document.form1;
// 	return;
// 	$("#p_gender").val($("#p_input_gender").val());
	
	f.action = "/usr/member/joinUser.do";
	f.submit();
}

function duplicateCheck(){
	$.ajax({
		url:'/usr/member/duplicateIdCheck.do',
		type:'post',
		dataType:'json',
		success:function(data){
			alert(data.succes);
		},
		error:function(e){
			alert(e.responseText);
		}
	});
}
</script>
<body>
	<form id="form1" name="form1" method="post" enctype="multipart/form-data">
		<input type="hidden" id="p_gender" name="p_gender" value=""/>
		<table class="board_view">
            <colgroup>
                <col width="20%">
                <col width="*"/>
            </colgroup>
            <caption>회원가입</caption>
            <tbody>
                <tr>
                    <th scope="row">ID</th>
                    <td>
                    	<input type="text" id="p_accedid" name="p_accedid" ></input>
                    	<button type="button" onclick="duplicateCheck()">중복체크</button>
                    </td>
                </tr>
                <tr>
                    <th scope="row">PW</th>
                    <td>
	                    <input type="text" id="p_pw" name="p_pw" onkeypress="pw_check(this)"></input>
	                    <input type="text" id="p_pw_reward" name="p_pw_reward" onkeypress="pw_check(this)"></input>
	                    <span id="pw_check"></span>
                    </td>
                </tr>
                <tr>
                    <th scope="row">이름</th>
	                <td colspan="2"><input type="text" id="p_usernm" name="p_usernm" ></input></td>
<!--                     <td colspan="2" class="view_text"> -->
<!--                         <textarea rows="20" cols="100" title="내용" id="CONTENTS" name="CONTENTS"></textarea> -->
<!--                     </td> -->
                </tr>
                <tr>
                    <th scope="row">성별</th>
	                <td colspan="2">
	                	<input type="radio" id="p_gender" name="p_input_gender" value="M" >남자</input>
	                	<input type="radio" id="p_gender" name="p_input_gender" value="W">여자</input>
	                </td>
                </tr>
                <tr>
                    <th scope="row">전화번호</th>
                    <td>
	                    <input type="text" id="p_phonenum" name="p_phonenum" ></input>
	                    <span> - 없이 입력 해주세요</span>
                    </td>
                </tr>
                <tr>
                    <th scope="row">생일</th>
                    <td>
	                    <input type="text" id="p_year" name="p_year" value="" placeholder="ex) 19990121"/>
                    </td>
                </tr>
                <tr>
                    <th scope="row">사진</th>
                    <td>
	                    <input type="file" id="p_file" name="p_file" value="" />
                    </td>
                </tr>
            </tbody>
        </table>
        <button type="button" onclick="joinMember()">가입</button>
        <button type="button" onclick="cancleMember()">취소</button>
	</form>
</body>
</html>