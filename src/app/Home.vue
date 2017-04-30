<template>
	<article class="wrapper" id="app" v-cloak>
		<transition>
			<!--<keep-alive></keep-alive>-->
        	<router-view></router-view>
        </transition>
	</article>
</template>

<script type="text/ecmascript-6">

import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);

const vuex_store = new Vuex.Store({
	state:{
	},
	mutations:{
	}
});

export default {
	name: 'app',
	store: vuex_store,
	created() {
		console.info("app created");
		console.info(this.$global.user);
		setTimeout(() => {
			this.getH5Location();
			this.getIpLocation();
		}, 1000)
	},
	methods: {
		getIpLocation() {
			this.$http.post("/api/getIpLocation").then(function(data){
				data = data.body;
				if(data.status==0){
					data = data.data;
					console.info("ajax getIpLocation back ***");
					console.info(data);
					localStorage.setItem('location_ip', JSON.stringify({
						status: 0,
						province: data.address_detail.province,
						city: data.address_detail.city,
						point: data.point
					}));
					// 如果h5没有成功获取地理位置时才采用ip获取的地理位置
					if(!localStorage.location || localStorage.location=="" || localStorage.location=="undefined"){
						localStorage.setItem('location', localStorage.location_ip);
					} else {
						var locationData = JSON.parse(localStorage.location);
						locationData.province = data.address_detail.province;
						locationData.city = data.address_detail.city;
						localStorage.setItem('location', JSON.stringify(locationData));
					}
				} else {
					console.warn("ajax getIpLocation 返回错误");
					console.info(data);
					localStorage.setItem('location_ip', JSON.stringify({
						status: -1,
						message: data
					}));
				}
			}, function(error){
				console.warn("请求失败！");
				console.error(error);
			});
		},
		getH5Location() {
			var options={
				// 可选，是否开启高精度模式，参数默认值为 false
				enableHighAccuracy: false,
				// 可选，单位ms，重新计算位置的时间间隔。默认为0，即每次时时计算位置信息。
				maximunAge: 1000,
				// 可选，单位为ms，浏览器需要在该时间段内完成定位，否则定位失败，默认值为 - - infinity，无穷大。如果该值设置较小，会有很高的定位失败率。
				timeout: 10000
			};
			if(window.navigator.geolocation){
				console.info("window.navigator.geolocation working ***");
				navigator.geolocation.getCurrentPosition(this.h5_SuccessCallback, this.h5_ErrorCallback, options);
			} else {
				console.warn("你的浏览器不支持定位!");
			}
		},
		h5_SuccessCallback(position) {
			console.info("window.navigator.geolocation successCallback ***");
			console.info(position);
			localStorage.setItem('location_h5', JSON.stringify({
				status: 0,
				point: {
					x: position.coords.longitude,
					y: position.coords.latitude
				}
			}));
			// 始终会用h5成功获取的地理位置
			if(!localStorage.location || localStorage.location=="" || localStorage.location=="undefined"){
				localStorage.setItem('location', localStorage.location_h5);
			} else {
				var locationData = JSON.parse(localStorage.location);
				locationData.point = {
					x: position.coords.longitude,
					y: position.coords.latitude
				};
				localStorage.setItem('location', JSON.stringify(locationData));
			}
		},
		h5_ErrorCallback(error) {
			console.info("window.navigator.geolocation errorCallback ***");
			var errorMessage = "";
			switch(error.code){
				case error.PERMISSION_DENIED:
					errorMessage = "定位失败,用户拒绝请求地理定位";
					break;
				case error.POSITION_UNAVAILABLE:
					errorMessage = "定位失败,位置信息是不可用";
					break;
				case error.TIMEOUT:
					errorMessage = "定位失败,请求获取用户位置超时";
					break;
				case error.UNKNOWN_ERROR:
					errorMessage = "定位失败,定位系统失效";
					break;
			}

			console.info(errorMessage);
			localStorage.setItem('location_h5', JSON.stringify({
				status: -1,
				message: errorMessage
			}));
		}
	}
}
</script>
