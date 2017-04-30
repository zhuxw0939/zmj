
console.info("----------------------------Gruntfile start--------------------------------");

module.exports = function(grunt) {

	// 项目配置(任务配置)
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				options: {
					report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
				},
				files: [{
					expand:true,
					cwd:'dist/',
					src:'*.js',
					dest: 'dist/min/'
				}]
			}
		},

		watch: {
			client: {
				files: ['views/**/*', 'static/**/*', 'controllers/**/*', 'routes/**/*', 'lookapi/**/*', 'dist/**/*'],
				options: {
					livereload: true
				}
			}
		}
	});

	// 加载插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-contrib-watch');


	// 自定义任务
	grunt.registerTask('live', ['watch']);
	grunt.registerTask('minjs', ['uglify:dist']);

};