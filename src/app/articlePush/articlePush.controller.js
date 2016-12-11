(function() {

    'use strict';

    angular
        .module('app.articlePush')
        .controller('ArticlePushController', ArticlePushController);

    /** @ngInject */
    function ArticlePushController($scope, $http, toastr, $uibModal) {
        var vm = this;
		var baseApiUrl = 'http://139.224.68.92:3000/';
		var baseImageServer = 'http://139.224.68.92:3031/';
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
			$scope.displayedUrl = baseApiUrl + $scope.article.title_image;
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

		};

		$scope.$watch('article', articleChanged);


	}

})();
