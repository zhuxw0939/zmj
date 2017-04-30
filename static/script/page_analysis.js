/*****
 *
 * Created by zxw on 2016/11.
 *
 * 包含成绩分析常用函数封装，后续不断升级
 * ？？？
 */

/***
 *页面加载完成后
 */
$(function(){

	// 检查页面滚动
	scrollChange();



});


/***
 *
 * 显示ajax loading效果
 *
 * 参数为当前DOM或下级DOM
 * 必须有一个class="group_ajax"
 *
 */
function showLoading(obj){
	try {
		obj.each(function(){
			var ajaxBox = $(this);
			if(!$(this).hasClass("group_ajax")) ajaxBox=$(this).closest(".group_ajax");
			if(ajaxBox.find(".ajaxloading").length>0){
				ajaxBox.find(".ajaxloading").show();
			} else {
				ajaxBox.append('<div class="ajaxloading"><img src="/static/img/loading.gif" alt=""></div>');
			}
		});
	} catch(error) {
		console.info(error);
	}
}
/**
 * 隐藏ajax loading效果
 * 如果没有传DOM对象，则隐藏所有loading效果
 */
function hideLoading(obj){
	if(obj==undefined){
		$(".group_ajax .ajaxloading").hide();
	} else {
		obj.each(function(){
			var ajaxBox = $(this);
			if(!$(this).hasClass("group_ajax")) ajaxBox=$(this).closest(".group_ajax");
			ajaxBox.find(".ajaxloading").hide();
		});
	}
}




/***
 *
 * 页面滚动时
 *
 * 锁定函数
 * 目前加入了页面滚动120像素时自动锁定左侧菜单
 *
 */
$(window).scroll(function(e){
	scrollChange(e)
});
function scrollChange(e){
	var _sTop = $(window).scrollTop();
	// console.info(_sTop);
	if( _sTop > 120 ){
		$("#js_analysis_menu").addClass("analysis_menu_fixed");
	} else {
		$("#js_analysis_menu").removeClass("analysis_menu_fixed");
	}
}




/***
 *
 * 窗口大小改变时
 *
 * ？？？
 *
 */
$(window).resize(function() {
	// resize();
});




/***
 *
 * 绘制表格
 *
 * ？？？
 *
 */
function makeTables(obj, data){

	if (obj.hasClass('dataTable')) {
		var dttable = obj.dataTable();
		dttable.fnClearTable(); //清空一下table
		dttable.fnDestroy(); //还原初始化了的datatable
	}

	obj.DataTable({
		destroy:        true,  //如果需要重新加载的时候请加上这个
		data:           data,
		columnDefs: [{
			'targets': 0,
			'searchable':false,
			'orderable':false,
			'className': 'classcheckboxs',
			'render': function (data, type, full, meta){
				return '<input type="checkbox" name="classcheckboxs" value="' + $('<div/>').text(data).html() + '">';
			}
		}],
		scrollY:		400,
		scrollX: 		true,
		scrollCollapse: false,
		stateSave: 		true,  //保存表格状态
		searching: 		false, //搜索
		ordering: 		false, //排序
		paging:			false, //分页
		info: 			false  //数据统计
		// fixedColumns:	{
		//     leftColumns: 3
		// }
	});
}



/*绘制表格2*/
function makeTables2(obj, data){
	console.info("makeTables2");
	console.info(obj);
	obj.closest(".group_ajax").find(".analysis_table").hide();
	obj.closest(".analysis_table").show();


	if (obj.hasClass('dataTable')) {
		var dttable = obj.dataTable();
		dttable.fnClearTable(); //清空一下table
		dttable.fnDestroy(); //还原初始化了的datatable
	}

	obj.DataTable({
		destroy:        true,  //如果需要重新加载的时候请加上这个
		data:           data,
		scrollY:		500,
		scrollX: 		true,
		scrollCollapse: true,
		stateSave: 		true,  //保存表格状态
		searching: 		false, //搜索
		ordering: 		false, //排序
		paging:			false, //分页
		info: 			false,  //数据统计
		fixedColumns:	{
			leftColumns: 2
		}
	});
	hideLoading(obj.closest(".group_ajax"));
}


/*绘制图表*/
function makeEcharts(obj, data){
	console.info(myChart);
	console.info(obj);
	console.info(data);
	option = {
		title: {
			textAlign: 'center',
			text: $("#js_analysis_menu a.current").text()+"-"+$(".analysis_screen a.current").text()+"-"+"成绩分析图表",
			top: 20,
			left: "50%"
		},
		legend: {
			data: data.mylegend,
			align: 'right',
			top: 30,
			right: 40
		},
		grid: {
			top: 100,
			left: 60,
			right: 40,
			bottom: 90
		},
		xAxis: [
			{
				type: 'category',
				axisLabel: {
					interval: 0,
					margin: 15,
					rotate: 0,
					textStyle: {
						fontSize: 12
					}
				},
				data: data.myx
			}
		],
		yAxis: [
			{
				type : 'value',
				name : '人数'
			}
		],
		dataZoom: data.mydataroom,
		series: data.mydatas
	};
	console.info(option);
	console.info(JSON.stringify(option));
	myChart.setOption(option);
	window.onresize = myChart.resize;
	hideLoading(obj.closest(".group_ajax"));
}





/***
 * 绘制echarts图表(柱状图或折线图)
 *
 * 参数：
 * @element			String，非必填，idName，默认my_echarts
 * @title			String，非必填，图表标题，默认为空
 * @type			String，非必填，默认bar，可选择line
 * @width			Number，非必填，图表宽度，默认为"auto"
 * @height			Number，非必填，图表高度，默认为"auto"
 * @legend_show		Boolean，非必填，是否显示图例组件，默认为true
 * @itemStyle_show	Boolean，非必填，是否显示图例上的数值，默认为true
 * @itemStyle_min	Number，非必填，图例上的最小数值，默认为0，只有itemStyle_show为true时有效，比如：（设置itemStyle_min为1时，不会显示为0的数值）
 * @dataZoom_show	Boolean，非必填，是否显示dataZoom，默认为true
 * @zoomLock_lock	Boolean，非必填，是否锁定dataZoom下的滚动条，默认为false不锁定
 * @options			Object，非必填，参数配置，预留
 * @xAxisData		Array，必填，x轴数据维度 [a,b,c]
 * @seriesData		Object，必填，x轴数据 { k1:[a_1,b_1,c_1], k2:[a_2,b_2,c_2] }
 *
 *
 * 示例
 createEcharts({
		element: "js_echarts",
		title: "学校分数线分析图表",
		height: 600,
		itemStyle_show: false,
		itemStyle_min: 1,
		zoomLock_lock: true,
		xAxisData: ["丰谷中学","东辰实验学校","绵阳三中","南山中学","南山中学实验","绵阳中学","绵阳中学实验","绵阳一中","实验高中","普明中学","外国语学校","南山双语高中部","安县中学","江油中学","江油一中","太白中学","梓潼中学","平武中学","北川中学","三台中学","芦溪中学","三台一中","塔山中学","观桥中学","盐亭中学","开元中学","科学城一中"],
		seriesData: {
			"A优线": [0,61,0,291,73,359,102,1,18,1,48,2,0,16,58,30,2,0,0,10,22,0,0,0,0,0,0],
			"B优线": [0,167,0,674,300,539,318,142,308,128,100,58,54,296,310,357,171,37,45,188,261,133,13,20,21,0,5],
			"C优线": [2,183,2,735,344,562,345,300,485,307,105,108,189,563,426,495,341,109,134,316,378,373,74,69,108,1,31]
		},
		options: {
			xAxis: [
				{
					type: 'category',
					axisLabel: {
						interval: 0,
						margin: 15,
						rotate: 0,
						textStyle: {
							fontSize: 18
						}
					},
					data: ["丰谷中学","东辰实验学校","绵阳三中","南山中学","南山中学实验","绵阳中学","绵阳中学实验","绵阳一中","实验高中","普明中学","外国语学校","南山双语高中部","安县中学","江油中学","江油一中","太白中学","梓潼中学","平武中学","北川中学","三台中学","芦溪中学","三台一中","塔山中学","观桥中学","盐亭中学","开元中学","科学城一中"]
				}
			],
			yAxis: [
				{
					type : 'value',
					name : '人数',
					min : 1
				}
			]
		}
	});
 *
 */
function createEcharts(obj){

	/* extend obj */
	var defaultObj = {
		title: "",
		element: "js_echarts",
		type: "bar",
		width: "auto",
		height: "auto",
		legend_show: true,
		itemStyle_show: true,
		itemStyle_min: 0,
		dataZoom_show: true,
		zoomLock_lock: false,
		xAxisData: [],
		seriesData: {},
		options: {}
	}
	obj = $.extend(defaultObj, obj);

	/* create myChart */
	if(obj.width!=="auto" || obj.height!=="auto"){
		$("#"+obj.element).width(obj.width).height(obj.height);
	}
	var myChart = echarts.init(document.getElementById(obj.element), 'macarons');


	/* making seriesData */
	var series = [];
	for(var prop in obj.seriesData){
		var seriesData = {
			"name": prop,
			"type": obj.type,
			"data": obj.seriesData[prop]
		};
		if(obj.itemStyle_show){
			if(obj.itemStyle_min===0){
				seriesData.itemStyle = {
					"normal": {
						"label": {
							"show": true,
							"position": "top",
							"textStyle": {
								"color": "#333",
								"fontSize": "12"
							}
						}
					}
				}
			} else {
				seriesData.itemStyle = {
					"normal": {
						"label": {
							"show": true,
							"formatter": function(datas){
								return datas.value>=obj.itemStyle_min?datas.value:""
							},
							"position": "top",
							"textStyle": {
								"color": "#333",
								"fontSize": "12"
							}
						}
					}
				}
			}
		}
		series.push(seriesData);
	}
	// console.info(series);

	/* making legend(图例组件) */
	var legend={};
	if(obj.legend_show){
		var legendArray = [];
		for(var prop in obj.seriesData){
			legendArray.push(prop);
		}
		legend = {
			data: legendArray,
			align: 'right',
			top: 30,
			right: 40
		}
	}

	/* making dataZoom */
	var dataZoom = [];
	if(obj.dataZoom_show){
		var roomIndex = obj.xAxisData.length;
		if(roomIndex>12){
			dataZoom = [{
				show: true,
				zoomLock: obj.zoomLock_lock,
				start: 0,
				end: 100-((roomIndex-12)/roomIndex*100)
			}]
		}
	}
	// console.info(dataZoom);

	/* extend options */
	var defaults = {
		// 图表标题
		title: {
			textAlign: 'left',
			text: obj.title,
			top: 20,
			left: 0
		},
		// 图表位置
		grid: {
			top: 100,
			left: 60,
			right: 40,
			bottom: 90
		},
		// 图例组件
		legend: legend,
		// x轴
		xAxis: [
			{
				type: 'category',
				// x轴单位点显示样式
				axisLabel: {
					interval: 0,
					margin: 15,
					rotate: 0,
					textStyle: {
						fontSize: 12
					}
				},
				// 参考：["丰谷中学", "东辰实验学校", "绵阳三中", "南山中学"]
				data: obj.xAxisData
			}
		],
		// y轴
		yAxis: [
			{
				type : 'value'
			}
		],
		// 区域缩放
		dataZoom: dataZoom,
		// 图表数据
		series: series
	};

	var options = $.extend(defaults, obj.options);

	// console.info(options);
	myChart.setOption(options);
	window.onresize = myChart.resize;

	// hideLoading(obj.div.closest(".group_ajax"));
}



/*
$("#js_schoolAnalysisTable").DataTable({
	scrollY:		600,
	scrollX: 		true,
	scrollCollapse: false,
	stateSave: 		false,
	searching: 		false,
	ordering: 		false,
	paging:			false,
	info: 			false,
	bLengthChange:  false,
	fixedColumns:	{
		leftColumns: 3
	}
});*/



/***
 * 绘制dataTable表格
 *
 * 参数：
 * @obj.element			String，非必填，#id或.class，默认#js_datatable
 * @obj.pages_show		Boolean，非必填，是否显示分页信息，默认false
 * @obj.scrollX_show	Boolean，非必填，是否一定显示横向滚动条，默认false，会自动判断当横行表格宽度超过20行时自动加横向滚动
 *
 * 示例
 * //初始化表格
 createDataTable({
		fixedColumns: {
			leftColumns: 3
		},
		fnInitComplete: function(){
			$(".analysis_table_ajax").show();
		}
	});
 *
 */

// 服务器模式
var theFirst = 0;
function createDataTable(obj) {


/*	destroy:        true,  //如果需要重新加载的时候请加上这个
		data:           data,
		columnDefs: [{
		'targets': 0,
		'searchable':false,
		'orderable':false,
		'className': 'classcheckboxs',
		'render': function (data, type, full, meta){
			return '<input type="checkbox" name="classcheckboxs" value="' + $('<div/>').text(data).html() + '">';
		}
	}],
		scrollY:		400,
		scrollX: 		true,
		scrollCollapse: false,
		stateSave: 		true,  //保存表格状态
		searching: 		false, //搜索
		ordering: 		false, //排序
		paging:			false, //分页
		info: 			false  //数据统计
	// fixedColumns:	{
	//     leftColumns: 3
	// }*/
	/* extend obj */
	var defaultObj = {
		element: "#js_datatable",
		pages_show: false,
		scrollX_show: false,
		backtop_close: false,
		language: {
			"sProcessing": "处理中...",
			"sLengthMenu": "每页显示 _MENU_ 条数据，",
			"sZeroRecords": "没有匹配结果",
			// "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			"sInfo": "共 _TOTAL_ 条数据。",
			"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
			"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
			"sInfoPostFix": "",
			"sSearch": "搜索:",
			"sUrl": "",
			"sEmptyTable": "表中数据为空",
			"sLoadingRecords": "载入中...",
			"sInfoThousands": ",",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "上一页",
				"sNext": "下一页",
				"sLast": "末页"
			},
			"oAria": {
				"sSortAscending": ": 以升序排列此列",
				"sSortDescending": ": 以降序排列此列"
			}
		},
		destroy:        true,  //如果需要重新加载的时候请加上这个
		aLengthMenu: [12, 20, 50, 100],
		iDisplayLength: 20,
		searching: 		false,
		ordering: 		false,
		bLengthChange:  false,
		paging:			false,
		info: 			false
	}

	if(obj==undefined){
		var options = defaultObj;
	} else {
		var options = $.extend(defaultObj, obj);
	}

	console.info($(options.element).find("tbody tr:first td"));
	if(options.scrollX_show || (options.fixedColumns && $(options.element).find("tbody tr:first td").length>20)){
		options.scrollX = true;
		if($.sx.browser.versions.gecko==true && $(options.element).find("thead tr").length==2){
			$(".analysis_table").addClass("analysis_table_th2");
		}
	}

	if( options.pages_show || options.serverSide || ((options.data==undefined && $(options.element).find("tbody tr").length>20) || options.data.length>20) ){
		options.bLengthChange = true;
		options.paging = true;
		options.info = true;
	}



	if(!options.backtop_close){
		options.fnInitComplete = function(){
			// 表格初始化完成了
			theFirst = 1;
		};
		options.fnDrawCallback = function(){
			// dow结束了
			hideLoading($(".group_ajax"));
			if(theFirst){
				if($(".header_analysis").length>0){
					$("html").animate({
						scrollTop: 120
					}, 150);
				} else {
					$("html").animate({
						scrollTop: 0
					}, 150);
				}

			}
		};
	}

/*
	if (obj.hasClass('dataTable')) {
		var dttable = obj.dataTable();
		dttable.fnClearTable(); //清空一下table
		dttable.fnDestroy(); //还原初始化了的datatable
	}*/

	console.info(options);
	$(options.element).DataTable(options);


}