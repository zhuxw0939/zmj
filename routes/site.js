"use strict";

var express = require('express');
var router = express.Router();
var config = require('../common/config');
var logger = require('../common/logger');
var site = require('../controllers/site');

// 首页-主路由
router.get('/', site.index);
// 分享注册id
router.get('/v/:uid', site.shareUserId);

// 退出登录，
router.get('/user/logout', site.logout);
// 用户登录操作，验证用户名和密码、将token写入session、获取用户基本信息
router.post('/user/loginPost', site.loginPost);
// 获取我的信息
router.post('/user/getMyInfo', site.getMyInfo);
// 获取我的消费流水
router.post('/user/getMyFeesWater', site.getMyFeesWater);

module.exports = router;