// 先清除所有本地存储
// localStorage.clear();

$(function(){
	$.ajax({
		url: "/api/getIpLocation",
		type : "POST",
		dataType : 'json',
		success : function(data){
			// console.info(data);
			if(data.status==0){
				alerts("ajax getIpLocation back");
				alerts(JSON.stringify(data.data));
				localStorage.setItem('location_ip', JSON.stringify({
					status: 0,
					province: data.data.address_detail.province,
					city: data.data.address_detail.city,
					point: data.data.point
				}));
				// console.info(localStorage);
				if(localStorage.location!=""){
					localStorage.setItem('location', localStorage.location_ip);
				}
			} else {
				localStorage.setItem('location_ip', JSON.stringify({
					status: -1,
					message: data
				}));
			}
		},
		complete: function () {
		},
		error: function(o) {
		}
	});


	var options={
		enableHighAccuracy:false, //可选，是否开启高精度模式，参数默认值为 false
		maximunAge:1000, //可选，单位ms，重新计算位置的时间间隔。默认为0，即每次时时计算位置信息。
		timeout:10000 //可选，单位为ms，浏览器需要在该时间段内完成定位，否则定位失败，默认值为 - - infinity，无穷大。如果该值设置较小，会有很高的定位失败率。
	};
	if(window.navigator.geolocation){
		alerts("geolocation working");
		navigator.geolocation.getCurrentPosition(successCallback,errorCallback,options);
	}else{
		alerts("你的浏览器不支持定位!");
	}

	function successCallback(position){
		alerts("h5geolocation successCallback");
		alerts(JSON.stringify(position));
		// alerts(JSON.stringify({
		// 	x: position.coords.longitude,
		// 	y: position.coords.latitude
		// }));
		localStorage.setItem('location_h5', JSON.stringify({
			status: 0,
			point: {
				x: position.coords.longitude,
				y: position.coords.latitude
			}
		}));

		localStorage.setItem('location', localStorage.location_h5);

		/*var output="";
		output +="Your position has bean located . \r\n";
		output+=" Latitude:"+position.coords.latitude+" ";
		output+=" Longitude:"+position.coords.longitude+" ";
		output+=" Accuracy :"+position.coords.accuracy +" meters";
		if(position.coords.latitude){
			output+=" Accuracy :"+position.coords.altitudeAccuracy +" meters";
		}
		if(position.coords.heading){
			output+=" Heading :"+position.coords.Heading +" meters";
		}
		if(position.coords.speed){
			output+=" Speed :"+position.coords.Speed +" m/s";
		}
		output+=" Time of Position "+position.timestamp +" m/s";*/
		//alerts(output);
	}
	function errorCallback(error){
		alerts("h5geolocation errorCallback");
//		alerts(JSON.stringify(error));
//		alerts(error.code);
//		alerts(error.message);

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

		// console.info("errorMessage ------------------- back ------------------ ================== +++++++++++++++++++++");
		alerts(errorMessage);
		localStorage.setItem('location_h5', JSON.stringify({
			status: -1,
			message: errorMessage
		}));
	}

	function alerts(txt){
		// console.info(txt);
		$("#demo").html($("#demo").html()+"<br>"+txt);
	}

});