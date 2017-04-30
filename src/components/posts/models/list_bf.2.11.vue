<template>

	<div class="page-loadmore-wrapper">
		<mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
			<ul class="game_list" v-infinite-scroll="loadMoreList" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
				<li v-for="item in list" @click="onClick(item.title)">
					<div class="fixed_img">
						<img :src="item.img" alt="">
					</div>
					<div class="fixed_txt">
						<p class="_title _hidden">
							{{item.title}}{{item.title}}
							<span class="goright">
								<img src="./ico_point.png"> <b>10</b>
								<s>分</s>
							</span>
						</p>
						<p class="_des">群主距您28公里 / {{item.des}}</p>
						<p class="_span">
							<span>绵阳麻将</span>
							<span>断勾卡</span>
							<span>血战到底</span>
						</p>
					</div>
				</li>
			</ul>
			<p v-show="loading&&!allLoaded" class="page-infinite-loading">
				<mt-spinner type="snake"></mt-spinner> 拼命加载中
			</p>
			<p v-show="allLoaded" class="page-infinite-loading">没有了...</p>

			<div slot="top" class="mint-loadmore-top">
				<span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
				<span v-show="topStatus === 'loading'">
					<mt-spinner type="snake"></mt-spinner>
				</span>
			</div>

		</mt-loadmore>

		<mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom">
			<div class="picker_box">
				<div class="picker_topbar">
					加入群
					<a href="javascript:void(0)" class="goright" @click="onClosed"><i class="iconfont">&#xe699;</i></a>
				</div>
				<div class="picker_content">
					<div class="_info">
						<span><font><b>5</b>分</font><img src="./ico_numbg.png"></span>
						<p class="_title">绵阳麻将70.80后娱乐群</p>
						<p class="_address"> <i class="iconfont">&#xe621;</i>
							德阳三台县
						</p>
					</div>
					<div class="_code">
						<img src="data:image/png;base64, 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" alt="">
						<!--<img src="/static/img/game/code.png" alt="">-->
						<p>长按二维码加群交流</p>
					</div>
					<div class="_message">
						<div class="user_info">
							<img src="http://tva1.sinaimg.cn/crop.31.78.258.258.180/0067MtiAjw8exi6q3hi0fj308t09zwfa.jpg">群主：土狗
						</div>
						<div class="user_message">本群只打1元，押金50；三台县的优先进群！</div>
					</div>
				</div>
			</div>
		</mt-popup>
	</div>
</template>



<script type="text/babel">
import { MessageBox } from 'mint-ui';

export default {
	data() {
		return {
			list: [],
			page: 1,
			topStatus: '',
			loading: false,
			allLoaded: false,
			popupVisible: false
		};
	},
	methods: {
		// 点击某个代理信息
		onClick(index) {
			console.info("onClick: " + index);
			MessageBox.confirm('查看该信息需要1福利点<font style="color: #fa7600">(当前共有3福利点)</font>，确定查看吗?').then(action => {
				this.onOpen(index);
			});
			return false;
		},
		// 打开某个代理信息层
		onOpen(index) {
			console.info("onOpen: " + index);
			this.popupVisible = true;
		},
		// 关闭某个代理信息层
		onClosed(index) {
			console.info("onClosed: " + index);
			this.popupVisible = false;
			return false;
		},
		// 加载更多
		loadMoreList() {
			console.info("下拉加载更多事件触发: loadMore");

			// 如果没有下一页了则不再请求
			if (this.allLoaded == true) return false;

			this.loading = true;

			setTimeout(() => {
				let lastValue = this.list[this.list.length - 1];
				console.info(lastValue);
				this.$http.post('/getGame', {page: this.page}).then(function (data) {
					if (data.body.length > 0) {
						console.info("-------还有数据----");
						console.info(data.body);
						for (var i = 0; i < data.body.length; i++) {
							this.list.push(data.body[i]);
						}
						this.page++;
					} else {
						console.info("-------没有数据了++++++++++++++++++==----");
						this.allLoaded = true;
					}
				}, function (error) {
					console.info("ajax error");
					console.info(error);
				});
				this.loading = false;
			}, 1500);

		},
		handleTopChange(status) {
			console.info("上拉刷新事件触发: handleTopChange");
			this.topStatus = status;
		},
		loadTop() {
			console.info("上拉刷新事件开始执行: loadTop");
			setTimeout(() => {
				console.info("loadTop over");
				this.$refs.loadmore.onTopLoaded();
			}, 1500);
		}
	},
	created() {
		console.info("----------created--");
		this.$http.post('/getGame', {page: this.page}).then(function (data) {
			if (data.body.length > 0) {
				console.info("-------第一次加载:还有数据++++++++++++++++++==----");
				this.list = data.body;
				this.page++;
			} else {
				console.info("-------第一次加载:没有数据了++++++++++++++++++==----");
				this.allLoaded = true;
			}
		}, function (error) {
			console.info("ajax error");
			console.info(error);
		});
		for (let i = 1; i <= 20; i++) {
			this.list.push(i);
		}
	},
	mounted() {
		console.info("----------mounted--");
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

/*list样式*/
ul.game_list li
	display -webkit-flex
	display flex
	border-bottom solid 1px #e2e2e4
	padding 0.4rem
	.fixed_img
		width 2rem
		height 2rem
		margin-right 0.4rem
		img
			display block
			width 100%
	.fixed_txt
		width 6.8rem
		p
			line-height 1.7em
		p._title
			font-size 0.45rem
			height 0.7rem
			line-height 0.7rem
			overflow hidden
			color #262a2e
			position relative
			padding-right 1.5rem
			span.goright
				display inline-block
				background #fff
				font-size 0.3rem
				*
					display inline-block
					vertical-align middle
				img
					position relative
					margin-right 0.05rem
				b
					font-size 0.4rem
					color #fa7600
				s
					color #999
		p._des
			font-size 0.3rem
			color #61676f
		p._span
			font-size 0.3rem
			color #2088c4
			padding-top 0.1rem
			span
				display inline-block
				padding 0 0.3rem
				border 1px solid #2088c4
				border-radius 0.1rem
				margin-right 0.2rem

/*下拉loading效果*/
.page-infinite-loading
	text-align center
	height 1.5rem
	line-height 1.5rem
	color #bababa
	font-size 0.3rem
	.mint-spinner-snake
		display inline-block
		vertical-align middle
		margin-right 0.1rem
		width 0.35rem!important
		height 0.35rem!important
		position relative
		top -0.05rem

/*上拉刷新效果*/
.mint-loadmore
	.mint-loadmore-top span
		display inline-block
		-webkit-transition .2s linear
		transition .2s linear
		vertical-align middle
		font-size 0.35rem
		color #bababa
	span.is-rotate
		-webkit-transform rotate(180deg)
		transform rotate(180deg)
	.mint-loadmore-top .mint-spinner-snake
		width 0.35rem!important
		height 0.35rem!important


/*弹出的代理信息*/
.mint-popup
	width 100%
.picker_topbar
	padding 0.3rem
	border-bottom 1px solid #fc8048
	position relative
	.goright
		top 0.3rem
		right 0.3rem
		i.iconfont
			font-size 0.6rem
			color #bababa
.picker_content
	._info
		position relative
		height 2rem
		padding-left 1.9rem
		overflow hidden
		span
			display inline-block
			position absolute
			top 0
			left 0.5rem
			width 1.1rem
			height 1.2rem
			padding-top 0.2rem
			font-size 0.3rem
			color #fff
			text-align center
			font
				position relative
				z-index 10
			img
				width 1.1rem
				position absolute
				top 0
				left 0
			b
				font-size 0.6rem
		p._title
			font-size 0.45rem
			color #4e4e4e
			padding-top 0.21rem
		p._address
			font-size 0.3rem
			color #666
			i.iconfont
				font-size 0.4rem
				color #999
				margin-right 0.2rem
	._code
		text-align center
		img
			width 4rem
		p
			font-size 0.35rem
			color #999
	._message
		padding 0.5rem
		.user_info
			line-height 0.8rem
			img
				display line-height
				vertical-align middle
				width 0.8rem
				margin-right 0.2rem
		.user_message
			background #dbf0fc
			color #2088c4
			padding 0.3rem
			margin-top 0.5rem
			border-radius 0.15rem
			position relative
		.user_message:after
			content ""
			width 0
			height 0
			border 0.2rem solid transparent
			border-bottom-color #dbf0fc
			margin-top 1px
			position absolute
			top -0.4rem
			left 0.3rem

</style>

