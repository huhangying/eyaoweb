/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.articlePush.template', ['textAngular', 'flow'])

		.controller('SelectTemplateController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;

			$scope.selectOk = function() {
				this.$close($scope.template);
			};

			var templateChanged = function() {
				if (!$scope.selectedTemplate) {return;}

				// load template
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'template/' + $scope.selectedTemplate)
					.success(function(response) {
						if (!response || response.length < 1 ||
							(response.return && response.return.length > 0)) {
							toastr.warning('没有可用的模块, 请联系管理员, 先在管理后台中添加专科模版.');
							return;
						}

						$scope.template = response;
						if ($scope.template.title_image) {
							$scope.displayedUrl = CONFIG.baseImageServer + $scope.template.title_image;
						}
					})
					.error(function(err){
						toastr.error(err);
					});
			};

			var init = function () {
				$scope.cats = [];
				$scope.loadCats = function() {
					$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'articlecats/department/' + $rootScope.login.department)
						.success(function (response) {
							// check if return null
							if (response.return && response.return == 'null'){
								$scope.cats = [];
							}
							else {
								$scope.cats = response;
							}

						})
						.error(function(error){
							toastr.error(error.messageFormatted);
						});
				};
				$scope.loadCats();

				$scope.templates = [];
				$scope.myPromise = $scope.loadTemplates = function() {
					$http.get(CONFIG.baseApiUrl + 'templates/department/' + $rootScope.login.department)
						.success(function (response) {
							// check if return null
							if (response.return && response.return == 'null'){
								$scope.templates = [];
								toastr.warning('没有可用的模块, 请联系管理员, 先在管理后台中添加专科模版.');
							}
							else {
								$scope.templates = response;
							}

						})
						.error(function(error){
							toastr.error(error.messageFormatted);
						});
				};
				$scope.loadTemplates();

			};

			init();

			$scope.$watch('selectedTemplate', templateChanged);

		});

})();
