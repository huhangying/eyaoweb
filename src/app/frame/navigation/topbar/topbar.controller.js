(function() {

    'use strict';

    angular
        .module('app.topbar')
        .controller('TopbarController', TopbarController);

    /** @ngInject */
    function TopbarController($scope, $rootScope, $state, $window, $interval, $http, CONFIG, $uibModal) {

        var vm = this;
		$scope.statusList = [
			{icon: 'fa-check-circle text-success', name: '在线'},
			{icon: 'fa-minus-circle text-danger', name: '忙碌'},
			{icon: 'fa-clock-o', name: '离开'}
		];

		$scope.updateStatus = function(status) {
			$scope.currentStatus = status;
		}


		if ($window.sessionStorage.user) {
			$rootScope.login = JSON.parse($window.sessionStorage.user);
		}

		if (!$rootScope.login || !$rootScope.login.name) {
			$state.go('app.login');
		}
		$scope.doctorIcon = $rootScope.login.icon;
		// $scope.doctorIcon = CONFIG.peerPageUrl + $rootScope.login.icon;

		$scope.debug = $window.sessionStorage.debug;
		if ($scope.debug !== undefined) {

			if ($scope.debug === 'D0') {
				CONFIG.baseApiUrl = 'http://127.0.0.1:3000/';
			}
			else if ($scope.debug === 'D1') {
				CONFIG.baseApiUrl = 'http://116.62.29.222:3000/';
			}
		}
		else {
			CONFIG.baseApiUrl = 'http://139.224.68.92:3000/';
		}

		$scope.logout = function () {
			$window.sessionStorage.clear();
			$state.go('app.login');
		};

		$scope.changePassword = function () {
			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/components/changePassword/changePassword.html',
				controller: 'ChangePasswordCtrl',
				size: 'sm'
			})
				.result.then(
				function () {
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		var checkAlerts = function () {

			// feedback1
			$http.get(CONFIG.baseApiUrl + 'feedback/unreadcount/1/'+ $rootScope.login._id)
				.then(function (response) {
						// check if return null
						if (response.data && response.data.return && response.data.return == 'null'){
							$scope.alert.feedback1.count = 0;
						}
						else {
							$scope.alert.feedback1.count = response.data.count;
						}

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});

			// feedback1
			$http.get(CONFIG.baseApiUrl + 'feedback/unreadcount/2/'+ $rootScope.login._id)
				.then(function (response) {
						// check if return null
						if (response.data && response.data.return && response.data.return == 'null'){
							$scope.alert.feedback2.count = 0;
						}
						else {
							$scope.alert.feedback2.count = response.data.count;
						}

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});

		};

		var init = function() {
			$scope.currentStatus = $scope.statusList[0];
			$scope.alert = {
				feedback1: {
					type: 1,
					title: '病患不良反应反馈',
					icon: 'fa-heartbeat text-danger'
				},
				feedback2: {
					type: 2,
					title: '病患联合用药反馈',
					icon: 'fa-coffee text-info'
				},
				chat: {
					type: 0,
					title: '在线咨询消息',
					icon: 'fa-envelope text-warning',
					count: 1
				}
			};


			$interval(checkAlerts, 5000);
		};

		init();

    }

})();
