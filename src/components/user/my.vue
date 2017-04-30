<template>
	<div class="page_myindex">

		<div class="my_box" v-if="user">
			<div class="myindex_top">
				<div class="item_img">
					<img src="http://tva3.sinaimg.cn/crop.111.0.373.373.180/bd65378dgw1e7qcxme457j20dw0afq3x.jpg" >
				</div>
				<div class="item_txt">
					<p class="_title">{{user.name}}</p>
					<p class="_info">注册时间：{{user.create_at}}</p>
				</div>
			</div>
			<menui :txt="'福利点：'+myFeesNumber" rtxt="消费记录" image="ico_my_money" link="/u/myfeeswater" border="0" feesbtn="true"></menui>
			<div class="br"></div>
			<menui txt="我发布的" :rtxt="recruitDataNumber" image="ico_my_list" link="/u/mysendlist"></menui>
			<menui txt="我的置顶" rtxt="0" image="ico_my_top" link="#"></menui>
			<menui txt="我看过的" :rtxt="myBuysDataNumber" image="ico_my_time" link="/u/myhistory" border="0"></menui>
			<div class="br"></div>
			<menui txt="联系客服" rtxt="微信号：majiang778" image="ico_my_kf" border="0"></menui>
			<div class="br"></div>
			<div class="menui_logout">
				<a href="/user/logout">退出登录</a>
			</div>
		</div>

		<div class="my_box" v-else>
			<div class="myindex_top_nologin">
				<p>
					<router-link to="/u/login">登录</router-link>
					<i>/</i>
					<router-link to="/u/register">注册</router-link>
				</p>
				<div class="info">登录后查看我的信息</div>
			</div>
			<div class="br"></div>
			<menui txt="联系客服" rtxt="微信号：majiang778" image="ico_my_kf" border="0"></menui>
		</div>

		<footmenu current="my"></footmenu>
	</div>
</template>

<script type="text/ecmascript-6">

// import
import Footmenu from '../common/footmenu'
import Menui from '../models/menui'

// main
export default {
	name: 'my',
	components: { Footmenu, Menui },
	data() {
		return {
			user: "",
			recruitDataNumber: "0",
			myBuysDataNumber: "0",
			myFeesNumber: "0"
		}
	},
	created() {
		this.user = this.$global.user;

		this.ajaxGetMyInfo();
	},
	methods: {
		ajaxGetMyInfo() {
			this.$http.post("/user/getMyInfo").then(function(data){
				data = data.body;
				if(data.status==0){
					data = data.data;
					if(data.myFees && data.myFees.fees){
						this.myFeesNumber = String(data.myFees.fees)
					}
					if(data.recruitData.length>0){
						this.recruitDataNumber = String(data.recruitData.length)
					}
					if(data.myBuysData.length>0){
						this.myBuysDataNumber = String(data.myBuysData.length)
					}
				} else {
					console.warn("获取个人信息错误");
					console.info(data);
				}
			}, function(error){
				console.warn("请求失败！");
				console.error(error);
			});
		}
	}
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
.page_myindex
	position absolute
	top 0
	left 0
	width 100%
	height 100%
	background #f6f6f6
	min-height 100%
	.my_box
		background #fff
	footer
		height 0
</style>