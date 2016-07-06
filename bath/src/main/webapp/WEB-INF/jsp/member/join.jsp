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
	
	f.action = "";
	f.submit();
}
</script>
<body>
	<form id="form1" name="form1" method="post" >
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
                    	<button type="button" onclick="idCheck()">중복체크</button>
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
	                <td colspan="2"><input type="text" id="p_nm" name="p_nm" ></input></td>
<!--                     <td colspan="2" class="view_text"> -->
<!--                         <textarea rows="20" cols="100" title="내용" id="CONTENTS" name="CONTENTS"></textarea> -->
<!--                     </td> -->
                </tr>
                <tr>
                    <th scope="row">성별</th>
	                <td colspan="2">
	                	<input type="radio" id="p_gender" name="p_gender" value="M" >남자</input>
	                	<input type="radio" id="p_gender" name="p_gender" value="W">여자</input>
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
	                    <input type="text" id="p_year" name="p_year" value="" placeholder="ex) 19990121"></input>
                    </td>
                </tr>
            </tbody>
        </table>
        <button type="button" onclick="joinMember()">가입하기</button>
        <button type="button" onclick="cancleMember()">취소</button>
	</form>
</body>
</html>