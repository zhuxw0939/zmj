<template>
	<div class="page_login">
		<div class="login_top">
			<img src="../../static/img/login_bg.jpg" class="_bg">
			<div class="_logo">
				<img src="../../static/img/logo.png">
			</div>
			<div class="_tabs">
				<router-link to="/u/login">登录</router-link>
				<router-link to="/u/register" class="current">注册</router-link>
			</div>
			<a href="javascript:void(0)" @click="onClickGoBack"><img src="../../static/img/ico_closed.png" class="_closed"></a>
		</div>
		<div class="reg_box">
			<div class="input_box">
				<input type="number" v-model="phone" placeholder="请输入手机号">
			</div>
			<div class="input_box">
				<input type="text" v-model="code" placeholder="请输入验证码">
				<div class="send_code" @click="onClickGetSmsCode">获取验证码</div>
			</div>
			<div class="input_box">
				<input type="password" v-model="password" placeholder="密码">
			</div>
			<div class="submitdiv">
				<a href="#" @click="onClickRegisterSubmit">注册</a>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

// main
export default {
	data() {
		return {
			phone: "",
			password: "",
			code: "",
			cookie_uid: this.$global.cookie_uid
		};
	},
	methods: {
		onClickGoBack() {
			this.$router.go(-1);
		},
		onClickGetSmsCode() {
			console.info("clickGetSmsCode happen");
			if(!this.phone){
				this.Toast("手机号码不能为空");
			} else {
				this.ajaxGetSmsCode();
			}
		},
		onClickRegisterSubmit() {
			if(!this.phone){
				this.Toast("手机号码不能为空");
			} else if(!this.code){
				this.Toast("验证码不能为空");
			} else if(!this.password){
				this.Toast("密码不能为空");
			} else {
				this.ajaxRegister();
			}
			return false;
		},
		ajaxGetSmsCode() {
			// 用户模块 - 发送注册短信验证码
			this.$http.post("/api/servers/rJlyvoTyLg", {
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
				console.error(error);
			});
		},
		ajaxRegister() {
			// 用户模块  - 通过手机号码注册
			this.$http.post("/api/servers/registerByPhone", {
				phone: this.phone,
				password: this.password,
				code: this.code,
				invite_code: this.cookie_uid
//				invite_code: !localStorage.uid_a ? "" : localStorage.uid_a
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					this.Toast({
						message: '注册成功，即将自动登录',
						iconClass: 'icon icon-success'
					});
					this.ajaxLogin();
				} else {
					this.Toast(data.message);
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		},
		ajaxLogin() {
			// 和登录页面一样的代码
			this.$http.post('/user/loginPost', {
				phone: this.phone,
				password: this.password
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					data = data.data;
//					this.Toast({
//						message: '登录成功',
//						iconClass: 'icon icon-success'
//					});

					// 写入用户登录信息
					this.$global.user = data;

					// 返回登录前页面
					if(!this.$route.query.back_url) {
						this.$router.push({path: '/u/my'})
					} else {
						this.$router.push({path: this.$route.query.back_url})
					}
				} else {
					console.warn("登录失败！");
					this.Toast(data.message);
				}
			}, function(error){
				console.warn("请求失败！");
				console.error(error);
			});
		}
	}
}
</script>