/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.articlePushS', [])
		.controller('SelectSendeesCtrl', function ($scope, $rootScope, $http, toastr) {
			var ctrl = this;

			ctrl.ok = function() {
				ctrl.$close();
			};
			var baseApiUrl = 'http://139.224.68.92:3000/';

			var init = function () {
				$http.get(baseApiUrl + 'relationships/doctor/' + $rootScope.login._id + '/select')
					.success(function(response) {
						if (!response || response.length < 1 ||
							(response.return && response.return.length > 0)) {
							toastr.error('不正确的用户名或密码, 请确认后重试.');
							return;
						}

						toastr.info(response);


					})
					.error(function(err){
						toastr.error(err);
					});
			};

			init();

		});

})();
