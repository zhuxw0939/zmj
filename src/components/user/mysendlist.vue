<template>
	<div class="page_mypage">
		<fixsend text="立即免费发布"></fixsend>
		<div class="br"></div>
		<list ajax="userGetMyRecruit" ref="listComponent"></list>
	</div>
</template>

<script type="text/ecmascript-6">

// import
import List from '../posts/models/list'
import Fixsend from '../models/fix_send'

// main
export default {
	name: 'mysendlist',
	components: { List, Fixsend },
	created() {
		setTimeout(() => {
			this.$refs.listComponent.tabsDataChange("{abc: 'abc'}");
		}, 10);
	},
	methods: {
		pickertabsChange() {
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>