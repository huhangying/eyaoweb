(function() {

	'use strict';

	angular
		.module('app.home')
		.controller('HomeController', HomeController);

	/** @ngInject */
	function HomeController($scope, $rootScope, $http, CONFIG) {
		var vm = this;

		var init = function() {
			// if ($rootScope.login) {
			// 	$scope.detailFrame = CONFIG.peerPageUrl + 'wx/start?doctor=' + $rootScope.login._id;
			// }
			// 获取用户数
			$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'relationships/doctor/' + $rootScope.login._id).then(
				function(response) {
					if (!response || response.length < 1 ||
						(response.return && response.return.length > 0)) {
						toastr.error('获取用户数错误.');
						$scope.userTotal = -1;
						return;
					}
					$scope.userTotal = response.data.length;
				},
				function(err) {
					$scope.userTotal = -1;
				}
			);

			// 获取用户组数
			$http.get(CONFIG.baseApiUrl + 'groups/doctor/' + $rootScope.login._id).then(
				function(response) {
					if (!response || response.length < 1 ||
						(response.return && response.return.length > 0)) {
						toastr.error('获取用户组数错误.');
						$scope.userGroupTotal = -1;
						return;
					}
					$scope.userGroupTotal = response.data.length;
				},
				function(err) {
					$scope.userGroupTotal = -1;
				}
			);

			// 获取预约总数
			$http.get(CONFIG.baseApiUrl + 'bookings/doctor/' + $rootScope.login._id).then(
				function(response) {
					if (!response || response.length < 1 ||
						(response.return && response.return.length > 0)) {
						toastr.error('获取预约总数错误.');
						$scope.bookingTotal = -1;
						return;
					}
					$scope.bookingTotal = response.data.length;
				},
				function(err) {
					$scope.bookingTotal = -1;
				}
			);

			// 今日预约数
			$http.get(CONFIG.baseApiUrl + 'bookings/today/doctor/' + $rootScope.login._id).then(
				function(response) {
					if (!response || response.length < 1 ||
						(response.return && response.return.length > 0)) {
						toastr.error('获取今日预约数错误.');
						$scope.diagnoseTodayTotal = -1;
						return;
					}
					$scope.diagnoseTodayTotal = response.data.length;
				},
				function(err) {
					$scope.diagnoseTodayTotal = -1;
					toastr.error('获取今日预约错误.');
				}
			);

			// 每月门诊完成数
			$http.get(CONFIG.baseApiUrl + 'diagnoses/currentmonth/' + $rootScope.login._id).then(
				function(response) {
					$scope.diagnoseMonthlyTotal = response.data;
				},
				function(err) {
					$scope.diagnoseMonthlyTotal = -1;
					toastr.error('获取每月门诊完成数错误.');
				}
			);


		};
		init();
	}

})();
