'use strict';

var express = require('express');
var async = require('async');
var eventproxy = require('eventproxy');
var request = require('request');

var config = require('../common/config');
var redisDB = require('../common/redisDB');
var logger = require('../common/logger');




// 需要考虑redis的post方法
exports.POST = function(obj, callback){

	// 请求完毕是否向redis中写入数据
	var redisWrite = false;

	async.auto({
		getRedis: function(callback) {
			if(obj.redis){
				redisDB.get(obj.redis, function(error, data) {
					if(error){
						callback(error);
					} else {
						if(data) {
							callback(null, data);
						} else {
							// 设置了从redis中取值，但是没有取到值
							// 此时就需要给redis中写入新post取到的值
							redisWrite = true;
							callback(null);
						}
					}
				});
			} else {
				callback(null);
			}
		},
		getPost: ['getRedis', function(results, callback) {
			if(results.getRedis){
				callback(null, results.getRedis);
			} else {
				// 开始post请求
				var t = new Date();
				request.post({
					url: config.servers.host+obj.url,
					form: obj.data,
					headers: {
						'Content-Type': 'application/json'
					}
				}, function (error, response, body) {
					logger.debug('POST', '::: back :::', obj, ((new Date() - t) + 'ms').green);
					logger.info(body);
					goBack(error, response, body, callback);
				});
			}
		}]
	}, function(error, results) {
		if(error){
			callback(error);
		} else {
			callback(null, results.getPost);
		}
	});
};






// 不需要考虑redis的post方法
exports._POST = function(obj, callback){
	// 开始post请求
	var t = new Date();
	request.post({
		url: config.servers.host+obj.url,
		form: obj.data,
		headers: {
			'X-Custom-Header': 'Bumbaway atuna',
			'Content-Type': 'application/json',
			'Cookie': 'sessionid='+config.sessionId
		}
	}, function (error, response, body) {
		logger.debug('POST', '::: back :::', obj, ((new Date() - t) + 'ms').green);
		logger.info(body);
		goBack(error, response, body, callback);
	});
};

exports.ajaxPOST = function(url, obj, callback){
	url = config.servers.host+url;

	logger.info("--------------- ajaxPOST-----------------");
	logger.info(url);
	logger.info(obj);

	// 开始post请求
	var t = new Date();
	request.post({
		url: url,
		form: obj,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}, function (error, response, body) {
		logger.debug('ajaxPOST', '::: back ::: '+url, obj, ((new Date() - t) + 'ms').green);
		logger.info(body);
		goBack(error, response, body, callback);
	});
};

exports.ajaxGet = function(url, obj, callback){

	logger.info("--------------- ajaxGet-----------------");
	logger.info(url);
	logger.info(obj);

	var reg = /((https|http):\/\/)/g;
	if(!reg.test(url)){
		logger.info("url不是以http://https://开头");
		url = config.servers.host+url;
	} else {
		logger.info("url以http://开头");
	}

	logger.info(url);

	// url = config.servers.host+url+"?auth_token="+obj.auth_token;

	// auth

	// 开始post请求
	var t = new Date();
	request.get({
		url: url,
		qs: obj
	}, function (error, response, body) {
		logger.debug('ajaxGet', '::: back ::: '+url, obj, ((new Date() - t) + 'ms').green);
		logger.info(body);

		goBack(error, response, body, callback);
	});
};




function goBack(error, response, body, callback){
	if(error){
		logger.info("POST: ~~~~~~ error: "+error);
		callback('获取数据失败');
	} else {
		try {
			var bodyObject = JSON.parse(body);
			callback(null, bodyObject);
		} catch(error) {
			logger.info("catch error: ");
			logger.info(error);
			if(body=="") {
				callback('返回为空!');
			} else {
				callback('返回数据不是一个标准的json格式!');
			}
		}
	}
}