<template>

	<div class="page-loadmore-wrapper">
		<div class="list_box" v-if="hasListData">
			<ul class="game_list" v-infinite-scroll="loadMoreList" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
				<li v-for="item in list" @click="onClickGetDetail(item._id)">
					<div class="fixed_img">
						<img :src="item.img" v-if="item.img">
						<img src="./game.png" v-else>
					</div>
					<div class="fixed_txt">
						<p class="_title _hidden">
							{{item.group_name}}
							<span class="goright">
								<img src="./ico_point.png"><b>{{item.score}}</b><s>分</s>
							</span>
						</p>
						<p class="_des">群主距您28公里 / {{item.loc.loc_provinces}} {{item.loc.loc_city}} {{item.loc.loc_area}}</p>
						<p class="_span">
							<span v-for="type in item.play_types">{{type}}</span>
						</p>
					</div>
				</li>
			</ul>
			<p v-show="loading&&!allLoaded" class="page-infinite-loading">
				<mt-spinner type="snake"></mt-spinner> 拼命加载中
			</p>
			<p v-show="allLoaded" class="page-infinite-loading">没有了...</p>
		</div>
		<div class="list_box_nodata" v-else>
			抱歉，没有查询到数据！
		</div>

		<mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom">
			<div class="picker_box" v-if="popupData">
				<div class="picker_topbar">
					加入群
					<a href="javascript:void(0)" class="goright" @click="onClickClosedDetail"><i class="iconfont">&#xe699;</i></a>
				</div>
				<div class="picker_content">
					<div class="_info">
						<span><font><b>5</b>分</font><img src="./ico_numbg.png"></span>
						<p class="_title">{{popupData.group_name}}</p>
						<p class="_address"> <i class="iconfont">&#xe621;</i>
							{{popupData.loc.loc_provinces}} {{popupData.loc.loc_city}} {{popupData.loc.loc_area}}
						</p>
					</div>
					<div class="_code">
						<img :src="'//pan.baidu.com/share/qrcode?w=240&h=240&url='+popupData.weixin.url" @click="onClickOpenCode('http://pan.baidu.com/share/qrcode?w=240&h=240&url='+popupData.weixin.url+'&cod.png')">
						<p>长按二维码加群交流</p>
					</div>
					<div class="_message">
						<div class="user_info">
							<img :src="popupData.user" v-if="popupData.user">
							<img src="./user.png" v-else>
							群主：群主名称todo
						</div>
						<div class="user_message">{{popupData.summary}}</div>
					</div>
				</div>
			</div>
		</mt-popup>
	</div>
</template>



<script type="text/javascript">

// 引入自定义组件
import Detail from '../list/detail'

Vue.component('detail', Detail);

export default {
	props: {
	},
	data() {
		return {
			tabsData: false,
			list: [],
			hasListData: true, // 是否有数据列表，默认有，ajax查询后如果没有，则改为无，提示用户"没有查询到数据"
			page: 1,
			loading: false,
			allLoaded: false,
			popupVisible: false,
			popupData: false
		};
	},
	created() {
		console.info("----------created list--");
	},
	mounted() {
		console.info("----------mounted list--");
	},
	methods: {
		// 点击某个代理信息
		onClickGetDetail(_id) {
			console.info("onClick: " + _id);

			// ajax获取当前福利点，够用时提示是否查看，不够用时直接提示
			// todo
			this.MessageBox.confirm('查看该信息需要1福利点<font style="color: #fa7600">(当前共有3福利点)</font>，确定查看吗?').then(action => {
				// 打开某个代理信息层
				this.ajaxGetGamesDetail(_id);
			});
		},
		// 关闭某个代理信息层
		onClickClosedDetail(index) {
			console.info("onClickClosedDetail: " + index);
			this.popupVisible = false;
		},
		// 加载更多
		loadMoreList() {

			console.info("下拉加载更多事件触发: loadMore");

			// 如果没有下一页了则不再请求
			if (this.allLoaded == true) return false;

			// 开始加载
			this.loading = true;
			this.ajaxGetGamesList();
		},
		tabsDataChange(tabs) {
			console.info("tabsDataChange+++ 查询条件发生变化，清空已有数据，重新加载新数据");
			console.info(JSON.stringify(tabs));

			this.list = [];
			this.loading = true;
			this.page = 0;
			this.allLoaded = false;
			this.tabsData = tabs;
			this.ajaxGetGamesList();
		},
		// 微信打开二维码
		onClickOpenCode(url) {
			var showimgs = [];
			showimgs.push(url);
			this.imagePreview(showimgs[0], showimgs);
		},
		imagePreview(curSrc, srcList) {
			console.info(curSrc);
			console.info(srcList);
			//这个检测是否参数为空
			if(!curSrc || !srcList || srcList.length == 0) {
				return;
			}
			//JsAPI-调用微信图片浏览器
			WeixinJSBridge.invoke('imagePreview', {
				'current' : curSrc,
				'urls' : srcList
			});
		},
		ajaxGetGamesList() {

			if(this.tabsData==undefined || !this.tabsData){
				console.info("ajaxGetGamesList 没有找到查询条件，自动退出");
				return false;
			}

			console.info("ajaxGetGamesList start");
			console.info("page:"+this.page);
			console.info("tabsData:"+JSON.stringify(this.tabsData));

			// 添加1秒的延迟，上线删除
			setTimeout(() => {
				// 招募信息-获取列表
				this.$http.post("/api/servers/getRecruitList", {
					page: this.page,
//					loc_provinces: "String",
//					loc_city: "String",
//					loc_area: "String",
//					score: "Number",
//					is_validate: "Number",
//					mj_sp: "String",
					lat: localStorage.location!=""?JSON.parse(localStorage.location).point.x:"",
					lng: localStorage.location!=""?JSON.parse(localStorage.location).point.y:""
				}).then(function(data){
					data = data.body;
					console.info(JSON.stringify(data));
					console.info(data);
					if (data.status==0) {
						if(data.data.length>0){
							console.info("-------还有数据----");
							console.info(data.data);
							for (var i = 0; i < data.data.length; i++) {
								this.list.push(data.data[i]);
							}
							this.page++;
						} else {
							console.info("-------没有数据了++++++++++++++++++==----");
							this.allLoaded = true;
						}
					} else {
						console.info(data);
						console.info("-------数据返回错误++++++++++++++++++==----");
						this.allLoaded = true;
					}
					// 关闭加载动画
					this.loading = false;
					if(this.list.length==0) this.hasListData = false;
				}, function(error){
					console.info("返回失败"+error);
					// 关闭加载动画
					this.loading = false;
					if(this.list.length==0) this.hasListData = false;
				});
			}, 1500);

		},
		ajaxGetGamesDetail(_id) {

			// 招募信息-获取招募详情
			this.$http.post("/api/servers/getRecruitDetail", {
				id: _id,
				must_login: true
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					this.popupData = data.data;
					this.popupVisible = true;
				} else if(data.status==8){
					console.info(data);
					window.location.href="/user/login";
				} else {
					console.info(data);
					console.info(data.message);
				}
			}, function(error){
				console.info("返回失败"+error);
			});
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

/*list样式*/
.list_box_nodata
	padding 5rem 0
	text-align center
	color #bbb
ul.game_list
	min-height 5rem
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

