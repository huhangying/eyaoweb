/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.articlePush.template', [])
		.controller('SelectTemplateController', function ($scope, $rootScope, $http, toastr) {
			var ctrl = this;


			$scope.selectOk = function() {
				this.$close();
			};
			var baseApiUrl = 'http://139.224.68.92:3000/';



			var init = function () {
				$http.get(baseApiUrl + 'templates/department/' + $rootScope.login.department)
					.success(function(response) {
						if (!response || response.length < 1 ||
							(response.return && response.return.length > 0)) {
							toastr.warning('没有可用的模块, 请联系管理员, 先在管理后台中添加专科模版.');
							return;
						}

						if (response && response.length > 0) { 
toastr.info(response);
						}


					})
					.error(function(err){
						toastr.error(err);
					});
			};

			init();

		});

})();
