(function() {

    'use strict';

    angular
        .module('app.articlePush')
        .controller('ArticlePushController', ArticlePushController);

    /** @ngInject */
    function ArticlePushController($scope, $http, toastr, $uibModal) {
        var vm = this;
		var baseApiUrl = 'http://139.224.68.92:3000/';
		var baseImageServer = 'http://139.224.68.92:81/';
		var msgPostUrl = 'http://wx.rostensoft.com.ngrok.4kb.cn/rosten-wx/test/pushNews';

		$scope.preview = false;
		$scope.updated = false;

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
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		$scope.previewToggle = function() {
			$scope.preview = !$scope.preview;
		};

		$scope.uploadedImg = function() {
			$scope.displayedUrl = baseImageServer + $scope.article.title_image;
			$scope.updated = true;
		};

		var articleChanged = function () {
			if (!$scope.article) {
				return;
			}

			if ($scope.article.title_image) {
				$scope.displayedUrl = baseImageServer + $scope.article.title_image;
				$scope.updated = true;
			}
		}

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

			toastr.info(list);

			// 保存文章到 articlePage
			$scope.article.apply = true;
			$scope.myPromise = $http.post(baseApiUrl + 'page', $scope.article)
				.success(function(response) {
					if (!response || response.length < 1 ||
						(response.return && response.return.length > 0)) {
						toastr.warning('保存文章失败, 请再试一次.');
						return;
					}

					// 发送消息给微信
					var reqBody = {
						openidList: list,
						article: [
							{
								title: $scope.article.name,
								description: $scope.article.title,
								url: baseApiUrl + 'article/' + response._id,
								picurl: $scope.article.image_title
							}
						]
					};

					$scope.myPromise = $http.post(msgPostUrl, reqBody)
						.success(function(response) {
							if (!response || response.length < 1 ||
								(response.return && response.return.length > 0)) {
								toastr.error('宣教材料发送失败.');
								return;
							}

							toastr.success('宣教材料发送成功。');
						})
						.error(function(err){
							toastr.error(err);
						});


				})
				.error(function(err){
					toastr.error(err);
				});

		};

		$scope.$watch('article', articleChanged);


	}

})();
