<template>

	<div class="page-loadmore-wrapper">
		<div class="list_box" v-if="hasListData">
			<ul class="game_list" v-infinite-scroll="loadMoreList" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
				<li v-for="item in list" @click="onClickGetDetail(item._id, item.is_pay)">
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
		<detail :_id="detailId" :is_pay="detailIsPay"></detail>

	</div>
</template>



<script type="text/javascript">

// 引入自定义组件
import Detail from '../list/detail.vue'

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
			// console.info("tabsDataChange+++ 查询条件发生变化，清空已有数据，重新加载新数据");
			// console.info(JSON.stringify(tabs));

			this.list = [];
			this.loading = true;
			this.page = 0;
			this.allLoaded = false;
			this.tabsData = tabs;
			this.ajaxGetGamesList();
		},
		// 加载更多
		loadMoreList() {

			// console.info("下拉加载更多事件触发: loadMore");

			// 如果没有下一页了则不再请求
			if (this.allLoaded == true) return false;

			// 开始加载
			this.loading = true;
			this.ajaxGetGamesList();
		},
		// 招募详情
		onClickGetDetail(_id, is_pay) {
			this.detailId = _id;
			this.detailIsPay = Number(is_pay);
		},
		// 获取列表数据
		ajaxGetGamesList() {

			if(this.tabsData==undefined || !this.tabsData){
				// console.info("ajaxGetGamesList 没有找到查询条件，自动退出");
				return false;
			}

			// console.info("ajaxGetGamesList start");
			// console.info("page:"+this.page);
			// console.info("tabsData:"+JSON.stringify(this.tabsData));

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
					// console.info(JSON.stringify(data));
					// console.info(data);
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
					if(this.list.length==0) this.hasListData = false;
				}, function(error){
					// console.info("返回失败"+error);
					// 关闭加载动画
					this.loading = false;
					if(this.list.length==0) this.hasListData = false;
				});
			}, 1500);

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

</style>

