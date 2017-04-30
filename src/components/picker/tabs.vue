<template>
	<div class="search_menu cf">

		<a href="javascript:void(0)" class="_group" @click="showTabs(1)"><div class="_g">地区<i class="iconfont">&#xe6a1;</i></div></a>
		<a href="javascript:void(0)" class="_group" @click="showTabs(3)"><div class="_g">游戏<i class="iconfont">&#xe6a1;</i></div></a>
		<a href="javascript:void(0)" class="_group" @click="showTabs(2)"><div class="_g">底分<i class="iconfont">&#xe6a1;</i></div></a>
		<a href="javascript:void(0)" class="_group" @click="showTabs(4)"><div class="_g">认证<i class="iconfont">&#xe6a1;</i></div></a>

		<transition name="slide-fade">
		<div class="_bottom" v-if="tabShow==1" @click="hideTabs">
			<div class="_box _boxs cf" @click.stop>
				<ul class="_lists _lists_a cf" id="js_listsA">
					<li v-for="(item, index) in cityDataA" @click="onClickA(index, $event)" :class="{current:cityDataACurrent==index}"><a href="#">{{item}}</a></li>
				</ul>
				<ul class="_lists _lists_b cf" id="js_listsB">
					<li v-for="(item, index) in cityDataB" @click="onClickB(index, $event)" :class="{current:cityDataBCurrent==index}"><a href="#">{{item}}</a></li>
				</ul>
				<ul class="_lists _lists_c cf" id="js_listsC">
					<li v-for="(item, index) in cityDataC" @click="onClickC(index, $event)" :class="{current:cityDataCCurrent==index}"><a href="#">{{item}}</a></li>
				</ul>
			</div>
			<div class="arrow arrow_a"><img src="./arrow.png"></div>
		</div>
		</transition>

		<transition name="slide-fade">
		<div class="_bottom" v-if="tabShow==2" @click="hideTabs">
			<div class="_box" @click.stop>
				<ul class="_list_chose cf">
					<li v-for="(item, index) in tabsConfig.feng" @click="onClickFeng(index)"><a href="#" v-if="item==0" :class="{current:item==tabsChoseData.feng}">全部</a><a href="#" v-else :class="{current:item==tabsChoseData.feng}">{{item}}分</a></li>
				</ul>
			</div>
			<div class="arrow arrow_c"><img src="./arrow.png"></div>
		</div>
		</transition>

		<transition name="slide-fade">
		<div class="_bottom" v-if="tabShow==3" @click="hideTabs">
			<div class="_box" @click.stop>
				<p style="padding-top: 0.3rem; text-align: center; color: #bbb; font-size: 0.3rem">可先选择“地区”分类以更精准的选择游戏</p>
				<ul class="_list_chose _list_chose_two cf">
					<li v-for="(item, index) in tabsConfig.game" @click="onClickGame(index)"><a href="#" :class="{current:item==tabsChoseData.game}">{{item}}</a></li>
				</ul>
			</div>
			<div class="arrow arrow_b"><img src="./arrow.png"></div>
		</div>
		</transition>

		<transition name="slide-fade">
		<div class="_bottom" v-if="tabShow==4" @click="hideTabs">
			<div class="_box" @click.stop>
				<ul class="_list_chose cf">
					<li v-for="(item, index) in tabsConfig.money" @click="onClickMoney(index)"><a href="#" :class="{current:item==tabsChoseData.money}">{{item}}</a></li>
				</ul>
			</div>
			<div class="arrow arrow_d"><img src="./arrow.png"></div>
		</div>
		</transition>

	</div>
</template>

<script>

export default {
	props: {
		page: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			tabsConfig: this.$config,
			tabShow: false,

			cityData: [],
			tabsChoseData: {
				city: [],
				feng: "0",
				game: "全部",
				money: "全部"
			},

			cityDataACurrent: 0,
			cityDataBCurrent: 0,
			cityDataCCurrent: -1,
			popupVisible: false
		};
	},
	created() {
		this.ajaxGetCityData((error, data) => {
			if(error){
				console.error(error);
			} else {
				console.info("ajaxGetCityData back ***");
				console.info(data);
				this.cityData = data;

				this.getDataAHtml();
				this.getDataBHtml(0);
				this.getDataCHtml(0);

				this.tabsChoseSubmit();

				this.ajaxGetGamesSpList();

			}
		})
	},
	mounted() {
		// console.info("mounted tabs");
	},
	methods: {
		// 打开tab
		showTabs(index) {
			if(this.tabShow==index){ //已经打开的，执行关闭事件
				this.hideTabs();
			} else {
				this.tabShow=index;
				$("body").addClass("bodyhidescroll");
			}
		},
		// 关闭tab
		hideTabs() {
			this.tabShow=false;
			$("body").removeClass("bodyhidescroll");
		},
		// 获取所有省份
		getDataAHtml() {
			var cityDataA = [];
			for(var i=0;i<this.cityData.length;i++){
				cityDataA.push(this.cityData[i].name)
			}
			// console.info(cityDataA);
			this.cityDataA = cityDataA;
			this.tabsChoseData.city[0] = cityDataA[0];
		},
		// 获取所有城市，根据index
		getDataBHtml(index) {
			//console.info("getDataBHtml "+index);
			var cityDataB = [];
			for(var i=0;i<this.cityData[index].city.length;i++){
				cityDataB.push(this.cityData[index].city[i].name)
			}
			// console.info(cityDataB);
			this.cityDataB = cityDataB;
			this.tabsChoseData.city[1] = cityDataB[0];
		},
		//  获取所有区县，根据index
		getDataCHtml(index) {
			var index0 = this.cityDataACurrent
			// console.info("getDataCHtml");
			// console.info(index);
			// console.info(index0);
			var cityDataC = [];
			for(var i=0;i<this.cityData[index0].city[index].area.length;i++){
				cityDataC.push(this.cityData[index0].city[index].area[i])
			}
			// console.info(cityDataC);
			this.cityDataC = cityDataC;
			this.tabsChoseData.city[2] = cityDataC[0];
		},
		// 切换省-事件
		onClickA(index, _this) {
			//console.info("----------------onClickA--------------");
			//console.info(index);
			//console.info(_this.target.innerText);
			this.cityDataACurrent = index;
			this.getDataBHtml(index);
			this.getDataCHtml(this.cityDataBCurrent);
			this.cityDataBCurrent=0;
			this.cityDataCCurrent=-1;
			document.getElementById("js_listsB").scrollTop = 0;
			document.getElementById("js_listsC").scrollTop = 0;
		},
		// 切换市-事件
		onClickB(index, _this) {
			//console.info("----------------onClickB--------------");
			//console.info(index);
			//console.info(_this.target.innerText);
			this.cityDataBCurrent = index;
			this.getDataCHtml(index);
			this.cityDataCCurrent=-1;
			document.getElementById("js_listsC").scrollTop = 0;
		},
		// 切换区县-事件
		onClickC(index, _this) {
			//console.info("----------------onClickC--------------");
			//console.info(index);
			//console.info(_this.target.innerText);
			this.cityDataCCurrent = index;
			var choseArray = [];
			choseArray.push($("#js_listsA li.current a").text());
			choseArray.push($("#js_listsB li.current a").text());
			choseArray.push(_this.target.innerText);
			this.tabsChoseData.city = choseArray;
			this.tabsChoseSubmit();
		},
		// 选择分数
		onClickFeng(index) {
			this.tabsChoseData.feng = this.tabsConfig.feng[index];
			this.tabsChoseSubmit();
		},
		// 选择游戏
		onClickGame(index) {
			this.tabsChoseData.game = this.tabsConfig.game[index];
			this.tabsChoseSubmit();
		},
		// 选择收费
		onClickMoney(index) {
			this.tabsChoseData.money = this.tabsConfig.money[index];
			this.tabsChoseSubmit();
		},
		// do some ajax
		tabsChoseSubmit() {
			// console.info("tabsChoseSubmit");
			this.hideTabs();
			this.$emit('tabchoice', this.tabsChoseData);
		},
		ajaxGetCityData(callback) {
			this.$http.post("/api/getCityList").then(function(data){
				data = data.body.data;
				callback(null, data);
			}, function(error){
				console.warn("请求城市列表失败！");
				callback(error, null)
			});
		},
		ajaxGetGamesSpList() {
			this.$http.post("/api/servers/getGamesSpList", {
				provinces: ""
			}).then(function(data){
				data = data.body;
				if(data.status==0){
					data = data.data;
					let newArray = ["全部"];
					for(let i=0;i<data.length;i++){
						let item = data[i];
						newArray.push(item.name);
					}
					this.tabsConfig.game = newArray
				} else {
					console.info("返回错误");
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		}
	}
};

</script>

<style lang="stylus" rel="stylesheet/stylus">

.search_menu_box
	border-bottom 1px solid #e2e2e4

.search_menu
	padding 0.3rem 0
	position relative
	/*切换的按钮*/
	._g
		display inline-block
		width 25%
		float left
		text-align center
		line-height 0.6rem
		border-left 1px solid #e2e2e4
		margin-left -1px
		font-size 0.35rem
		color #333
		i.iconfont
			-webkit-text-size-adjust none
			-webkit-transform scale(0.75)
			color #ccc
			font-size 0.3rem
			margin-left 0.05rem
	/*切换的内容*/
	._bottom
		width 100%
		min-height 100rem
		background rgba(0, 0, 0, 0.4)
		position absolute
		top 1.2rem
		left 0
		z-index 100
		margin-top 1px
		._box
			background #fff
			max-height 8rem
			overflow-y auto
			padding 0.15rem 0
			border-top 1px solid #e2e2e4
		._boxs
			height 8rem
			padding 0
			overflow hidden
		.arrow
			position absolute
			top -0.15rem
			margin-left -0.15rem
			margin-top 1px
			img
				display block
				height 0.15rem
		.arrow_a
			left 12.5%
		.arrow_b
			left 37.5%
		.arrow_c
			left 62.5%
		.arrow_d
			left 87.5%
	/*省市区*/
	ul._lists
		width 33.3%
		float left
		height 100%
		overflow scroll
		li
			padding 0.3rem
			line-height 0.6rem
			border-bottom 1px solid #e2e2e4
		li.current a
			color #fc8048
	ul._lists_a
		background #fff
	ul._lists_b
		background #fafafa
	ul._lists_c
		background #f2f2f2
	/*选择项，一行3个*/
	ul._list_chose
		padding 0.2rem 0.3rem 0.6rem
		li
			display inline-block
			width 33.3%
			float left
			text-align center
			margin-top 0.4rem
			a
				display inline-block
				vertical-align middle
				width 70%
				line-height 1rem
				border-radius 0.1rem
				border 1px solid #fff
			a.current
				border 1px solid #fc8048
				color #fc8048
	ul._list_chose_two
		li
			width 50%
	/*选择项，一行1个*/
	ul._list_chose_one
		padding 0.2rem 0.3rem 0.6rem
		li
			border-bottom 1px solid #e2e2e4
			text-align left
			a
				display block
				line-height 1.2rem
				padding 0 0.3rem
			a.current
				color #fc8048
		li:last-child
			border 0

.search_three
	._g
		width 33.33%
	._bottom
		.arrow_b
			left 14.5%
		.arrow_c
			left 46.5%
		.arrow_d
			left 82.5%

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
	transition: all .4s ease;
}
.slide-fade-leave-active {
	transition: all .4s ease;
}
.slide-fade-enter, .slide-fade-leave-active {
	transform: translateY(0.5rem);
	opacity: 0;
}




</style>
