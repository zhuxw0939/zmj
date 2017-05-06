<template>

	<div class="page-loadmore-wrapper">
		<div class="list_box">
			<ul class="game_list" v-infinite-scroll="loadMoreList" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
				<li v-for="(item, index) in list" @click="onClickGetDetail(item, index)">
					<div class="fixed_box">
						<div class="fixed_img">
							<img :src="item.sp.image+'!720x.png'" v-if="item.sp && item.sp.image">
							<img src="./game.png" v-else>
						</div>
						<div class="fixed_txt">
							<p class="_title _hidden">
								{{item.group_name}}
								<span class="goright">
									<img src="./ico_point.png"><b>{{item.score}}</b><s>分</s>
								</span>
							</p>
							<!--附近的-->
							<p class="_des" v-if="ajax=='getSideRecruitList'">群主距您{{item.distance}} <font color="#2088c4" v-if="item.is_validate" @click.stop="onClickLookValidate">&nbsp;&nbsp;已认证 </font></p>
							<p class="_des" v-else><img class="_ico" src="./ico_face.png" v-if="item.loc.loc_provinces">{{item.loc.loc_provinces}} {{item.loc.loc_city}} {{item.loc.loc_area}} <font color="#2088c4" v-if="item.is_validate" @click.stop="onClickLookValidate">&nbsp;&nbsp;已认证 </font></p>
							<p class="_span">
								<span v-for="type in item.play_types" @click.stop="onClickGetPlayTypes(type)">{{type}}</span>
							</p>
						</div>
					</div>
					<!--我发布的-->
					<div class="fot_box" v-if="ajax=='userGetMyRecruit'" @click.stop="onClickMySendRecruit(item)">
						<p v-if="item.status==0"><i class="_r _r_orange"></i>发布资料不完整  您可以<a href="javascript:void(0)">继续发布</a><span class="goright" @click.stop="onClickDeleteMySendRecruit(item._id)">删除</span></p>
						<p v-else-if="item.status==1"><i class="_r _r_blue"></i>审核中，您可以<a href="javascript:void(0)">催一下小编</a><span class="goright" @click.stop="onClickDeleteMySendRecruit(item._id)">删除</span></p>
						<p v-else-if="item.status==3"><i class="_r _r_red"></i>审核未通过  您可以<a href="javascript:void(0)">重新发布</a><span class="goright" @click.stop="onClickDeleteMySendRecruit(item._id)">删除</span></p>
						<p v-else><i class="_r _r_green"></i>审核已通过  您可以<a href="javascript:void(0)">点击查看</a></p>
						<div class="br"></div>
					</div>
				</li>
			</ul>
			<div class="list_box_nodata" v-if="list.length==0&&!loading" @click="onClickReload">
				<span v-if="ajax=='getSideRecruitList'">抱歉！数据为空，点击重试。</span>
				<span v-else>抱歉！数据为空，点击刷新。</span>
			</div>
			<p v-show="loading&&!allLoaded" class="page-infinite-loading">
				<mt-spinner type="snake"></mt-spinner> 拼命加载中
			</p>
			<p v-show="allLoaded" class="page-infinite-loading"><!--没有了...--></p>
		</div>
	<!--	<div class="list_box_nodata" v-else>
			抱歉，没有查询到数据！
		</div>-->
		<detail :_id="detailId" :is_pay="detailIsPay" :call_back="closeDetailCallBack"></detail>

	</div>
</template>

<script type="text/javascript">

// 引入自定义组件
import Detail from './detail'

export default {
	props: {
		ajax: {
			type: String,
			default: "getRecruitList"
		},
		types: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			tabsData: false,
			list: [],
			hasListData: true, // 是否有数据列表，默认有，ajax查询后如果没有，则改为无，提示用户"没有查询到数据"
			page: 1,
			loading: false,
			allLoaded: false,

			closeDetailCallBack: {
				_this: this,
				_index: this,
				backFunction: function (_this, type) {
					console.info(" backFunction !");
					_this.detailId = "";
					if(type!=undefined && type==1){
						console.info(" backFunction 222 !");
						console.info(this.detailIndex);
						console.info(_this.list[_this.detailIndex]);
						_this.list[_this.detailIndex].is_pay = 1;
					}
				}
			},

			detailId: "",
			detailIsPay: 0
		};
	},
	components: { Detail },
	created() {
		// console.info("----------created list--");
	},
	mounted() {
		// console.info("----------mounted list--");
	},
	methods: {
		// 查询条件发生变化
		tabsDataChange(tabs) {
			 console.info("tabsDataChange+++ 查询条件发生变化，清空已有数据，重新加载新数据");
			 console.info(tabs);

			this.list = [];
			this.loading = true;
			this.page = 0;
			this.allLoaded = false;
			this.tabsData = tabs;
			this.ajaxGetGamesList();
		},
		// 加载更多
		loadMoreList() {

			 console.info("下拉加载更多事件触发: loadMore");

			// 如果没有下一页了则不再请求
			if (this.allLoaded == true){
				console.info("没有下一页了不再请求："+this.allLoaded);
				return false;
			}
			console.info("有下一页，发送请求："+this.allLoaded);

			// 开始加载
			this.loading = true;
			this.ajaxGetGamesList();
		},
		// 招募详情
		onClickGetDetail(item, index) {
			console.info(" *** onClickGetDetail ***");
			console.info(item);
			this.detailId = item._id;
			this.detailIndex = index;
			this.detailIsPay = Number(item.is_pay);
			this.Indicator.open();
		},
		// 我发布的
		onClickMySendRecruit(item) {
			// 继续完成资料
			if( item.status==0 ){
				// 资料未完成
				this.$router.push({path: '/p/step', query: { id: item._id, step: item.step }});
			} else if( item.status==1 ) {
				// 等待审核
				this.Toast('提交成功！');
				return false;
			} else if( item.status==2 ) {
				// 审核通过
				this.onClickGetDetail(item);
			} else {
				return false;
			}
		},
		onClickDeleteMySendRecruit(_id) {
			// 删除
			this.MessageBox.confirm('确定删除当前招募信息么?').then(action => {
				this.ajaxDeleteMySendRecruit(_id)
			}, function() {
			});
		},
		onClickReload() {
			// 点击刷新
			window.location.reload();
		},
		onClickGetPlayTypes(val) {
			console.info("onClickGetPlayTypes");
			console.info(val);
			// 筛选游戏标签
			this.$router.push({path: '/p/type', query:{ key: val }})
		},
		onClickLookValidate() {
			// 已认证
			this.MessageBox('认证说明', '该群已经过客服验证，群信息真实有效，可选择加入。');
		},
		// 获取列表数据
		ajaxGetGamesList() {

			if(this.tabsData==undefined || !this.tabsData){
				// console.info("ajaxGetGamesList 没有找到查询条件，自动退出");
				return false;
			}

			 console.info("ajaxGetGamesList start");
//			 console.info("page:"+this.page);
			 console.info(this.tabsData);
//			 console.info(localStorage.location);

			let cityArray = this.tabsData.city;
			let postObj = {
				page: this.page,
				lng: (localStorage.location!=undefined && localStorage.location!="")?JSON.parse(localStorage.location).point.x:"",
				lat: (localStorage.location!=undefined && localStorage.location!="")?JSON.parse(localStorage.location).point.y:""
			};
			// 首页列表
			if(this.ajax=="getRecruitList" || this.ajax=="getSideRecruitList"){
				postObj.loc_provinces = (cityArray[0]!=undefined&&cityArray[0]!="全国")?cityArray[0]:"";
				postObj.loc_city = (cityArray[1]!=undefined&&cityArray[1]!="所有城市")?cityArray[1]:"";
				postObj.loc_area = (cityArray[2]!=undefined&&cityArray[2]!="所有地区")?cityArray[2]:"";
				postObj.mj_sp = (this.tabsData.game!=undefined&&this.tabsData.game!="全部")?this.tabsData.game:"";
				postObj.score = (this.tabsData.feng!=undefined&&this.tabsData.feng!=0)?this.tabsData.feng:-1;
				postObj.is_validate =  (this.tabsData.money!=undefined&&this.tabsData.money=="已认证")?1:-1;
			}
			if(this.ajax=="getRecruitList" && this.types!=""){
				postObj.play_types = this.types;
			}
			console.info(postObj);

			// 添加1秒的延迟，上线删除
			// 招募信息-获取列表
			this.$http.post("/api/servers/"+this.ajax, postObj).then(function(data){
				data = data.body;
				console.info(data);
				if (data.status==0) {
					if(data.data.length>0){
						// console.info("-------还有数据----");
						// console.info(data.data);
						for (var i = 0; i < data.data.length; i++) {
							this.list.push(data.data[i]);
						}
						this.page++;
					} else {
						// console.info("-------没有数据了++++++++++++++++++==----");
						this.allLoaded = true;
					}
				} else {
					// console.info(data);
					// console.info("-------数据返回错误++++++++++++++++++==----");
					this.allLoaded = true;
				}
				// 关闭加载动画
				this.loading = false;
				if(this.list.length>0){
					this.hasListData = true;
				} else {
					this.hasListData = false;
				}
			}, function(error){
				console.info("返回失败"+error);
				// 关闭加载动画
				this.loading = false;
				if(this.list.length>0){
					this.hasListData = true;
				} else {
					this.hasListData = false;
				}
			});
		},
		ajaxDeleteMySendRecruit(_id) {
			// 招募信息-删除我发布的招募信息
			this.$http.post("/api/servers/deleteMyRecruit", {
				id: _id
			}).then(function(data){
				data = data.body;
				if(data.status==0){
					window.location.reload();
				} else {
					console.info("删除失败！");
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

/*list样式*/
.list_box_nodata
	padding 3rem 0
	text-align center
	color #bbb
ul.game_list
	min-height 1rem
ul.game_list li
	.fixed_box
		border-bottom solid 1px #e2e2e4
		padding 0.4rem
		display -webkit-flex
		display flex
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
				height 0.75rem
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
				margin-bottom 0.1rem
				img._ico
					position relative
					margin-right 0.15rem
					top 0.05rem
			p._span
				font-size 0.3rem
				color #2088c4
				padding-top 0.1rem
				span
					display inline-block
					line-height 0.54rem
					vertical-align middle
					padding 0 0.3rem
					border 1px solid #2088c4
					border-radius 0.1rem
					margin-right 0.2rem
	.fot_box
		p
			padding 0.4rem 0.6rem
			line-height 0.5rem
			position relative
			font-size 0.35rem
			a
				color #2088c4
			i._r
				position relative
				display inline-block
				vertical-align middle
				width 0.1rem
				height 0.1rem
				border 3px solid #39c72a
				border-radius 50%
				margin-right 0.3rem
				top -1px
			i._r_green
				border-color #39c72a
			i._r_red
				border-color #ff4d4d
			i._r_orange
				border-color #fc8048
			i._r_blue
				border-color #48bffc
			span.goright
				top 0.4rem
				right 0.4rem
				color #fc8048

/*下拉loading效果*/
.page-infinite-loading
	text-align center
	height 1.5rem
	line-height 1.5rem
	color #bababa
	font-size 0.3rem
	margin-top 2.4rem
	.mint-spinner-snake
		display inline-block
		vertical-align middle
		margin-right 0.1rem
		width 0.35rem!important
		height 0.35rem!important
		position relative
		top -0.05rem

</style>

