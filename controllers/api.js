"use strict";
var request = require('request');
var fs = require('fs');

var config = require('../common/config');
var logger = require('../common/logger');
var servers = require('../common/servers');
var serversApi = require('../models/serversApi');
var cityList = require('../common/citys.json');


/** 获取城市列表 */
exports.getCityList = function (req, res, next) {
	if(req.body.type==1){
		let backData = cityList.slice(0);
		backData.shift();
		res.send({
			status: 0,
			message: "所有城市列表，不包括全国",
			data: backData
		})
	} else {
		res.send({
			status: 0,
			message: "所有城市列表",
			data: cityList
		})
	}
};

/** 查询用户的ip地址，返回经纬度 */
exports.getIpLocation = function (req, res, next) {
	// var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress);
	// var ip = req.ip;
	var ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;


	ip = ip.split(":");
	ip = ip[ip.length-1];
	logger.info("getIpLocation");
	logger.debug("查询用户的ip地址，返回经纬度 --------------->", ip);

	var url = "http://api.map.baidu.com/location/ip";
	var obj = {
		ak: "2umdAjov8gd6GjAbgbxgHYe12ZAHzHlg",
		ip: ip,
		coor: "bd09ll"
	};

	servers.ajaxGet(url, obj, function(error, data){
		logger.debug("查询用户的ip地址【back】 <---------------", ip);
		logger.debug(data);
		// logger.info(typeof(data));
		if(error){
			res.send({
				status: -1,
				message: "获取数据库失败"
			});
		} else {
			if(data.content!=undefined && data.content){
				res.send({
					status: 0,
					message: "获取地理位置成功",
					data: data.content
				});
			} else {
				res.send({
					status: 1,
					message: "无法获取地理位置"
				});
			}
		}
	});




};




exports.readcode = function (req, res, next) {
	logger.info(req.body);
	var url = "http://api.jisuapi.com/qrcode/read";
	var obj = {
		//qrcode: "http://www.uyun.net:6001/code/3.jpg",
		qrcode: req.body.img_url,
		appkey: "47b5cfcffad4e959"
	};
	servers.ajaxGet(url, obj, function(error, data){
		logger.debug("识别二维码 back +++++++++++");
		logger.debug(data);
		// logger.info(typeof(data));
		if(error){
			res.send({
				status: -1,
				message: "请求出错了",
				data: data,
				error: error
			});
		} else {
			logger.info(data.result.text);
			if(data.status==0){
				var backUrl = data.result.text;
				logger.info(backUrl.indexOf("http://weixin.qq.com/r"));
				if(backUrl.indexOf("http://weixin.qq.com/r")==0){
					res.send({
						status: 0,
						message: "解析成功",
						data: data,
						url: backUrl
					});
				} else {
					res.send({
						status: 2,
						message: "上传的二维码地址不是微信个人名片",
						data: backUrl
					});
				}
			} else {
				res.send({
					status: 3,
					message: data.msg,
					data: data
				});
			}



			/*servers.ajaxGet("http://api.jisuapi.com/qrcode/generate", {
			 text: data.result.text,
			 appkey: "47b5cfcffad4e959",
			 width: 160,
			 margin: 10
			 }, function(error, data){
			 logger.info("generate back~");
			 logger.info(error);
			 logger.info(data);
			 res.send(data);
			 });*/
		}
	});

};




exports.writeServersApi = function (req, res, next) {

	var url = config.mock.serversApiFileUrl;
	logger.info(url);
	if(url==undefined || url==""){
		res.send({
			status: 4,
			message: "文件读取地址配置错误，请重新配置",
			url: url
		});
		return false;
	}
	request.get({
		url: url
	}, function (error, response, body) {
		// logger.info(body);
		if(error){
			res.send({
				status: -1,
				message: "文件读取失败",
				url: url,
				data: error
			})
		} else if(body==undefined) {
			res.send({
				status: 1,
				message: "文件读取失败",
				url: url,
				data: "undefined"
			})
		} else if(body=="") {
			res.send({
				status: 2,
				message: "文件读取为空",
				url: url,
				data: ""
			})
		} else {
			fs.writeFile('models/serversApi.js', body, function(err){
				if(err){
					res.send({
						status: 3,
						message: "文件写入失败",
						url: url,
						data: err
					})
				} else {
					res.send({
						status: 0,
						url: url,
						message: "models/serversApi.js 更新成功"
					})
				}
			});
		}

	});

};











exports.servers = function (req, res, next) {
	// 检查方法是否存在
	if(req.params.id==undefined || serversApi[req.params.id]==undefined){
		res.send({
			status: 1,
			message: "找不到这个方法！"
		});
		return false;
	}
	// 初始化参数
	if(req.session.user && req.session.user.auth_token){
		req.body.auth_token = req.session.user.auth_token;
	}
	// 如果设置了登录用户才能访问
	if(req.body.must_login && !req.body.auth_token){
		res.send({
			status: 8,
			message: "请登录后继续操作"
		});
		return false;
	}

	logger.info(req.body);

	// 发送请求
	serversApi[req.params.id](req.body, function(error, data){
		if(error){
			res.send({
				status: -1,
				message: "请求出错了",
				error: error
			});
		} else {
			if(typeof(data)!="object"){
				res.send({
					status: 0,
					message: "返回不是一个标准的json格式",
					data: data
				});
			} else {
				res.send(data);
			}
		}
	});

};