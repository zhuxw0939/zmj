<template>
	<div class="banner_box_box">
	    <div class="banner_box">
		    <mt-swipe :auto="4000" v-if="bannerData.length>0">
				<mt-swipe-item v-for="item in bannerData"><a :href="item.url"><img :src="item.image" alt=""></a></mt-swipe-item>
			</mt-swipe>
			<img class="default" src="../../static/img/banner_default.png" />
	    </div>
    </div>
</template>

<script type="text/ecmascript-6">

// main
export default {
	data() {
		return {
			bannerData: []
		};
	},
	created() {
		// 首页-banner广告
		this.$http.post("/api/servers/getIndexBanner").then(function(data){
			data = data.body;
			if(data.status==0){
				data = data.data;
				var newArray = [];
				for(let i=0;i<data.length;i++){
					let item = data[i];
					newArray.push({
						image: item.image+"!720x.jpg",
						url: item.link
					})
				}
				this.bannerData = newArray;
			} else {
				console.warn("获取首页-banner广告");
				console.info(data);
			}
		}, function(error){
			console.warn("请求失败！");
			console.error(error);
		});
	}
}

</script>

<style lang="stylus" rel="stylesheet/stylus">

.banner_box_box
	padding 0.3rem
	.banner_box
		position relative
		img
			display block
			width 100%
		img.default
			border-radius 0.15rem
	.mint-swipe
		background #fff
		border-radius 0.15rem
		position absolute
		top 0
		left 0
		z-index 10
		width 100%
		height 100%
		.mint-swipe-indicator
			opacity 0.5
			background #fff
			width 0.25rem
			height 0.25rem
			margin 0 0.05rem
		.is-active
			opacity 1
		.mint-swipe-indicators
			bottom 0.1rem

</style>