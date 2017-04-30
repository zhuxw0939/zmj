<template>

	<div class="page-loadmore-wrapper">

		<mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom">
			<div class="picker_box" v-if="popupData">
				<div class="picker_topbar">
					加入 {{popupData.sp.name}} 游戏群
					<a href="javascript:void(0)" class="goright" @click="onClickClosedDetail"><i class="iconfont">&#xe699;</i></a>
				</div>
				<div class="picker_content">
					<div class="_info">
						<span><font><b>{{popupData.score}}</b>分</font><img src="./ico_numbg.png"></span>
						<p class="_title">{{popupData.group_name}}</p>
						<p class="_address"> <i class="iconfont">&#xe621;</i>
							{{popupData.loc.loc_provinces}} {{popupData.loc.loc_city}} {{popupData.loc.loc_area}}
						</p>
					</div>
					<div class="_code">
						<img :src="'//pan.baidu.com/share/qrcode?w=240&h=240&url='+popupData.weixin.url" @click="onClickOpenCode('http://pan.baidu.com/share/qrcode?w=240&h=240&url='+popupData.weixin.url+'&cod.png')">
						<p>{{infoMessage}}</p>
					</div>
					<div class="_message">
						<!--<div class="user_info">
							<img :src="popupData.user" v-if="popupData.user">
							<img src="./user.png" v-else>
							群主：群主名称todo
						</div>-->
						<div class="user_message">{{popupData.summary}}</div>
					</div>
				</div>
			</div>
		</mt-popup>
	</div>
</template>



<script type="text/javascript">
export default {
	props: {
		_id: {
			type: String,
			default: ""
		},
		is_pay: {
			type: Number,
			default: 0
		},
		call_back: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			infoMessage: "长按二维码加群主交流",
			popupVisible: false,
			popupData: false
		};
	},
	watch: {
		_id: "onChangeId"
	},
	created() {
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		console.info('是否是Android：'+isAndroid);
		console.info('是否是iOS：'+isiOS);
		if(isiOS){
			this.infoMessage = "点击图片，长按二维码加群主交流";
		}
	},
	mounted() {
	},
	methods: {
		onChangeId(data1, data2) {
			console.info(" *** onChangeId *** ");
			console.info(data1);
			console.info(data2);
			if(data1==""){
				return false
			}
			let _id = this._id;
			console.info(_id);
			console.info(this.is_pay);

			// 需要支付
			if(this.is_pay===0){
				// 查询钱包余额
				this.$http.post("/api/servers/vbankGetMyFees", {
				}).then(function(data){
					data = data.body;
					let _this = this;
					if(data.status==0){
						data = data.data;
						_this.Indicator.close();

						this.MessageBox.confirm('查看该信息需要 <font style="color: #fa7600">1</font> 福利点<br>您剩余福利点数为：<font style="color: #fa7600">'+data.fees+'</font>').then(function(){
							if(data.fees<=0){
								// 余额不足，跳至充值页面
								window.location.href = "/user/recharge"
							} else {
								// 余额充足，打开某个代理信息层
								_this.Indicator.open();
								_this.ajaxGetGamesDetail(_id);
							}
						}, function() {
							// 取消
							try{
								if(_this.call_back.backFunction&&typeof(_this.call_back.backFunction)=="function"){
									_this.call_back.backFunction(_this.call_back._this);
								}
							}catch(error){
								console.warn(error);
							}
						});
						if(data.fees<=0){
							$(".mint-msgbox-confirm").text("充值");
						}
					} else if(data.status==2) {
						window.location.href = "/user/login";
					} else {
						this.Indicator.close();
						console.info("返回错误");
					}
				}, function(error){
					this.Indicator.close();
					console.info("返回失败："+error);
				});
			} else {
				console.info("不需求支付");
				this.ajaxGetGamesDetail(_id);
			}

			return false;
			// ajax获取当前福利点，够用时提示是否查看，不够用时直接提示
			// todo

		},
		// 关闭某个代理信息层
		onClickClosedDetail(index) {
			console.info("onClickClosedDetail: " + index);
			this.popupVisible = false;
			try{
				if(this.call_back.backFunction&&typeof(this.call_back.backFunction)=="function"){
					this.call_back.backFunction(this.call_back._this, 1);
				}
			}catch(error){
				console.warn(error);
			}

			// abc();
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
				this.Indicator.close();
			}, function(error){
				console.info("返回失败"+error);
			});
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

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
			left 48%
</style>