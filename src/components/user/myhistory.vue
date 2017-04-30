<template>
	<div class="page_mypage">
		<div>
			<list ajax="userGetMyBuysRecruit" ref="listComponent"></list>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

// import
import List from '../posts/models/list'


// main
export default {
	name: 'my',
	components: { List },
	created() {
		setTimeout(() => {
			this.$refs.listComponent.tabsDataChange("{abc: 'abc'}");
		}, 10);
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>