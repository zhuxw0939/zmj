<template>
	<div class="page_login">
		<div class="login_top">
			<img src="../../static/img/login_bg.jpg" class="_bg">
			<div class="_logo">
				<img src="../../static/img/logo.png">
			</div>
			<div class="_tabs">
				<router-link to="/u/login" class="current">登录</router-link>
				<router-link to="/u/register">注册</router-link>
			</div>
			<a href="javascript:void(0)" @click="onClickGoBack"><img src="../../static/img/ico_closed.png" class="_closed"></a>
		</div>
		<div class="reg_box">
			<div class="input_box">
				<input type="number" v-model="phone" placeholder="请输入手机号">
			</div>
			<div class="input_box">
				<input type="password" v-model="password" placeholder="请输入密码">
			</div>
			<div class="submitdiv">
				<a href="#" @click="onClickLoginSubmit">登 录</a>
			</div>
			<div class="others">
				<router-link to="/u/resetPassword">忘记密码？</router-link>
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
			password: ""
		};
	},
	created() {
		console.info("created login");
		console.info(this.$global.user);
	},
	mounted() {
	},
	methods: {
		onClickGoBack() {
			this.$router.go(-1);
		},
		onClickLoginSubmit() {
			if(!this.phone){
				this.Toast("手机号码不能为空");
			} else if(!this.password){
				this.Toast("密码不能为空");
			} else {
				this.ajaxLogin();
			}
		},
		ajaxLogin() {
			this.$http.post('/user/loginPost', {
				phone: this.phone,
				password: this.password
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					data = data.data;
					this.Toast({
						message: '登录成功',
						iconClass: 'icon icon-success'
					});

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