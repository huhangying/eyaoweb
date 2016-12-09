/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('rin', [])
		.provider('util', function() {
			this.$get = function($window) {
				return {
					// baseApiUrl: 'http://127.0.0.1:3000/',
					baseImageServer: 'http://127.0.0.1:3031/',
					baseApiUrl: 'http://139.224.68.92:3000/',

					getResponse: function(response) {
						if (response.return && response.return == 'null'){
							return [];
						}
						else {
							return response;
						}
					},

					getErrorMessage: function(response) {
						if (response.return) {
							return '错误: ' + response.return;
						}
						return null;
					},

					getLoginUserId: function() {
						var user = JSON.parse($window.sessionStorage.user);
						return user._id;
					}
				};
			};
		});
})();
