<template>
    <div class="page-loadmore-wrapper">
      <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
        <ul class="page-loadmore-list">
          <li v-for="item in list" class="page-loadmore-listitem">{{ item }}</li>
        </ul>
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
          <span v-show="topStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
        </div>
      </mt-loadmore>
    </div>
</template>

<style>

	.page-loadmore .mint-spinner {
		display: inline-block;
		vertical-align: middle;
	}
	.page-loadmore-desc {
		text-align: center;
		color: #666;
		padding-bottom: 5px;
	}
	.page-loadmore-desc:last-of-type {
		border-bottom: solid 1px #eee;
	}
	.page-loadmore-listitem {
		height: 100px;
		line-height: 100px;
		border-bottom: solid 1px #eee;
		text-align: center;
	}
	.page-loadmore-listitem:first-child {
		border-top: solid 1px #eee;
	}
	.page-loadmore-wrapper {
		overflow: scroll;
	}
	.mint-loadmore-bottom span {
		display: inline-block;
		-webkit-transition: .2s linear;
		transition: .2s linear;
		vertical-align: middle
	}
	.mint-loadmore-bottom span.is-rotate {
		-webkit-transform: rotate(180deg);
		transform: rotate(180deg);
	}

</style>

<script type="text/babel">
  export default {
	  data() {
		  return {
			  list: [],
			  topStatus: ''
		  };
	  },

	  methods: {
		  handleTopChange(status) {
			  this.topStatus = status;
		  },

		  loadTop() {
			  setTimeout(() => {
				  let firstValue = this.list[0];
				  for (let i = 1; i <= 10; i++) {
					  this.list.unshift(firstValue - i);
				  }
				  this.$refs.loadmore.onTopLoaded();
			  }, 1500);
		  }
	  },

	  created() {
		  for (let i = 1; i <= 20; i++) {
			  this.list.push(i);
		  }
	  },

	  mounted() {
	  }
  };
</script>
