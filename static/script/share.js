
$(function(){
	"use strict";
	var uid = $("#js_uid").val();
	if(!localStorage.uid_a && uid!=undefined && uid!="undefined" && uid!="" && uid!=" "){
		localStorage.uid_a = uid;
		console.info("写入推荐用户信息！localStorage.uid_a="+uid);
	}
});