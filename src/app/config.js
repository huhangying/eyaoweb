(function() {

	'use strict';

	angular
		.module('rin')
		.constant('CONFIG', {

			baseApiUrl: 'http://127.0.0.1:3000/',
			//baseApiUrl: 'http://139.224.68.92:3000/',
			baseImageServer:'http://139.224.68.92:81/',
			// msgPostUrl: 'http://wx.rostensoft.com.ngrok.4kb.cn/rosten-wx/test/pushNews',
			msgPostUrl: 'http://yyl.rostensoft.com/zhaoys/doctor/pushNews',

			surveyTypes: [
				'none',
				"初诊问卷", 		//1
				"门诊结论", 		//2
				"随访问卷", 		//3
				"药物知识自测", 	// 4
				"化验结果",		//5
				"药师评估"		//6
			],
			Error: {
				Internal: '数据库访问内部错误'
			}
		});


})();
