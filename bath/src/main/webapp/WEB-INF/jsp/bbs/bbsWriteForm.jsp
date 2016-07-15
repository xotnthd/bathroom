<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>게시글 등록</title>
<script type="text/javascript">

function fn_regiBbs(){
	var f = document.form1;
	
	f.action = "/bbs/boardWrite.do";
	f.submit();
}
</script>
</head>
<body>
	<form id="form1" name="form1" method="post" enctype="multipart/form-data">
	<input type="hidden" name="p_bbs_id" id ="p_bbs_id" value="2"/>
        <table class="board_view">
            <colgroup>
                <col width="15%">
                <col width="*"/>
            </colgroup>
            <caption>게시글 작성</caption>
            <tbody>
                <tr>
                    <th scope="row">제목</th>
                    <td><input type="text" id="p_title" name="p_title" /></td>
                </tr>
                <tr>
                    <th scope="row">내용</th>
                    <td colspan="2" class="view_text">
                        <textarea rows="20" cols="100" title="내용" id="p_contents" name="p_contents"></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row">파일</th>
                    <td colspan="2" >
		                <input type="file" id="p_file" name="p_file" value="" />
                    </td>
                </tr>
            </tbody>
        </table>
       <div style="padding-bottom: 20px;">
       		<button type="button" onclick="fn_regiBbs()">등록하기</button>
       </div>
    </form>
</body>
</html>