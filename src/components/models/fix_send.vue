<template>

	<div class="send_box" @click="onClickSendRecruit">
		<a href="javascript:void(0)" v-if="text"><font>{{text}}</font></a>
		<a href="javascript:void(0)" v-else>你是麻将游戏代理？来<font>免费发布</font>招募麻将爱好者吧！</a>
	</div>

</template>

<script>
export default {
	props: {
		user: {
			type: String,
			default: ""
		},
		text: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
		};
	},
	created() {
	},
	mounted() {
	},
	methods: {
		onClickSendRecruit() {
			console.info("onClickSendRecruit");
			if(this.$global.user){
				// 用户模块 - 我发布的麻将
				this.$http.post("/api/servers/userGetMyRecruit", {
					page: 0
				}).then(function(data){
					data = data.body;
					if(data.status==0){
						data = data.data;
						if(data.length>0){
							let editIndex = -1;
							for(var i=0;i<data.length;i++){
								if(data[i].step==1 || data[i].step==2 || data[i].step==3 || data[i].step==6){
									editIndex = i;
									break;
								}
							}
							if(editIndex===-1){
								this.$router.push({path: '/p/step'})
							} else {
								this.messageBoxGoEditRecruit(data[editIndex]._id, data[editIndex].step);
							}
						} else {
							this.$router.push({path: '/p/step'})
						}
					} else {
						console.info("返回错误");
					}
				}, function(error){
					console.info("返回失败"+error);
				});
			} else {
				this.$router.push({path: '/u/login', query: { back_url: "/p/step" }})
			}
		},
		messageBoxGoEditRecruit(_id, step) {
			this.MessageBox({
				title: '操作提示',
				message: '您当前有未完成的招募信息，是否继续进行发布？放弃则自动清空未完成的招募信息。',
				showConfirmButton: true,
				confirmButtonText: "继续发布",
				showCancelButton: true,
				cancelButtonText: "放弃"
			}).then(action => {
				if(action=="confirm"){
					this.$router.push({path: '/p/step', query: { id: _id, step: step }})
				} else if(action=="cancel") {
					console.info("这儿应该删除掉这个未完成信息");
					console.info(_id);
					// TODO 这儿应该删除掉这个未完成信息
					// 招募信息-删除我发布的招募信息
					this.$http.post("/api/servers/deleteMyRecruit", {
						id: _id
					}).then(function(data){
						data = data.body;
						if(data.status==0){
							this.$router.push({path: '/p/step'})
						} else {
							console.info("删除失败！");
						}
					}, function(error){
						console.info("返回失败："+error);
					});
				}
			})
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.send_box
	a
		display block
		text-align center
		padding 0.5rem 0
		font-size 0.35rem
		font
			color #fc8048
			padding 0 0.15rem

</style>
