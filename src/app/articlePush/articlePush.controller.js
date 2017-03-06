(function() {

    'use strict';

    angular
        .module('app.articlePush')
        .controller('ArticlePushController', ArticlePushController);

    /** @ngInject */
    function ArticlePushController($scope, $rootScope, $http, toastr, $uibModal, $window, CONFIG) {
        var vm = this;
		// var baseApiUrl = 'http://139.224.68.92:3000/';
		// var baseImageServer = 'http://139.224.68.92:81/';
		// //var msgPostUrl = 'http://wx.rostensoft.com.ngrok.4kb.cn/rosten-wx/test/pushNews';
		// var msgPostUrl = 'http://yyl.rostensoft.com/zhaoys/doctor/pushNews';

		$scope.updated = false;
		$scope.article = {};

		vm.selectSendees = function () {
			var instance = $uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/articlePush/partials/selectSendees.html',
				controller: 'SelectSendeesController',
				size: 'lg'
			});

			instance.result.then(
				function (groups) {
					$scope.groups = groups;
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});

		};

		vm.selectTemplate = function () {
			var instance = $uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/articlePush/partials/selectTemplate.html',
				controller: 'SelectTemplateController',
				size: 'lg'
			});

			instance.result.then(
				function (template) {
					$scope.article = template;
					$scope.article._id = undefined;
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		vm.selectFromOld = function () {
			var instance = $uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/articlePush/partials/selectFromOld.html',
				controller: 'SelectFromOldController',
				size: 'lg'
			});

			instance.result.then(
				function (selectArticle) {
					$scope.article = selectArticle;
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		$scope.previewArticle = function() {
			$window.open(CONFIG.baseApiUrl + 'article/' + $scope.article._id);
		};

		$scope.uploadedImg = function() {
			$scope.displayedUrl = CONFIG.baseImageServer + $scope.article.title_image;
			$scope.updated = true;
		};

		var articleChanged = function () {
			if (!$scope.article) {
				return;
			}

			if ($scope.article.title_image) {
				$scope.displayedUrl = CONFIG.baseImageServer + $scope.article.title_image;
				$scope.updated = true;
			}
		}

		vm.saveArticle = function() {
			if (!$scope.article) {
				toastr.info('请先选择模版, 编辑内容.');
				return;
			}

			// 保存文章到 articlePage
			if (!$scope.article._id) {
				// create
				$scope.article.apply = true;
				$scope.article.doctor = $rootScope.login._id;
				$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'page', $scope.article)
					.success(function(response) {
						if (!response || response.length < 1 ||
							(response.return && response.return.length > 0)) {
							toastr.warning('保存文章失败, 请再试一次.');
							return;
						}

						$scope.article._id = response._id;
						toastr.success('保存文章成功.');
					})
					.error(function(err) {
						toastr.error('保存文章失败');



						$scope.article.apply = undefined; // rollback
					});
			}
			else {
				// update
				$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'page/' + $scope.article._id, $scope.article)
					.success(function(response) {
						if (!response || response.length < 1 ||
							(response.return && response.return.length > 0)) {
							toastr.warning('保存文章失败, 请再试一次.');
							return;
						}

						toastr.success('保存文章成功.');
					})
					.error(function(err) {
						toastr.error('保存文章失败');
					});
			}

		};

		vm.sendMessage = function () {
			if (!$scope.groups || $scope.groups.length < 1) {
				toastr.warning('请先选择患者后发送。');
				return;
			}

			// get Id list
			var list = [];
			for (var i=0; i<$scope.groups.length; i++) {
				for (var j=0; j<$scope.groups[i].users.length; j++) {
					if ($scope.groups[i].users[j].selected) {
						list.push($scope.groups[i].users[j].id);
					}
				}
			}

			//toastr.info(list);

			if (!list || list.length < 1) {
				toastr.warning('您至少需要选择一个患者。');
				return;
			}

			if (!$scope.article || !$scope.article._id) {
				toastr.warning('请先保存后发送。');
				return;
			}


			// 发送消息给微信
			var reqBody = {
				openidList: list,
				type: 2,
				articles: [
					{
						title: $scope.article.name,
						description: $scope.article.title,
						url: CONFIG.baseApiUrl + 'article/' + $scope.article._id,
						picurl: CONFIG.baseImageServer + $scope.article.title_image
					}
				]
			};

			$http.defaults.headers.post['Content-Type'] = 'text/plain';
			$scope.myPromise = $http.post(CONFIG.msgPostUrl, reqBody)
				.success(function(response) {
					if (!response || response.result != 1) {
						toastr.error('宣教材料发送失败, 病患再次进入公众号的时候会再次发送');
						//sendFailedMessageLog($scope.article, list);
						return;
					}

					toastr.success('宣教材料发送成功。');
				})
				.error(function(err){
					toastr.error("宣教材料发送失败");
					//sendFailedMessageLog($scope.article, list);
				});

		};

		var sendFailedMessageLog = function(article, userList) {
			// 保存消息, 等到病患再次进入公众号的时候再次发送
			if (!userList || userList.length < 1) return;

			userList.map(function(usr) {
				var _messageLogReq = {
					doctor: article.doctor,
					user: usr,
					type: 2, // 2: articlePage
					title: article.name,
					description: article.title,
					url: CONFIG.baseApiUrl + 'article/' + article._id,
					picurl: CONFIG.baseImageServer + article.title_image
				};

				$http.post(CONFIG.baseApiUrl + 'messagelog', _messageLogReq)
					.then(
						function() {
						},
						function() {
						}
					);
			});

		}

		$scope.$watch('article', articleChanged);


	}

})();
