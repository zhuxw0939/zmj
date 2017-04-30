"use strict";

var express = require('express');
var router = express.Router();
var config = require('../common/config');
var logger = require('../common/logger');
var api = require('../controllers/api');

// 获取城市列表
router.post('/getCityList', api.getCityList);
// 获取ip地址
router.post('/getIpLocation', api.getIpLocation);
// 解析二维码
router.post('/weixin/readcode', api.readcode);
// 保存servers-debug
if(config.debug){
	router.get('/writeServersApi', api.writeServersApi);
}

// serversApi
router.post('/servers/:id', api.servers);
if(config.debug){
	router.get('/servers/:id', api.servers);
}

module.exports = router;