(function() {

	'use strict';

	angular
		.module('rin')
		.constant('CONFIG', {
			
			baseApiUrl: 'http://139.224.68.92:3000/',
			baseImageServer:'http://139.224.68.92:81/',
			// msgPostUrl: 'http://wx.rostensoft.com.ngrok.4kb.cn/rosten-wx/test/pushNews',
			msgPostUrl: 'http://yyl.rostensoft.com/zhaoys/doctor/pushNews'
		});


})();
