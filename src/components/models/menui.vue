<template>
	<div class="menui" @click="onClick">
		<img class="ico_left" v-if="image=='ico_my_money'" src="../../static/img/ico_my_money.png">
		<img class="ico_left" v-if="image=='ico_my_list'" src="../../static/img/ico_my_list.png">
		<img class="ico_left" v-if="image=='ico_my_top'" src="../../static/img/ico_my_top.png">
		<img class="ico_left" v-if="image=='ico_my_time'" src="../../static/img/ico_my_time.png">
		<img class="ico_left" v-if="image=='ico_my_kf'" src="../../static/img/ico_my_kf.png">
		{{txt}}
		<span class="feesbtn" v-if="feesbtn=='true'" @click.stop="onClickRecharge">充值</span>
		<span class="goright" :class="{goright_img:link}">
			{{rtxt}}
			<img class="ico_right" v-if="link" src="../../static/img/ico_my_out.png">
		</span>
		<div v-if="border" class="_border"></div>
	</div>
</template>

<script type="text/javascript">
export default {
	props: {
		txt: {
			type: String,
			default: ""
		},
		rtxt: {
			type: String,
			default: ""
		},
		image: {
			type: String,
			default: "ico_my_money"
		},
		link: {
			type: String,
			default: ""
		},
		border: {
			type: String,
			default: "1"
		},
		feesbtn: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			dataId: ""
		};
	},
	mounted() {
	},
	methods: {
		onClick() {
			if(this.link!=""){
				this.$router.push({path: this.link})
				// window.location.href=this.link;
			}
		},
		onClickRecharge() {
			// window.location.href='/user/recharge'
			this.$router.push({path: "/u/myrecharge"})
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.menui
	line-height 0.55rem
	position relative
	padding 0.4rem 1.2rem
	img.ico_left
		position absolute
		width 0.55rem
		height 0.55rem
		top 0.4rem
		left 0.4rem
	.goright
		line-height 0.55rem
		top 0.4rem
		right 0.4rem
	.goright_img
		padding-right 0.7rem
		img.ico_right
			width 0.55rem
			height 0.55rem
			position absolute
			top 0.03rem
			right 0
	._border
		width 88%
		height 1px
		position absolute
		bottom 0
		right 0
		background #ececec
	span.feesbtn
		display inline-block
		background #fc8048
		padding 0 0.6rem
		color #fff
		border-radius 0.1rem
		line-height 0.7rem
		position absolute
		top 0.3rem
		right 3.2rem

</style>
