(function() {

    'use strict';

    angular
        .module('app.topbar')
        .controller('TopbarController', TopbarController);

    /** @ngInject */
    function TopbarController($scope, $rootScope, $state, $window, $interval, $http, CONFIG, $uibModal) {

        var vm = this;
		$scope.statusList = [
			{icon: 'fa-user text-success', name: '在线', value: 0},
			{icon: 'fa-minus-circle text-danger', name: '忙碌', value: 1},
			{icon: 'fa-clock-o', name: '离开', value: 2},
			{icon: 'fa-user-o text-muted', name: '离线', value: 3}
		];

		$scope.updateStatus = function(status) {

			$http.patch(CONFIG.baseApiUrl + 'doctor/' + $rootScope.login.user_id, {status: status.value}) // mark as read
				.then(function (response) {
						// check if return null
						if (response.data && response.data.return && response.data.return == 'null'){
							toastr.error(CONFIG.Error.FailedOnUpdate);
						}
						else {
							// done
							$scope.currentStatus = status;
						}

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});
		};


		if ($window.sessionStorage.user) {
			$rootScope.login = JSON.parse($window.sessionStorage.user);
		}

		if (!$rootScope.login || !$rootScope.login.name) {
			$state.go('app.login');
		}
		// /zhaoys/doctor/getCompressImage?attachment=%2Fusr%2Flocal%2Ftomcat%2FrostenFileUpload%2Frs%2Fdoctor%2F20170315140233807.jpg&width=100&height=120
		$scope.doctorIcon = CONFIG.peerPageUrl + 'doctor/getCompressImage?attachment=' + $rootScope.login.icon + '&width=20&height=20';

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
			CONFIG.baseApiUrl = 'http://yyl.rostensoft.com:3000/';
		}

		$scope.logout = function () {
			$window.sessionStorage.clear();
			$scope.updateStatus($scope.statusList[3]);
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

			// chat
			$http.get(CONFIG.baseApiUrl + 'chatrooms/check/doctor/'+ $rootScope.login._id)
				.then(function (response) {
						$scope.alert.chat.count = 0;
						// check if return null
						if (response.data && response.data.return && response.data.return == 'null'){

						}
						else {
							$scope.alert.checkResultList = [];
							if (response.data && response.data.length > 0) {
								response.data.map(function (cr) {
									$scope.alert.chat.count += cr.user_unread;
								});
								$scope.alert.chat.checkResultList = response.data;
							}

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
					icon: 'fa-envelope text-warning'
				}
			};

			$scope.updateStatus($scope.statusList[0]);
			$interval(checkAlerts, 15000); // default is 15 sec
		};

		init();

    }

})();
