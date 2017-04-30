<template>
	<div class="page_mypage">
		<div class="re_top">
			<h4>福利点充值</h4>
			<p>福利点充值</p>
		</div>

		<div class="re_list">
			<ul class="cf">
				<li v-for="(item, index) in rechargeOptions" :class="{current:index==rechargeOptionsChoice}" @click="rechargeOptionsChoice=index">
					<p class="_title">{{item.rmb}}元</p>
					<p class="_info">{{item.name}}</p>
					<img src="../../static/img/wf_checked.png">
				</li>
			</ul>
		</div>

		<div class="re_submit">
			<p @click="onClickSubmit"><a href="#">去支付</a></p>
		</div>
		<div class="re_fx">
			<p @click="onClickFxSubmit"><a href="#">分享，获得免费福利点</a></p>
		</div>
		<div class="re_fxtxt">

			<input id="foo" :value="'刚刚才发现，原来在我家周围有这么多打麻将的微信群，你家周围多不？'+webHost+'/v/'+userData._id" style="position: absolute; top: -9999px; left: -9999px;">
			<input value="点击复制" type="button" class="btn_copy" data-clipboard-target="#foo" id="js_go_foo" style="position: absolute; top: -9999px; left: -9999px;">
		</div>

			<!--选择所在地区-->
		<mt-popup v-model="selectFxVisible" popup-transition="popup-fade" position="bottom" style="width:100%">
			<div class="picker_fx_box">
				<div class="picker_fx_title">
					分享得福利点
					<a href="javascript:void(0)" class="goright" @click="selectFxVisible=false">取消</a>
				</div>
				<div class="_box _boxs cf" @click.stop>
					<div class="fx_txt">
						<h5>您已获得福利点：{{myPoints}}（已推荐{{invitePersons}}人）</h5>
						<!--<p>1、分享获得1个福利点</p>-->
						<!--<p>1、分享链接</p>-->
						<!--<p>1、每邀请3个好友注册后，获得1个福利点。</p>-->
						<!--<p>2、如果邀请的好友发布招募信息并审核通过，额外多获得1个福利点。</p>-->
						<!--<p>3、每个账户最多可免费获得5个福利点。</p>-->
						<ul>
							<li>复制下方文字内容，发送给好友邀请注册;</li>
							<li>每邀请3个好友注册成功后，可获得1个福利点，通过好友注册最多可获得5个福利点。</li>
							<li>如果邀请的好友发布招募信息并审核通过，可额外获得1个福利点，上不封顶！</li>
						</ul>
					</div>
					<div class="fx_copy">
						<p>刚刚才发现，原来在我家周围有这么多打麻将的微信群，你家周围多不？{{webHost}}/v/{{userData._id}}</p>
						<!--<p>刚发现，原来我家周围有这么多打麻将的微信群！快来找找你家周围的麻将群吧！{{webHost}}/u/{{userData._id}}</p>-->
					</div>
					<div class="fx_btn">
						<a href="javascript:void(0)" @click="onClickCopy">复制分享</a>
					</div>

					<!--<div class="fx_btns">-->
					<!--<a href="javascript:void(0)"><img src="/img/fx_1.png"><br>微信好友</a>-->
					<!--<a href="javascript:void(0)"><img src="/img/fx_2.png"><br>腾讯QQ</a>-->
					<!--<a href="javascript:void(0)"><img src="/img/fx_3.png"><br>微信朋友圈</a>-->
					<!--<a href="javascript:void(0)" @click="onClickCopy"><img src="/img/fx_4.png"><br>复制链接</a>-->
					<!--</div>-->
				</div>
			</div>
		</mt-popup>

	</div>
</template>

<script type="text/ecmascript-6">

// import
import Clipboard from '../../static/script/clipboard.min.js'

// main
export default {
	name: 'my',
	data() {
		return {
			webHost: this.$global.webHost,
			userData: this.$global.user,
			invitePersons: 0,
			myPoints: 0,
			rechargeOptions: [{
				fees: 1,
				rmb: 10,
				name: "1个福利点"
			}, {
				fees: 6,
				rmb: 50,
				name: "6个福利点"
			}, {
				fees: 13,
				rmb: 100,
				name: "13个福利点"
			}],
			rechargeOptionsChoice: 0,
			selectFxVisible: false
		};
	},
	created() {
		this.ajaxGetExtendBenefits();

		var clipboard = new Clipboard('.btn_copy');
		clipboard.on('success', e => {
			// console.info('Action:', e.action);
			// console.info('Text:', e.text);
			// console.info('Trigger:', e.trigger);
			this.selectFxVisible = false;
			this.MessageBox({
				title: "内容复制成功",
				message: "赶紧通过微信、QQ、QQ空间等任意社交平台发给好友，邀请他们注册吧。"
			});
			e.clearSelection();
		});

		clipboard.on('error', e => {
			// console.error('Action:', e.action);
			// console.error('Trigger:', e.trigger);
			this.MessageBox({
				title: "内容复制失败",
				message: "请稍后再试，或者换个浏览器吧！"
			});
		});
	},
	methods: {
		onClickSubmit: function() {
			console.info("onClickChoiceRechargeOptions happen");
			this.MessageBox({
				title: "提示",
				message: "在线充值暂未开通，请联系官方客服微信号：majiang778进行充值！"
			});
			// this.ajaxChangePassword(this.rechargeOptions[this.rechargeOptionsChoice]);
		},
		onClickFxSubmit: function() {
			// 分享
			this.selectFxVisible = true;
		},
		onClickCopy: function() {
			// 复制到剪切板
			$("#js_go_foo").click();
		},
		ajaxChangePassword: function(obj) {
			// 钱包 - 充值
			this.Indicator.open();
			this.$http.post("/api/servers/vbankRecharge", {
				fees: obj.fees,
				summary: "充值"+obj.name
			}).then(function(data){
				data = data.body;
				console.info(data);
				console.info(JSON.stringify(data));
				this.Indicator.close();
				if(data.status==0){
					this.Toast({
						message: '充值成功',
						iconClass: 'icon icon-success'
					});
					setTimeout(() => {
						this.$router.push({path: '/u/my'})
					}, 2000);
				} else {
					this.Toast(data.message);
				}
			}, function(error){
				console.info("返回失败"+error);
			});
		},
		ajaxGetExtendBenefits: function() {
			// 钱包 - 我的额外收入
			this.$http.post("/api/servers/HJebFCeZCg").then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					// do something
					data = data.data;
					var my_points = 0;
					for(var i=0; i<data.list.length; i++){
						var item = data.list[i];
						if(item.source_type==2 || item.source_type==4){
							my_points += item.fees;
						}
					}
					this.myPoints = my_points;
					if(data.invite_persons){
						this.invitePersons = data.invite_persons;
					}
				} else {
					console.info("返回错误");
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>