<template>
	<div class="page_mypage">
		<div class="rewater_top">
			<h4>福利点消费记录</h4>
			<p>余额：{{myFeesNumber}}福利点</p>
		</div>

		<div class="rewater_list">
			<ul class="cf">
				<li v-for="item in myFeesData">
					<p class="_time _hidden">{{item.create_at}}</p>
					<p class="_title _hidden">{{item.summary}}</p>
					<p class="_fees">{{item.fees}}</p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

// main
export default {
	name: 'my',
	data() {
		return {
			myFeesData: [],
			myFeesNumber: "0"
		}
	},
	created() {
		this.ajaxGetMyInfo();
	},
	methods: {
		ajaxGetMyInfo() {
			this.$http.post("/user/getMyFeesWater").then(function(data){
				data = data.body;
				if(data.status==0){
					data = data.data;
					if(data.myFees && data.myFees.fees){
						this.myFeesNumber = String(data.myFees.fees)
					}
					this.myFeesData = data.myFeesList
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
</style>