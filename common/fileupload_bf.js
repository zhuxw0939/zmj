/**
 *
 * @Description 文件上传配置
 * @Created 2016/04/27 17:50
 *
 */
var multer = require('multer');
var md5 = require('md5');
var config = require('./config');
var logger = require('./logger')
logger.info("fileupload come ***");

var storage = multer.diskStorage({
	//设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
	//Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
	// destination: config.upload.path,
	destination: process.cwd() + '/uploads',
	//TODO:文件区分目录存放
	//获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
	filename: function (req, file, cb) {
		logger.info("filename 获取文件MD5，重命名，添加后缀");
		logger.info(file);
		var fileFormat =(file.originalname).split(".");
		cb(null, file.fieldname + '-' + md5(file) + "." + fileFormat[fileFormat.length - 1]);
	}
});

//添加配置文件到muler对象。
var upload = multer({
	storage: storage,
	//其他设置请参考multer的limits
	//limits:{}
});
logger.info("fileupload end");

//导出对象
module.exports = upload;