
/**
 * 认证模块
 */


var eventproxy = require('eventproxy');

var config = require('../common/config');

var logger = require('../common/logger');


/**
 * 需要登录才能访问，跳到登录页面
 */
exports.userMustLogin = function (req, res, next) {
	if(req.session.user && req.session.user.auth_token){
		next();
	} else {
		if(req.originalUrl){
			res.redirect("/u/login?backurl="+req.originalUrl);
		} else {
			res.redirect("/u/login");
		}
	}
};

/**
 * 登录后就不能访问，跳到首页，比如注册页面
 */
exports.userMustLogout = function (req, res, next) {
	if(req.session.user && req.session.user.auth_token){
		// 已登录，不允许访问，跳至首页
		res.redirect("/");
	} else {
		next();
	}
};

/**
 * 每次刷新页面时检查登录状态，暂时用于app.js
 */
exports.authUser = function (req, res, next) {
	/** 检查该用户是否登录，并刷新cookies */
	if(req.session.user) {
		logger.info('已登录用户，token：', req.session.user.id);
		// 设置user信息
		res.locals.user = req.session.user;
	} else {
		logger.info('未登录用户:');
	}
	next();
};


/**
 * 写入用户登录session
 */
// exports.writeUserSession = function (req, res, data) {
// 	// 写入session
// 	req.session.user = data;
//
// 	// 将用户的登录id写入cookie
// 	res.cookie('user_id', data.id, {maxAge: config.cookieMaxAge});
// };

/**
 * 删除用户登录session
 */
// exports.delUserSession = function (req, res) {
// 	// 删除session
// 	delete req.session.user;
//
// 	// 删除user用户信息
// 	// delete res.locals.user;
//
// 	// 删除用户的cookie.user_id
// 	// res.cookie('user_id', "");
//
// };

/**
 * 需要管理员权限
 */
// exports.adminRequired = function (req, res, next) {
// 	// if (!req.session.user) {
// 	// 	return res.render('message', { '你还没有登录。' });
// 	// }
// 	//
// 	// if (!req.session.user.is_admin) {
// 	// 	return res.render('message', { '需要管理员权限。' });
// 	// }
//
// 	next();
// };
