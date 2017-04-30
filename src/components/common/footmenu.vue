<template>
	<footer>
		<div class="footer_fixed">
		    <div class="wrapper footer_menu">

			    <router-link to="/" :class="{current:current=='home'}">
				    <img v-if="current=='home'" src="./menu_home_hover.png">
			        <img v-else src="./menu_home.png">
			        <br>最新发布
			    </router-link>

			    <router-link to="/p/side" :class="{current:current=='side'}">
				    <img v-if="current=='side'" src="./menu_side_hover.png">
				    <img v-else src="./menu_side.png">
				    <br>附近的群
			    </router-link>

				<router-link to="/u/my" :class="{current:current=='my'}">
					<img v-if="current=='my'" src="./menu_my_hover.png">
					<img v-else src="./menu_my.png">
					<br>我的
				</router-link>

		    </div>
		</div>
	</footer>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		current: {
			type: String,
			default: "home"
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

/*页脚*/
footer {
	height:1.3rem;
}
.footer_fixed {
	width:100%;
	position: fixed;
	left:0;
	bottom:0;
	z-index:90;
	background: #fbfbfb;
}
.footer_fixed .wrapper {
	line-height:1.3rem;
	height:1.3rem;
	position:relative;
}

.footer_menu {
	background: #fbfbfb;
	text-align: center;
	border-top: 1px solid #dde0e4;
}
.footer_menu a {
	display: inline-block;
	vertical-align: middle;
	width: 33.33%;
	float: left;
	line-height: 0.35rem;
	padding: 0.15rem 0;
	font-size 0.3rem;
}
.footer_menu a.current {
	color: #ff4949;
}
.footer_menu a img {
	width: 0.5rem;
	margin-bottom 0.02rem;
}
</style>
