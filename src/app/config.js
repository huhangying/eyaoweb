(function() {

	'use strict';

	angular
		.module('rin')
		.value('CONFIG', {
		// .constant('CONFIG', {

			peerPageUrl: 'http://223.93.176.119:8880',
			//baseApiUrl: 'http://127.0.0.1:3000/',
			baseApiUrl: 'http://139.224.68.92:3000/',
			baseImageServer:'http://139.224.68.92:81/',
			// msgPostUrl: 'http://wx.rostensoft.com.ngrok.4kb.cn/rosten-wx/test/pushNews',
			msgPostUrl: 'http://yyl.rostensoft.com/zhaoys/doctor/pushNews',

			surveyTypes: [
				'none',
				"初诊问卷", 		//1
				"复诊问卷", 		//2
				"随访问卷", 		//3
				"药物知识自测", 	//4
				"门诊结论", 		//5
				"药师评估",		//6
				"化验结果"		//7
			],
			diagnoseStatus: {
				Initialized: 0,
				Submitted: 1, // user submitted
				Saved: 2, // doctor saved
				Archived: 3 // doctor finished
			},
			medicineDosageWays: [
				{text: "饭后", value: "1"},
				{text: "饭前", value: "2"},
				{text: "饭中", value: "3"},
				{text: "睡前", value: "4"},
				{text: "每4小时", value: "5"},
				{text: "每8小时", value: "6"},
				{text: "每12小时", value: "7"},
				{text: "每天", value: "8"},
				{text: "隔天", value: "9"}
			],
			Error: {
				Internal: '数据库访问内部错误',
				FailedOnCreate: '创建失败',
				FailedOnUpdate: '更新失败',
				NoData: '没有数据'
			}
		});


})();
