<template>
	<div class="page_login">
		<div class="login_top">
			<img src="../../static/img/login_bg.jpg" class="_bg">
			<div class="_logo">
				<img src="../../static/img/logo.png">
			</div>
			<div class="_tabs _tabs_one">
				<a href="javascript:void(0)" class="current">找回密码</a>
			</div>
			<a href="javascript:void(0)" @click="onClickGoBack"><img src="../../static/img/ico_closed.png" class="_closed"></a>
		</div>
		<div class="reg_box">
			<div class="input_box">
				<input type="number" v-model="phone" placeholder="请输入手机号">
			</div>
			<div class="input_box input_box_short">
				<input type="text" v-model="code" placeholder="请输入验证码">
				<div class="send_code" @click="onClickGetSmsCode">获取验证码</div>
			</div>
			<div class="input_box">
				<input type="text" v-model="password" placeholder="请输入新密码">
			</div>
			<div class="submitdiv">
				<a href="javascript:void(0)" @click="onClickResetPasswordSubmit">重置密码</a>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

// main
export default {
	data: function() {
		return {
			phone: "",
			password: "",
			code: ""
		};
	},
	created() {
	},
	methods: {
		onClickGoBack() {
			this.$router.go(-1);
		},
		onClickGetSmsCode: function() {
			console.info("clickGetSmsCode happen");
			if(!this.phone){
				this.Toast("手机号码不能为空");
			} else {
				this.ajaxGetFindPasswordSmsCode();
			}
		},
		onClickResetPasswordSubmit: function() {
			if(!this.phone){
				this.Toast("手机号码不能为空");
			} else if(!this.code){
				this.Toast("验证码不能为空");
			} else if(!this.password){
				this.Toast("新密码不能为空");
			} else {
				this.ajaxResetPassword();
			}
		},
		ajaxGetFindPasswordSmsCode: function() {
			// 用户模块 - 修改密码发送短信
			this.$http.post("/api/servers/HJe9fA6J8x", {
				phone: this.phone
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					this.Toast({
						message: '发送成功',
						iconClass: 'icon icon-success'
					});
				} else {
					this.Toast(data.message);
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		},
		ajaxResetPassword: function(){
			// 用户模块 - 重置密码
			this.$http.post("/api/servers/userResetPassword", {
				phone: this.phone,
				password: this.password,
				code: this.code
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					this.Toast({
						message: '重置密码成功',
						iconClass: 'icon icon-success'
					});
					this.$router.push({path: '/u/login'})
				} else {
					this.Toast(data.message);
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		}
	}
}
</script>