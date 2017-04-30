<template>
	<div class="page_index">

		<div id="js_index_header">
		    <banner></banner>
		    <div class="br"></div>
			<fixsend></fixsend>
			<div class="br"></div>
		</div>

		<div class="search_fixed_box">
			<div id="js_search_menu" class="search_menu_box">
			    <pickertabs v-on:tabchoice="pickertabsChange"></pickertabs>
			</div>
	    </div>

		<div id="lists" class="goods_list">
			<list ajax="getRecruitList" ref="listComponent"></list>
		</div>

		<footmenu current="home"></footmenu>
	</div>
</template>

<script type="text/ecmascript-6">

// import
import Footmenu from '../common/footmenu'
import Banner from '../models/banner'
import Fixsend from '../models/fix_send'
import Pickertabs from '../picker/tabs'
import List from '../posts/models/list'

// main
export default {
	name: 'index',
	components: { Footmenu, Banner, Fixsend, Pickertabs, List },
	methods: {
		pickertabsChange: function (tabsData) {
			console.info("*** pickertabsChange *** 查询条件发生变化 ***");

			// 调用子组件list的方法
			// 查询条件发生变化，清空已有数据，重新加载新数据
			// 需设置延迟触发，否则初次要加载两次
			setTimeout(() => {
				console.info("setTimeout");
				this.$refs.listComponent.tabsDataChange(tabsData);
			}, 10);

		}
	}
}

$(function(){
	setTimeout(function(){
		scrollChange();
	}, 100);
	$(window).scroll(function(e){
		scrollChange();
	});
	function scrollChange(){
		var _sTop = $(window).scrollTop();
		var _hHeight = $("#js_index_header").height();
		if( _sTop >= _hHeight ){
			$("#js_search_menu").addClass("search_fixed");
		} else {
			$("#js_search_menu").removeClass("search_fixed");
		}
	}
});
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>