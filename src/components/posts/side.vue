<template>
	<div class="page_index">

		<div class="search_fixed_box">
			<div id="js_search_menu" class="search_menu_box search_fixed">
				<pickertabs v-on:tabchoice="pickertabsChange" page="side"></pickertabs>
			</div>
	    </div>

		<div>
			<fixsend></fixsend>
			<div class="br"></div>
	    </div>

		<div id="lists" class="goods_list">
			<list ajax="getSideRecruitList" ref="listComponent"></list>
		</div>

		<footmenu current="side"></footmenu>
	</div>
</template>

<script type="text/ecmascript-6">

// import
import Footmenu from '../common/footmenu'
import Fixsend from '../models/fix_send'
import Pickertabs from '../picker/tabs'
import List from '../posts/models/list'

// main
export default {
	name: 'index',
	components: { Footmenu, Fixsend, Pickertabs, List },
	methods: {
		pickertabsChange: function (tabsData) {
			console.info("pickertabsChange start");
			console.info(tabsData);
			console.info(JSON.stringify(tabsData));

			// 调用子组件list的方法
			// 查询条件发生变化，清空已有数据，重新加载新数据
			// 需设置延迟触发，否则初次要加载两次
			setTimeout(() => {
				this.$refs.listComponent.tabsDataChange(tabsData);
			}, 10);
		}
	}
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>