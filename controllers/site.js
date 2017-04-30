"use strict";

var eventproxy = require('eventproxy');
var config = require('../common/config');
var logger = require('../common/logger');
var serversApi = require('../models/serversApi');

exports.index = function (req, res, next) {

	// locals
	res.locals.static_host = config.static_host;
	res.locals.build_host = config.webpackServer.host;
	res.locals.query = req.query;
	res.locals.v = config.v;
	res.locals.webHost = config.host;
	res.locals.cookie_uid = req.cookies[config.authCookieName];

	if(req.session.user && req.session.user.auth_token){

		var ep = new eventproxy();
		ep.fail(next);

		// 用户模块 - 我的信息
		serversApi.userGetMyInfo({
			auth_token: req.session.user.auth_token
		}, ep.done('userData'));

		ep.all('userData', function (userData) {
			if(userData.status==0){
				res.render('index', {
					title: "找麻将",
					user: userData.data
				});
			} else {
				return res.redirect("/user/logout");
			}
		});
	} else {
		res.render('index', {
			title: "找麻将"
		});
	}
};


/** 用户分享注册id */
exports.shareUserId = function (req, res, next) {
	let cookie_uid = req.cookies[config.authCookieName];
	if(req.params.uid) {
		if(!cookie_uid){
			res.cookie(config.authCookieName, req.params.uid, {domain: config.cookieDomain});
			logger.debug("〓〓〓 进入写入分享id页面，写入id成功："+req.params.uid+" 跳至首页");
			res.redirect("/");
		} else {
			logger.debug("〓〓〓 进入写入分享id页面，但是已存在原id："+cookie_uid+"，因此无法写入成功，现传的id为："+req.params.uid+" 跳至首页");
			res.redirect("/");
		}
	} else {
		logger.debug("〓〓〓 进入写入分享id页面，但是无有效req.params.uid"+" 跳至首页");
		res.redirect("/");
	}
};


/** 登录 */
exports.loginPost = function (req, res, next) {
	logger.info("------------------------ Welcome to user loginPost ------------------------");
	logger.info(req.body);
	logger.info(req.session);

	// 用户模块 -  登陆
	serversApi.loginByUser({
		user: req.body.phone,
		password: req.body.password
	}, function(error, data){
		logger.info(data);
		if(error){
			res.send({
				status: -1,
				message: error
			});
		} else {
			if(data.status==0){
				if(data.data.auth_token){
					logger.info(data.data.auth_token);
					req.session.user = {
						id: data.data.auth_token,
						auth_token: data.data.auth_token
					};
					logger.info(req.session);

					// 用户模块 - 我的信息
					serversApi.userGetMyInfo({
						auth_token: data.data.auth_token
					}, function(error2, userData){
						if(error2){
							res.send({
								status: -1,
								message: error2
							});
						} else {
							if(userData.status==0){
								res.send({
									status: 0,
									message: "登录成功",
									data: userData.data
								});
							} else {
								res.send({
									status: 2,
									message: "获取用户信息失败！",
									data: userData
								});
							}
						}
					});
				} else {
					res.send({
						status: 9,
						message: "找不到auth_token"
					});
				}
			} else {
				res.send({
					status: 1,
					message: data.message,
					data: data
				});
			}
		}
	});
};


/** 退出登录-get */
exports.logout = function (req, res, next) {
	logger.warn("logout in");
	if(req.session.user){
		// 用户模块  - 注销
		serversApi.Hkx9FhaJUe({
			auth_token: req.session.user.auth_token
		}, function(error, data){
			logger.info("logout back");
			logger.info(error);
			logger.info(data);
			if(error){
				delete req.session.user;
				res.redirect("/u/my");
			} else {
				// 报错也强制退出
				delete req.session.user;
				res.redirect("/u/my");
			}
		});
	} else {
		res.redirect("/u/my");
	}
};


/** 获取我的资料 */
exports.getMyInfo = function (req, res, next) {
	if(req.session.user && req.session.user.auth_token){

		var ep = new eventproxy();
		ep.fail(next);

		// 用户模块 - 我的信息
		serversApi.userGetMyInfo({
			auth_token: req.session.user.auth_token
		}, ep.done('data1'));

		// 用户 -- 我发布的麻将
		serversApi.userGetMyRecruit({
			auth_token: req.session.user.auth_token,
			page: 0
		}, ep.done('data2'));

		// 用户 -- 我购买的产品(麻将群信息)
		serversApi.userGetMyBuysRecruit({
			auth_token: req.session.user.auth_token
		}, ep.done('data3'));

		// 钱包 - 钱包余额
		serversApi.vbankGetMyFees({
			auth_token: req.session.user.auth_token
		}, ep.done('data4'));


		ep.all('data1', 'data2', 'data3', 'data4', function (data1, data2, data3, data4) {
			if(data1.status==0){
				res.send({
					status: 0,
					message: "获取用户信息成功",
					data: {
						userData: data1.data,
						recruitData: data2.data,
						myBuysData: data3.data,
						myFees: data4.data
					}
				});
			} else {
				res.send({
					status: 1,
					message: "用户信息获取错误"
				});
			}
		});

	} else {
		res.send({
			status: -1,
			message: "用户信息获取失败"
		});
	}
};


// 充值和消费流水
exports.getMyFeesWater = function (req, res, next) {

	var ep = new eventproxy();
	ep.fail(next);

	// 钱包 - 余额
	serversApi.vbankGetMyFees({
		auth_token: req.session.user.auth_token
	}, ep.done('data1'));

	// 钱包 - 流水
	serversApi.vbankGetWaterList({
		auth_token: req.session.user.auth_token
	}, ep.done('data2'));

	ep.all('data1', 'data2', function (data1, data2) {
		res.send({
			status: 0,
			message: "获取消费流水成功",
			data: {
				myFees: data1.data,
				myFeesList: data2.data
			}
		});
	});

};