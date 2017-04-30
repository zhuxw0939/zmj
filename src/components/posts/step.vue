<template>
	<div class="page_step">

		<!--第一步-->
		<transition name="slide-left">
		<div class="step_box" v-if="stepShow==1">
			<div class="step_title">
				<h3>上传个人二维码</h3>
				<p>请务必上传个人二维码，用户会将你你加为好友进群</p>
			</div>
			<div class="step_line">
				<div class="step_bar" id="js_step_bar">
					<span class="dit dit_1"></span>
					<span class="line line_1" :class="{dit_current:(stepShow==2||stepShow==3)}"></span>
					<span class="dit dit_2"></span>
					<span class="line line_2" :class="{dit_current:(stepShow==3||stepShow==4)}"></span>
					<span class="dit dit_3"></span>
					<span class="line line_3" :class="{dit_current:stepShow==4}"></span>
					<span class="dit dit_4"></span>
				</div>
			</div>
			<div class="step_content">
				<div class="update_img">
					<img :src="codeData.image" v-if="codeData.image">
					<img src="../../static/img/code_default.png" v-else>
					<!--<h4 v-if="codeData.url"><a :href="codeData.url">{{codeData.url}}</a></h4>-->
				</div>
				<div class="update_formbox">
<!--
					<a href="javascript:void(0)" @click="onUpCode">{{codeData.typeText}}</a>
-->
					<upfile :upfile-data="upfileData"></upfile>
				</div>
			</div>
			<div class="step_footer_info">
				<p>操作方法：</p>
				<ul>
					<li>在微信中点“我”，点击“头像”；</li>
					<li>选择二维码名片，然后保存到手机；</li>
					<li>点击本页“上传微信二维码”按钮，打开手机相册，并选择上一步保存的二维码名片，确定即可。</li>
				</ul>
			</div>
		</div>
		</transition>

		<!--第二步-->
		<transition name="slide-left">
		<div class="step_box" v-if="stepShow==2">
			<div v-if="!addNewGameVisible">
				<div class="step_title">
					<h3>您是哪种麻将的代理</h3>
					<p>只能选一个哦</p>
				</div>
				<div class="step_line">
					<div class="step_bar" id="js_step_bar" style="left: -10rem">
						<span class="dit dit_1"></span>
						<span class="line line_1" :class="{dit_current:(stepShow==2||stepShow==3)}"></span>
						<span class="dit dit_2"></span>
						<span class="line line_2" :class="{dit_current:(stepShow==3||stepShow==4)}"></span>
						<span class="dit dit_3"></span>
						<span class="line line_3" :class="{dit_current:stepShow==4}"></span>
						<span class="dit dit_4"></span>
					</div>
				</div>
				<div class="step_content">
					<div class="chose_game_chosecity">
						{{selectGamesCityValue}}<a href="javascript:void(0)" class="goright" @click="choseGamesCity">切换省份</a>
					</div>
					<ul class="chose_game cf">
						<li v-for="(item, index) in gamesData" :class="{current:gameListChoice==item.name}" :id="item._id"><img class="game_img" :src="item.image+'!720x.png'" @click="onClickChoiceGame(item.name, index)"><br>{{item.name}} <img class="checked_img" src="../../static/img/game_checked.png"></li>
						<li><img class="game_img" src="../../static/img/addgame.png" @click="onClickCreateNewGame"><br>添加麻将</li>
					</ul>
				</div>
			</div>
			<div v-else>
				<div class="step_title">
					<h3>选择麻将</h3>
					<p>请填写您代理的麻将游戏信息</p>
					<p><a href="#" @click="onClickCancelAddNewGame">取消</a></p>
				</div>
				<div class="step_content">
					<div class="chose_address">
						<div class="selectd_box" @click="onClickSelectLocal">
							<img src="../../static/img/add_checked.png">
							<span v-if="localData.length>0">{{localData.join(", ")}}</span>
							<span v-else style="color: #eee; font-size: 0.4rem;">请选择所在区域</span>
							<i class="iconfont goright">&#xe6a1;</i>
						</div>
						<p>请认真填写所在地，否则本地玩家查不到您的信息</p>
					</div>
					<div class="form_title">游戏名称</div>
					<div class="form_item">
						<input type="text" v-model="newGameData.name" @change="checkStepIsCompletionE" placeholder="请填写游戏名称">
					</div>
					<div class="form_title">游戏玩法</div>
					<div class="form_item">
						<textarea v-model="newGameData.info" @change="checkStepIsCompletionE" placeholder="多种玩法使用 , 分开"></textarea>
					</div>
					<div class="form_notice">请认真填写，以便我们及时更新游戏及玩法</div>
				</div>
			</div>
		</div>
		</transition>

		<!--第三步-->
		<transition name="slide-left">
		<div class="step_box" v-if="stepShow==3">
			<div class="step_title">
				<h3>选择玩法</h3>
				<p>请务必准确填写，否则会有大批无效用户加您好友</p>
			</div>
			<div class="step_line">
				<div class="step_bar" id="js_step_bar" style="left: -20rem">
					<span class="dit dit_1"></span>
					<span class="line line_1" :class="{dit_current:(stepShow==2||stepShow==3)}"></span>
					<span class="dit dit_2"></span>
					<span class="line line_2" :class="{dit_current:(stepShow==3||stepShow==4)}"></span>
					<span class="dit dit_3"></span>
					<span class="line line_3" :class="{dit_current:stepShow==4}"></span>
					<span class="dit dit_4"></span>
				</div>
			</div>
			<div class="step_content">
				<div class="chose_address">
					<div class="selectd_box" @click="onClickSelectLocal">
						<img src="../../static/img/add_checked.png" alt="">
						<span v-if="localData.length>0">{{localData.join(", ")}}</span>
						<span v-else style="color: #eee; font-size: 0.4rem;">请选择所在区域</span>
						<i class="iconfont goright">&#xe6a1;</i>
					</div>
					<p>请认真填写所在地，否则本地玩家查不到您的信息</p>
				</div>
				<div class="chose_wf">
					<ul class="cf">
						<li v-for="(item, index) in gamesDataTags" :class="{current:wfListChoice.findIndex(elitem => elitem==item)!=-1}" @click="onChoseWanfa(item)">{{item}}<img src="../../static/img/wf_checked.png"></li>
					</ul>
					<p>最多选3种玩法</p>
				</div>
			</div>
		</div>
		</transition>

		<!--第四步-->
		<transition name="slide-left">
		<div class="step_box" v-if="stepShow==4">
			<div class="step_title">
				<div>
					<h3>群信息</h3>
					<p>请务必准确填写，以便玩家能找到您的群</p>
				</div>
			</div>
			<div class="step_line">
				<div class="step_bar" id="js_step_bar" style="left: -30rem">
					<span class="dit dit_1"></span>
					<span class="line line_1" :class="{dit_current:(stepShow==2||stepShow==3)}"></span>
					<span class="dit dit_2"></span>
					<span class="line line_2" :class="{dit_current:(stepShow==3||stepShow==4)}"></span>
					<span class="dit dit_3"></span>
					<span class="line line_3" :class="{dit_current:stepShow==4}"></span>
					<span class="dit dit_4"></span>
				</div>
			</div>
			<div class="step_content">
				<div class="form_title">群名字</div>
				<div class="form_item">
					<input type="text" v-model="weixinGroupData.name" @change="checkStepIsCompletionD" placeholder="请填写群名字">
				</div>
				<div class="form_title">本群玩牌分数</div>
				<div class="chose_wf">
					<ul class="cf">
						<li v-for="(item, index) in fenList" :class="{current:fenListChoice==item.id}" @click="onChoseFen(item.id)">{{item.name}}<img src="../../static/img/wf_checked.png"></li>
					</ul>
				</div>
				<div class="form_title">群说明</div>
				<div class="form_item">
					<textarea v-model="weixinGroupData.info" @change="checkStepIsCompletionD" placeholder="请填写群说明"></textarea>
				</div>
				<div class="form_notice">玩家会根据玩牌分数选择群，请仔细填写。</div>
			</div>
		</div>
		</transition>

		<div v-if="stepShow==1" class="step_bottom_fix" :class="{step_completion:!stepCompletion}">
			<a href="javascript:void(0)" class="btn_bottom" @click="stepSubmit">{{stepSubmitText}}</a>
		</div>
		<div v-else class="step_bottom_fix" :class="{step_completion:!stepCompletion}">
			<a href="javascript:void(0)" class="btn_bottom btn_bottom_prev" @click="onClickPrevStep">上一步</a>
			<a href="javascript:void(0)" class="btn_bottom btn_bottom_next" @click="stepSubmit">{{stepSubmitText}}</a>
		</div>



		<!--选择游戏前切换厂牌省份-->
		<mt-popup v-model="selectGamesCityVisible" popup-transition="popup-fade" position="bottom" style="width:100%">
			<div class="picker_local_box">
				<div class="picker_local_title">
					<a href="javascript:void(0)" @click="selectGamesCityVisible=false">取消</a>
					<a href="javascript:void(0)" style="color: #fcb648" class="goright" @click="onClickSelectGamesCitySure">确定</a>
				</div>
				<div class="_box _box_content cf" @click.stop>
					<mt-picker :slots="selectGamesCitySlots" @change="onValuesChange" :visible-item-count="5" :item-height="108"></mt-picker>
				</div>
			</div>
		</mt-popup>


		<!--选择所在地区-->
		<mt-popup v-model="selectLocalVisible" popup-transition="popup-fade" position="bottom" style="width:100%">
			<div class="picker_local_box">
				<div class="picker_local_title">
					选择地区
					<a href="javascript:void(0)" class="goright" @click="selectLocalVisible=false">取消</a>
				</div>
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
			</div>
		</mt-popup>

	</div>
</template>

<script>
import Vue from 'vue';

// mint-ui组件
import { Indicator, Toast } from 'mint-ui';

// 引入mint-ui组件
import { Popup, Picker } from 'mint-ui';
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);


// 引入element-ui组件
import { Upload } from 'element-ui'
Vue.use(Upload);


import Upfile from '../common/upfile.vue'
Vue.component('upfile', Upfile);

//import cityData from '../picker/citys.json';
//let newOptions = data.pastStudentOptions.slice(0);
//cityData.shift();

export default {
	data() {
		return {
			step: 1,
			stepData: {},

			dataId: "",

			gamesData: [],

			stepShow: 1, //默认第一步
			stepSubmitText: "下一步",
			stepCompletion: false,

			// 上传二维码
			codeData: {
				typeText: "上传微信二维码",
				url: "",
				image: "",
				upImage: ""
			},
			upfileData: {
				action: "http://211.149.151.88:8686/myupload",
//				action: "http://www.zhaomajiang.com:6060/myupload",
				text: "上传微信二维码",
				_this: this,
				// 上传成功
				upfileBack: function(file, _this){
					console.info(_this);
					_this.onUpfileBack(file);
				},
				// 重新上传
				startUpfileBack: function(file, _this){
					console.info(_this);
					_this.codeData.url = "";
					_this.codeData.image = "";
					_this.codeData.upImage = "";
					_this.stepCompletion = false;
				}
			},

			// 选择游戏
			addNewGameVisible: false,
			newGameData: {
				name: "",
				info: ""
			},
			gameListChoice: "",
			gamesDataTags: [],
			// 选择游戏前切换厂牌城市
			selectGamesCityVisible: false,
			selectGamesCitySlots: [{
				values: ['四川', '广东', '山东', '重庆', '河南', '陕西']
			}],
			selectGamesCitySlotsChoice: '四川',
			selectGamesCityValue: '四川',

			// 填写所在地区
			localData: [],
			// copy
			cityData: [],
			cityDataACurrent: 0,
			cityDataBCurrent: 0,
			cityDataCCurrent: -1,
			selectLocalVisible: false,

			// 选择玩法
			wfListChoice: [],

			// 选择分数
			fenListChoice: "1",
			fenList: this.$config.fenList,
			weixinGroupData: {
				name: "",
				info: ""
			}
		};
	},
	created() {
		console.info("created step ****** ****** ****** ****** ****** ******");

		// 获取城市列表
		this.ajaxGetCityData((error, data) => {
			if(error){
				console.error(error);
			} else {
				this.cityData = data;
				this.getDataAHtml();
				this.getDataBHtml(0);
				this.getDataCHtml(0);
				if(localStorage.location) {
					this.locationHasHistory();
				}
			}
		});

		// 获取麻将游戏平台列表
		this.ajaxGetGamesData();

		// 是否为编辑旧信息
		var pageQuery = this.$route.query;
		if(pageQuery.step==1 || pageQuery.step==2 || pageQuery.step==3 || pageQuery.step==6){
			this.ajaxGetRecruitDetail(pageQuery.id, (error, data) => {
				if(error) {
					// 获取招募详情失败
					// TODO-重新创建新的信息
				} else {
					this.step = pageQuery.step;
					this.stepData = data;

					this.stepHasHistory();
				}
			});
		}
	},
	mounted() {
		console.info("mounted step ****** ****** ****** ****** ****** ******");
	},
	methods: {
		stepHasHistory() {
			// 编辑过的信息
			if(this.stepData.weixin!=undefined && this.stepData.weixin.url!=undefined){
				this.dataId = this.stepData._id;

				this.codeData.url = this.stepData.weixin.url;
				this.codeData.upImage = this.stepData.weixin.image;
				this.codeData.image = '//pan.baidu.com/share/qrcode?w=240&h=240&url='+this.stepData.weixin.url;

				this.gameListChoice = this.stepData.game_sp;

				this.localData = [this.stepData.loc.loc_provinces, this.stepData.loc.loc_city, this.stepData.loc.loc_area];
				console.info("*** this.localData ***");
				console.info(this.localData);
				if(this.localData[0]==null) {
					this.localData = [];
				}

				this.wfListChoice = this.stepData.play_types;

				this.weixinGroupData.name = this.stepData.group_name;
				this.weixinGroupData.info = this.stepData.summary;
				// this.fenListChoice = this.stepData.score;

				this.gamesDataTags = this.stepData.sp.tags;

				if(this.step==6){
					this.newGameData.name = this.stepData.game_sp;
					this.newGameData.info = this.stepData.play_types;
					this.addNewGameVisible = true;

					this.stepShow = 4;
				} else {
					this.stepShow = Number(this.step)+1;
				}
			}
		},
		locationHasHistory() {
			// 有定位信息
			try {
				var locationJSON = JSON.parse(localStorage.location);
			} catch (error){
				console.info(error);
			}
			var localDataArray = [];
			if(locationJSON && locationJSON.province){
				var cityIndex = 0;
				for(var i=0;i<this.cityData.length;i++){
					if(this.cityData[i].name==locationJSON.province || this.cityData[i].name+"省"==locationJSON.province) {
						cityIndex = i;
						localDataArray.push(this.cityData[i].name);
						this.cityDataACurrent = i;
						this.onClickA(i);
						break;
					}
				}
				if(cityIndex && locationJSON.city){
					for(var j=0;j<this.cityData[cityIndex].city.length;j++){
						if(this.cityData[cityIndex].city[j].name==locationJSON.city || this.cityData[cityIndex].city[j].name+"市"==locationJSON.city) {
							localDataArray.push(this.cityData[cityIndex].city[j].name);
							this.cityDataBCurrent = j;
							this.onClickB(j);
							break;
						}
					}
				}

				// 选择游戏时切换省份
				for(var i=0;i<this.selectGamesCitySlots[0].values.length;i++){
					var item = this.selectGamesCitySlots[0].values[i];
					if(item==locationJSON.province || item+"省"==locationJSON.province) {
						this.selectGamesCitySlotsChoice = item;
						this.selectGamesCityValue = item;
						break;
					}
				}

			}
			if(localDataArray.length>0){
				this.localData = localDataArray;
			}
		},
		ajaxGetRecruitDetail(id, callback) {
			// 招募信息-获取招募详情
			this.$http.post("/api/servers/getRecruitDetail", {
				id: id
			}).then(function(data){
				data = data.body;
				if(data.status==0){
					data = data.data;
					callback(null, data);
				} else {
					console.warn("获取招募详情，返回错误");
					console.error(data);
					callback("获取招募详情失败", null);
				}
			}, function(error){
				console.warn("返回失败：");
				console.error(error);
				callback(error, null);
			});
		},
		ajaxGetCityData(callback) {
			this.$http.post("/api/getCityList", {
				type: 1
			}).then(function(data){
				data = data.body.data;
				callback(null, data);
			}, function(error){
				console.warn("请求城市列表失败！");
				callback(error, null)
			});
		},
		ajaxGetGamesData(){
			// 招募信息-获取麻将游戏平台列表
			this.$http.post("/api/servers/getGamesSpList", {
				provinces: this.selectGamesCityValue
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					this.gamesData = data.data;
				} else {
					console.info("返回错误");
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		},
		choseGamesCity() {
			// 切换厂牌游戏省份
			this.selectGamesCityVisible = true;
		},
		onValuesChange(picker, values) {
			console.info(picker);
			console.info(values);
			this.selectGamesCitySlotsChoice = values[0];

			let Index = this.selectGamesCitySlots[0].values.findIndex(item => item==values[0]);
			console.info(Index);
		},
		onClickSelectGamesCitySure() {
			this.selectGamesCityValue = this.selectGamesCitySlotsChoice;
			this.selectGamesCityVisible = false;
			this.gameListChoice = "";
			this.stepCompletion = false;
			this.ajaxGetGamesData();
		},

		onClickPrevStep() {
			console.info(this.stepShow);
			if(this.stepShow==4 && 0){
				this.stepShow = this.stepShow-2;
			} else {
				this.stepShow--;
			}
			this.stepCompletion = true;
		},
		stepSubmit() {

//			console.info(localStorage);
//			var locations = JSON.parse(localStorage.location);
//			console.info(locations);
//			console.info(locations.point.x);


			/**
			 * 没有完成当前步骤时，提示先请完成当前步骤
			 **/
			if(!this.stepCompletion){
				Toast('请按要求完成当前步骤');
				return false;
			}
			/**
			 * 执行提交任务
			 **/
			if(this.stepShow==1){
				console.info("上传二维码 提交 +++++++++++++++");
				console.info(JSON.stringify(this.codeData));
				console.info(this.codeData);

				// 第一步 -- 发布招募信息-保存用户二维码
				this.$http.post("/api/servers/sendRecruitBindQrcode", {
					url: this.codeData.url,
					image: this.codeData.upImage,
					step: 1
				}).then(function(data){
					data = data.body;
					console.info(data);
					if(data.status==0){
						console.info("保存成功-A");
						this.dataId = data.data.id;
						this.nextStep(1);
					} else {
						console.info("保存失败-A");
					}
				}, function(error){
					console.info("返回失败"+error);
				});

			} else if(this.stepShow==2){
				console.info("选择游戏 提交 +++++++++++++++");
				// 新添加游戏时
				if(!this.addNewGameVisible){
					console.info("选择了一个游戏");
					console.info(this.gameListChoice);

					// 第二步 -- 发布招募信息-绑定游戏
					this.$http.post("/api/servers/sendRecruitBindGameSp", {
						mj_sp: this.gameListChoice,
						id: this.dataId,
						step: 2
					}).then(function(data){
						data = data.body;
						console.info(data);
						if(data.status==0){
							console.info("保存成功-B");

							// 选择默认的游戏玩法
							var wfListChoiceDefault = [];
							if(this.gamesDataTags.length>=1){
								wfListChoiceDefault.push(this.gamesDataTags[0]);
							}
							this.wfListChoice = wfListChoiceDefault;
							this.nextStep(1);
						} else {
							console.info("保存失败-B");
						}
					}, function(error){
						console.info("返回失败"+error);
					});
				} else {
					console.info("新添加了一个游戏");
					console.info(this.localData);
					console.info(this.newGameData);

					if(this.localData.length!=3){
						Toast('所在地信息不完整！');
						return false;
					}
					var lngData = 0;
					var latData = 0;
					if(localStorage.location!=undefined && localStorage.location!=""){
						if(JSON.parse(localStorage.location).point.x){
							lngData = JSON.parse(localStorage.location).point.x;
						}
						if(JSON.parse(localStorage.location).point.y){
							lngData = JSON.parse(localStorage.location).point.y;
						}
					}
					// 第零步 -- 发布招募信息-绑定游戏地区
					this.$http.post("/api/servers/sendRecruitBindLoc", {
						id: this.dataId,
						loc_provinces: this.localData[0],
						loc_city: this.localData[1],
						loc_area: this.localData[2],
						lng: lngData,
						lat: latData,
						step: 100
					}).then(function(data){
						data = data.body;
						console.info(data);
						if(data.status==0){
							console.info("保存成功-E1");

							// 第六步 -- 发布招募信息 - 添加用户自定义麻将
							this.$http.post("/api/servers/snedRecruitBindDiyGame", {
								id: this.dataId,
								mj_sp: this.newGameData.name,
								play_types: this.newGameData.info,
								step: 6
							}).then(function(data){
								data = data.body;
								console.info(data);
								if(data.status==0){
									console.info("保存成功-E2");
									this.nextStep(2);
								} else {
									console.info("保存失败-E2");
								}
							}, function(error){
								console.info("返回失败"+error);
							});
						} else {
							console.info("保存失败-E1");
						}
					}, function(error){
						console.info(error);
					});
				}
			} else if(this.stepShow==3){
				console.info("选择玩法 提交 +++++++++++++++");
				console.info(this.localData);
				console.info(this.wfListChoice);

				if(this.localData.length!=3){
					Toast('所在地信息不完整！');
					return false;
				}
				var lngData = 0;
				var latData = 0;
				if(localStorage.location!=undefined && localStorage.location!=""){
					if(JSON.parse(localStorage.location).point.x){
						lngData = JSON.parse(localStorage.location).point.x;
					}
					if(JSON.parse(localStorage.location).point.y){
						lngData = JSON.parse(localStorage.location).point.y;
					}
				}
				// 第零步 -- 发布招募信息-绑定游戏地区
				this.$http.post("/api/servers/sendRecruitBindLoc", {
					id: this.dataId,
					loc_provinces: this.localData[0],
					loc_city: this.localData[1],
					loc_area: this.localData[2],
					lng: lngData,
					lat: latData,
					step: 100
				}).then(function(data){
					data = data.body;
					console.info(data);
					if(data.status==0){
						console.info("保存成功-C1");

						// 第三步 -- 发布招募信息-绑定游戏玩法
						this.$http.post("/api/servers/sendRecruitBindGamePlayTypes", {
							id: this.dataId,
							play_types: this.wfListChoice.join(","),
							step: 3
						}).then(function(data){
							data = data.body;
							console.info(data);
							if(data.status==0){
								console.info("保存成功-C2");
								this.nextStep(1);

								if(this.gameListChoice){
									this.weixinGroupData.name = this.localData[2]+this.gameListChoice+"游戏群";
								} else if(this.newGameData && this.newGameData.name){
									this.weixinGroupData.name = this.localData[2]+this.newGameData.name+"游戏群";
								}

							} else {
								console.info("保存失败-C2");
							}
						}, function(error){
							console.info("返回失败"+error);
						});
					} else {
						console.info("保存失败-C1");
					}
				}, function(error){
					console.info(error);
				});

			} else if(this.stepShow==4){
				console.info("设置群信息 提交");
				console.info(this.weixinGroupData);
				console.info(this.fenListChoice);

				// 第四步 --发布招募信息-绑定群资料
				this.$http.post("/api/servers/sendRecruitBindGroupInfo", {
					id: this.dataId,
					group_name: this.weixinGroupData.name,
					score: this.fenListChoice,
					summary: this.weixinGroupData.info,
					step: 4
				}).then(function(data){
					data = data.body;
					console.info(data);
					if(data.status==0){
						console.info("保存成功-D");
						Toast('恭喜您，提交成功，请等待审核！');
						setTimeout(() => {
							window.location.href="/";
						}, 2000);
					} else {
						console.info("保存失败-D");
					}
				}, function(error){
					console.info("返回失败"+error);
				});
			}
		},
		nextStep(index) {
			/**
			 * 进入下一步
			 **/
			this.stepShow = this.stepShow+index;
			this.stepCompletion=false;
			if(this.stepShow==4){
				this.stepSubmitText = "确认提交"
			}
		},
		onUpfileBack(file) {
			console.info("上传成功了!");
			console.info(file);
			console.info(JSON.stringify(file));
			console.info(file.response);
			let response = file.response;
			console.info(response.data.url);
			console.info(response.data.url+"!720x.jpg");
			if(response.status==0){
				this.codeData.upImage = response.data.url;
				this.onUpCode();
			} else {
				Toast('上传失败');
			}
		},
		onUpCode() {
			console.info("onUpCode start~");
			Indicator.open('二维码解析中...');

			// 测试使用
			/*		setTimeout(() => {

			 this.codeData.url = "http://weixin.qq.com/r/XqEbA0vERhY5rQ9g9-RM";

			 this.codeData.image = '//pan.baidu.com/share/qrcode?w=240&h=240&url='+"http://weixin.qq.com/r/XqEbA0vERhY5rQ9g9-RM";

			 this.codeData.typeText = "重新上传";
			 this.stepCompletion = true;
			 Indicator.close();
			 Toast('上传成功');
			 }, 1000);*/
//			return false;
			this.$http.post('/api/weixin/readcode', {
				img_url: this.codeData.upImage+"!720x.jpg"
			}).then(function (data) {
				console.info("third servers readcode back~");
				data = data.body;
				console.info(data);
				console.info(JSON.stringify(data));
				data = data.data;
				if(data.status==0 && data.result.text!=""){
					// url验证通过，
					if (data.result.text!=""){
						this.codeData.url = data.result.text;
						this.codeData.image = '//pan.baidu.com/share/qrcode?w=240&h=240&url='+data.result.text;
						this.codeData.typeText = "重新上传";
						this.stepCompletion = true;
						Indicator.close();
						Toast('上传成功');
					} else {
						Indicator.close();
						Toast('解析二维码失败，请务必上传个人微信二维码！');
					}
				} else {
					console.info("获取失败");
					Toast('解析二维码失败，请务必上传个人微信二维码！');
					Indicator.close();
				}
			}, function (error) {
				console.info("二维码解析服务失败！");
				console.info(error);
				Indicator.close();
			});
		},
		onClickChoiceGame(name, index) {
			this.gameListChoice = name;
			this.gamesDataTags = this.gamesData[index].tags;
			this.stepCompletion = true;
		},
		/**
		 * 添加新游戏
		 **/
		onClickCreateNewGame() {
			// 创建新游戏
			console.info("onClickCreateNewGame +++++++++");
			this.gameListChoice = [];
			this.stepCompletion = false;
			this.addNewGameVisible = true;
			// this.stepSubmitText = "确定添加";
		},
		onClickCancelAddNewGame() {
			// 取消创建新游戏
			console.info("onClickCancelAddNewGame ------");
			this.stepCompletion = false;
			this.addNewGameVisible = false;
			this.newGameData = {
				name: "",
				info: ""
			};
			// this.stepSubmitText = "下一步";
		},
		/**
		 * 填写所在地区
		 **/
		onClickSelectLocal() {
			this.selectLocalVisible = true;
		},
		// 获取所有省份
		getDataAHtml() {
			var cityDataA = [];
			for(var i=0;i<this.cityData.length;i++){
				cityDataA.push(this.cityData[i].name)
			}
			// console.info(cityDataA);
			this.cityDataA = cityDataA;
			//this.localData[0] = cityDataA[0];
		},
		// 获取所有城市，根据index
		getDataBHtml(index) {
			//console.info("getDataBHtml "+index);
			var cityDataB = [];
			for(var i=0;i<this.cityData[index].city.length;i++){
				cityDataB.push(this.cityData[index].city[i].name)
			}
			console.info(cityDataB);
			this.cityDataB = cityDataB;
			//this.localData[1] = cityDataB[0];
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
			console.info(cityDataC);
			this.cityDataC = cityDataC;
			//this.localData[2] = cityDataC[0];
		},
		// 切换省-事件
		onClickA(index, _this) {
			console.info("----------------onClickA--------------");
			console.info(index);
//			console.info(_this.target.innerText);
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
			this.localData = choseArray;
			this.selectLocalVisible = false;
			this.checkStepIsCompletionC();
		},
		/**
		 * 选择玩法
		 **/
		onChoseWanfa(index) {
			console.info("onChoseWanfa --------------------");
			console.info(index);
			console.info(JSON.stringify(this.wfListChoice));

			// 这个元素还没有添加到数组中时
			if(this.wfListChoice.findIndex(item => item==index)==-1){
				if(this.wfListChoice.length<3){
					this.wfListChoice.push(index);
				}
			} else {
				this.wfListChoice.splice(this.wfListChoice.findIndex(item => item==index), 1);
			}

			// 判断是否已经完成了这一步
			if(!this.addNewGameVisible){
				this.checkStepIsCompletionC();
			} else {
				this.checkStepIsCompletionE();
			}
		},
		onChoseFen(id) {
			// 已经添加到数组中时
			if(this.fenListChoice!=id){
				this.fenListChoice=id;
			}
			this.checkStepIsCompletionD();
		},
		/**
		 * 检查某一步是否完成了
		 **/
		checkStepIsCompletionA() {
		},
		checkStepIsCompletionB() {
		},
		checkStepIsCompletionC() {
			if(this.wfListChoice.length>0 && this.localData.length>0){
				this.stepCompletion = true;
			} else {
				this.stepCompletion = false;
			}
		},
		checkStepIsCompletionD() {
			if(this.weixinGroupData.name && this.weixinGroupData.info && this.fenListChoice){
				if(this.weixinGroupData.info.length>128){
					Toast('群介绍文字不能超过128字');
				} else if(this.weixinGroupData.name.length>20){
					Toast('群标题不能超过20字');
				} else {
					this.stepCompletion = true;
				}
			} else {
				this.stepCompletion = false;
			}
		},
		checkStepIsCompletionE() {
			console.info("checkStepIsCompletionE");
			console.info("checkStepIsCompletionE");
			if(this.newGameData.name && this.newGameData.info && this.localData.length>0){
				this.stepCompletion = true;
			} else {
				this.stepCompletion = false;
			}
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" >

body
	overflow-x hidden

.page_step
	.picker_local_box
		width 100%
		background #fff
		.picker_local_title
			border-bottom 1px solid #eee
			padding 0.3rem
			position relative
			a.goright
				right 0.3rem
				top 0.3rem

	.step_box
		width 100%
		height 100%
		background #fff
		position absolute
		top 0
		left 0
		/*标题*/
		.step_title
			text-align center
			padding 0.6rem 0
			h3
				font-size 0.5rem
				color #333
				line-height 1rem
			p
				font-size 0.35rem
				color #999
		/*进度条*/
		.step_line
			width 100%
			height 0.4rem
			position relative
			overflow hidden
			.step_bar
				width 300%
				position absolute
				top 0
				left 0
				.dit, .line
					display inline-block
					position absolute
				.dit
					width 0.3rem
					height 0.3rem
					background #fff
					border 0.05rem solid #fc8048
					border 0.05rem solid #fcb648
					border-radius 100%
					top 0
					z-index 10
				.line
					width 10rem
					height 0.1rem
					background #ececee
					top 0.15rem
				.dit_current
					background #fcb648
					transition: all .4s ease;
				.dit_1
					left 5rem
				.line_1
					left 5rem
				.dit_2
					left 15rem
				.line_2
					left 15rem
				.dit_3
					left 25rem
				.line_3
					left 25rem
				.dit_4
					left 35rem
				.line_4
					left 35rem
				.dit_5
					left 45rem
		/*内容区域*/
		.step_content
			position relative
			padding 0.5rem
		/*页脚说明*/
		.step_footer_info
			background #f6f6f6
			border-top 1px solid #d6d6d6
			padding 0.3rem 0.4rem 1.8rem
			p
				color #333
				font-size 0.4rem
				line-height 0.8rem
				font-weight 800
			ul
				padding 0 0.4rem
				li
					line-height 0.6rem
					font-size 0.35rem
					color #919191
					list-style-type decimal
		/*通用的表单*/
		.form_title
			font-size 0.45rem
			color #333
			margin 0.6rem 0 0.3rem
		.form_item
			input, textarea
				box-sizing border-box
				width 100%
				border-radius 0.15rem
				border 1px solid #ddd
				position relative
				padding 0.3rem
				line-height 0.6rem
				font-size 0.4rem
				color #333
			textarea
				height 3rem
		.form_notice
			font-size 0.35rem
			color #666
			padding 0.3rem 0


	/*下一步按钮*/
	.step_bottom_fix
		display block
		position fixed
		left 0
		bottom 0
		width 100%
		text-align center
		line-height 1.2rem
		a.btn_bottom
			display block
			width 100%
			float left
			background #fc8048
			color #fff
			font-size 0.45rem
		a.btn_bottom_prev
			width 30%
			background #656565
		a.btn_bottom_next
			width 70%
	.step_completion
		a.btn_bottom
			background #fdbfa3
		a.btn_bottom_prev
			background #656565





	/*上传二维码*/
	.update_img
		padding 0.2rem 0 0.5rem
		text-align center
		img
			width 50%
	.update_formbox
		padding 0 0 0.5rem
		text-align center
		.upfile_box
			width 50%
			a
				display inline-block
				width 100%
				text-align center
				border 1px solid #fc8048
				color: #fc8048
				border-radius 0.15rem
				line-height 1.2rem

	/*选择游戏*/


	/*选择地区 以下样式为复制的*/
	._box
		background #fff
		max-height 8rem
		height 8rem
		padding 0
		border-top 1px solid #e2e2e4
	._box_content
		height auto
		padding 0.6rem 0
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
	/*end here*/


	/*选择游戏-切换省份*/
	.chose_game_chosecity
		line-height 1.2rem
		border-bottom 1px solid #e9e9e9
		position relative
		margin-top -0.4rem
		margin-bottm 0.4rem
		padding 0 0.3rem
		a.goright
			right 0.3rem
			color #2088c4
	/*选择游戏*/
	ul.chose_game
		padding 0.5rem 0.2rem
		li
			display inline-block
			width 33.33%
			float left
			text-align center
			line-height 0.5rem
			margin-bottom 0.5rem
			color #9c9c9e
			position relative
			img
				width 2rem
			img.checked_img
				display none
				position absolute
				top 0
				left 50%
				margin-left -1rem
				z-index 10
			&.current
				color #393a3d
				img.checked_img
					display block



	.chose_address
		.selectd_box
			border-radius 0.15rem
			border 1px solid #ddd
			position relative
			padding 0.3rem
			line-height 0.6rem
			font-size 0.45rem
			color #333
			img
				width 0.5rem
				position relative
				margin-right 0.3rem
				top 0.05rem
			.goright
				font-size 0.35rem
				top 0.35rem
				right 0.3rem
				color #ddd
		p
			padding 0.3rem
			font-size 0.3rem
			color #999

	.chose_wf
		margin-top 0.5rem
		ul li
			border 1px solid #ddd
			width 33%
			text-align center
			line-height 1.2rem
			float left
			margin-top -1px
			margin-right -1px
			position relative
			img
				display none
				position absolute
				bottom 0
				right 0
				width 0.9rem
		ul li.current
			border 1px solid #3fd589
			z-index 10
			img
				display block
		p
			padding 0.3rem
			font-size 0.3rem
			color #999

	.reg_box
		.input_box
			float left
			border 1px solid #ddd
			border-radius 0.15rem
			position relative
			padding-left 1.2rem
			margin-bottom 0.4rem
			width 7.8rem
			input
				padding 0.4rem
				border 0
				border-left 1px solid #ddd
				width 80%
				line-height 0.6rem
				background none
			img
				width 0.4rem
				position absolute
				top 50%
				left 0.4rem
				margin-top -0.2rem
		.input_box_short
			width 4rem
		.send_code
			float left
			width 3.4rem
			border 1px solid #fc8048
			border-radius 0.15rem
			color #fc8048
			text-align center
			margin-left 0.3rem
			padding 0.4rem 0
			line-height 0.58rem






	/*

	.update_formbox
		padding 0.8rem 0
		text-align center
		a
			display block
			border 1px solid #fc8048
			padding-left 0.5rem
			text-align center
			color: #fc8048
			border-radius 0.15rem
			line-height 1.2rem
			position relative
			img
				position absolute
				top 50%
				margin-top -0.2rem
				width 0.4rem
				left 0.4rem
	*/

	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */
	.slide-left-enter-active, .slide-left-leave-active {
		transition: all .4s ease-in-out;
	}

	.slide-left-enter-active {
		opacity 1
		transform: translateX(0);
	}
	.slide-left-enter {
		transform: translateX(10rem);
		opacity: 0;
	}
	.slide-left-leave-active {
		transform: translateX(-10rem);
		opacity: 0;
	}
</style>