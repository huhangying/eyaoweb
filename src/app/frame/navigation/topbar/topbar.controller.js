(function() {

    'use strict';

    angular
        .module('app.topbar')
        .controller('TopbarController', TopbarController);

    /** @ngInject */
    function TopbarController($scope, $rootScope, $state, $window, CONFIG) {

        var vm = this;
		$scope.statusList = [
			{icon: 'fa-check-circle text-success', name: '在线'},
			{icon: 'fa-minus-circle text-danger', name: '忙碌'},
			{icon: 'fa-clock-o', name: '离开'}
		];
		$scope.currentStatus = $scope.statusList[0];

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

    }

})();
