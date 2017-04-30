/**
 * @127.0.0.1本地测试环境
 *
 *
 ***/
var path = require('path');

module.exports = {

	// 项目名称
	name: "www.zhaomajiang.com",
	// 描述
	description: "找麻将",
	// 版本号
	v: "0.1.0",

	// 域名
	host: 'http://127.0.0.1',
	// 端口号，必须配置
	port: 6001,

	// 是否开启debug模式，正式环境可以关闭
	debug: true,
	logger_level: 'DEBUG',
	logger_save: './.logs/logger.log', // logs文件输出地址，目前没有用到

	// servers配置
	servers: {
		host: 'http://api.cktd.net:8787',
		headers: {
			'Content-Type': 'application/json'
		}
	},

	// redis配置
	redis: {
		host: '211.149.151.88',
		port: '6379',
		pass: 'ckteredis',
		db: 12,
		prefix: 'sess:',
		ttl: 60*60*24*30
	},

	// session失效时间
	sessionMaxAge: 60*60*24,
	// cookie有效期
	cookieMaxAge: 1000*60*60*24,

	// 正式环境只需要配置host，默认"/dist"
	webpackServer: {
		open: true,
		host: 'http://127.16.10.31:8181/dist'
		// host: 'http://192.168.0.194:8181/dist'
		// host: '/dist'
	},

	// mock设置 为 true 时，从mock服务器取数据，为 false 时从servers取数据
	mock: {
		open: false,
		host: "http://www.uyun.net:3300",
		p_id: "Hkldi9aJUl",
		v_id: "rybdiqTyUx"
	},

	wxconfig: {
		token : 'wxexpress',
		appid : 'wx5c21fd119b33f423',
		appsecret :'ee08c69570c6df29a8ce42df6002d2c7',
		encodingAESKey : ''
	},

	mongodb: {
		// host: mongodbHost
	}

};

