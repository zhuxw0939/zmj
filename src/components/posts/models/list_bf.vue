<template>

	<div class="page-loadmore-wrapper">
		<mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
			<ul class="game_list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="200">
				<li v-for="item in list" @click="onClick(item.title)">
					<div class="item_img">
						<img :src="item.img" alt="">
					</div>
					<div class="item_txt">
						<p class="_title _hidden">{{item.title}}{{item.title}} <span class="goright"><img src="./ico_point.png"><b>10</b><s>分</s></span></p>
						<p class="_des">群主距您28公里 / {{item.des}}</p>
						<p class="_span"><span>绵阳麻将</span><span>断勾卡</span><span>血战到底</span></p>
					</div>
				</li>
			</ul>
			<p v-show="loading&&!allLoaded" class="page-infinite-loading">
				<mt-spinner type="fading-circle"></mt-spinner>
				加载中...
			</p>
			<p v-show="allLoaded" class="page-infinite-loading">
				没有数据了...
			</p>

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
					<a href="#" class="goright" @click="onCancel"><i class="iconfont">&#xe699;</i></a>
				</div>
				<div class="picker_content">
					<div class="_info">
						<span><font><b>5</b>分</font> <img src="./ico_numbg.png"></span>
						<p class="_title">绵阳麻将70.80后娱乐群</p>
						<p class="_address"><i class="iconfont">&#xe621;</i>德阳三台县</p>
					</div>
					<div class="_code">
						<img src="/static/img/game/code.png" alt="">
						<p>长按二维码加群交流</p>
					</div>
					<div class="_message">
						<div class="user_info">
							<img src="http://tva1.sinaimg.cn/crop.31.78.258.258.180/0067MtiAjw8exi6q3hi0fj308t09zwfa.jpg">群主：土狗
						</div>
						<div class="user_message">
							本群只打1元，押金50；三台县的优先进群！
						</div>
					</div>
				</div>
			</div>
		</mt-popup>
	</div>

</template>

<script>

export default {
	data() {
		return {
			popupVisible: false,
			list: [],
			page: 1,
			bottomStatus: '',
			loading: false,
			allLoaded: false,
			wrapperHeight: 0
		};
	},

	methods: {
		onClick(index) {
			console.info("click: "+index);
			console.info("222");
			this.popupVisible=true;
		},
		onSure() {
			this.popupVisible = false;
			console.info(this.defaultData);
		},
		onCancel() {
			this.popupVisible = false;
			this.defaultData = [];
			console.info(this.defaultData);
		},

		handleTopChange(status) {
			this.topStatus = status;
		},

		loadMore() {
			if(this.allLoaded==true) return false;
			this.loading = true;
			setTimeout(() => {
				let lastValue = this.list[this.list.length - 1];
				console.info(lastValue);

				this.$http.post('/getGame', { page:this.page }).then(function(data){
					if ( data.body.length>0 ) { //表示还有数据
						console.info("-------还有数据----");
						console.info(data.body);
						for(var i=0;i<data.body.length;i++){
							this.list.push(data.body[i]);
						}
						this.page++;
					} else { //没有数据了
						console.info("-------没有数据了++++++++++++++++++==----");
						this.allLoaded = true;
						// Toast('没有数据了');
					}
				}, function(error){
					console.info("ajax error");
					console.info(error);
				});
				this.loading = false;
			}, 1500);
		},


		handleBottomChange(status) {
			console.info("handleBottomChange come : "+status+"----");
			this.bottomStatus = status;
		},

		loadBottom() {
			console.info("loadBottom come "+status+"+++++++++++");
			setTimeout(() => {
				let lastValue = this.list[this.list.length - 1];
				console.info(lastValue);

				this.$http.post('/getGame', { page:this.page }).then(function(data){
					if ( data.body.length>0 ) { //表示还有数据
						console.info("-------还有数据----");
						console.info(data.body);
						for(var i=0;i<data.body.length;i++){
							this.list.push(data.body[i]);
						}
						this.page++;
					} else { //没有数据了
						console.info("-------没有数据了++++++++++++++++++==----");
						this.allLoaded = true;
//						Toast('没有数据了');
					}
				}, function(error){
					console.info("ajax error");
					console.info(error);
				});
				this.$refs.loadmore.onBottomLoaded();
			}, 1500);
		}
	},

	created() {
		console.info("----------created--");

		this.$http.post('/getGame', { page:this.page }).then(function(data){
			if ( data.body.length>0 ) { //表示还有数据
				this.list=data.body;
				this.page++;
			} else { //没有数据了
				console.info("-------没有数据了++++++++++++++++++==----");
				this.allLoaded = true;
			}
		}, function(error){
			console.info("ajax error");
			console.info(error);
		});

		for (let i = 1; i <= 20; i++) {
			this.list.push(i);
		}


	},

	mounted() {
		console.info("----------mounted--");
//		this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

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





.mint-loadmore {
	overflow: hidden
}
.mint-loadmore-content {}
.mint-loadmore-content.is-dropped {
	-webkit-transition: .2s;
	transition: .2s
}
.mint-loadmore-top, .mint-loadmore-bottom {
	text-align: center;
	height: 0.8rem;
	line-height: 0.8rem;
}
.mint-loadmore-top {
	margin-top: -0.8rem;
}
.mint-loadmore-bottom {
	margin-bottom: -0.8rem;
}
.mint-loadmore-spinner {
	display: inline-block;
	margin-right: 0.1rem;
	vertical-align: middle
}
.mint-loadmore-text {
	vertical-align: middle
}


.page-loadmore .mint-spinner {
	display: inline-block;
	vertical-align: middle;
}
.page-loadmore-desc {
	text-align: center;
	color: #666;
	padding-bottom: 0.1rem;
}
.page-loadmore-desc:last-of-type {
	border-bottom: solid 1px #eee;
}


.game_list li {
	display: -webkit-flex;
	display: flex;
	border-bottom: solid 1px #e2e2e4;
	padding: 0.4rem;
}
.game_list li:first-child {
}
.game_list li .item_img {
	width: 2rem;
	height: 2rem;
	margin-right 0.4rem
}
.game_list li .item_img img {
	display: block;
	width: 100%;
}
.game_list li .item_txt {
	width 6.8rem
}
.game_list li .item_txt p {
	line-height: 1.7em;
}
.game_list li .item_txt p._title {
	font-size: 0.45rem;
	height 0.7rem
	line-height 0.7rem
	overflow hidden
	color: #262a2e;
	position: relative
	padding-right 1.5rem
}
.game_list li .item_txt p._title span.goright {
	display inline-block
	background #fff
	font-size 0.3rem
}
.game_list li .item_txt p._title span.goright img {
	display inline-block
	vertical-align middle
	position relative
	margin-right 0.05rem
}
.game_list li .item_txt p._title span.goright b {
	display inline-block
	vertical-align middle
	font-size 0.4rem
	color #fa7600
}
.game_list li .item_txt p._title span.goright s {
	display inline-block
	vertical-align middle
	color #999
}
.game_list li .item_txt p._des {
	font-size: 0.3rem;
	color: #61676f;
}
.game_list li .item_txt p._span {
	font-size: 0.3rem;
	color: #2088c4;
	padding-top: 0.1rem;
}
.game_list li .item_txt p._span span {
	display: inline-block;
	padding: 0 0.3rem;
	border: 1px solid #2088c4;
	border-radius: 0.1rem;
	margin-right: 0.2rem;
}

.page-loadmore-wrapper {
	/*overflow: scroll;*/
}
.mint-loadmore-bottom span {
	display: inline-block;
	-webkit-transition: .2s linear;
	transition: .2s linear;
	vertical-align: middle
}
.mint-loadmore-bottom span.is-rotate {
	-webkit-transform: rotate(180deg);
	transform: rotate(180deg);
}


.page-infinite-loading {
	text-align: center;
	height: 1.5rem;
	line-height: 1.5rem;
}
.page-infinite-loading div {
	display: inline-block;
	vertical-align: middle;
	margin-right: 0.05rem;
}



.mint-loadmore {
	overflow: hidden
}
.mint-loadmore-content {}
.mint-loadmore-content.is-dropped {
	-webkit-transition: .2s;
	transition: .2s
}
.mint-loadmore-top, .mint-loadmore-bottom {
	text-align: center;
	height: 50px;
	line-height: 50px
}
.mint-loadmore-top {
	margin-top: -50px
}
.mint-loadmore-bottom {
	margin-bottom: -50px
}
.mint-loadmore-spinner {
	display: inline-block;
	margin-right: 5px;
	vertical-align: middle
}
.mint-loadmore-text {
	vertical-align: middle
}


</style>
