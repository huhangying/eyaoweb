/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.articlePush.old', [])

		.controller('SelectFromOldController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;

			$scope.selectOk = function() {
				// get article by id
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'page/' + $scope.articleId)
					.success(function (response) {
						var selectArticle;
						// check if return null
						if (response.return && response.return == 'null'){
							toastr.warning('获取文章失败, 请再试一次.');
							return;
						}

						//toastr.info(response);
						$scope.$close(response);
					})
					.error(function(error){
						toastr.error(error.messageFormatted);
						return;
					});

			};

			$scope.selectArticle = function(id) {
				$scope.articleId = id;
			};


			var init = function () {
				$scope.articles = [];
				$scope.loadArticles = function() {
					$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'pages/doctor/' + $rootScope.login._id)
						.success(function (response) {
							// check if return null
							if (response.return && response.return == 'null'){
								$scope.articles = [];
							}
							else {
								$scope.articles = response;
								$scope.articles.map(function(article) {
									article.timestamp = moment(article.createdAt).format('YYYY年M月D日');
								});
							}

						})
						.error(function(error){
							toastr.error(error.messageFormatted);
						});
				};
				$scope.loadArticles();
			};

			init();

		});

})();
