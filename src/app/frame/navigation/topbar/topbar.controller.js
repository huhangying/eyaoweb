(function() {

    'use strict';

    angular
        .module('app.topbar')
        .controller('TopbarController', TopbarController);

    /** @ngInject */
    function TopbarController($scope, $rootScope, $state, $window) {

        var vm = this;
		if ($window.sessionStorage.user) {
			$rootScope.login = JSON.parse($window.sessionStorage.user);
		}

		if (!$rootScope.login || !$rootScope.login.name) {
			$state.go('app.login');
		}

		$scope.logout = function () {
			$window.sessionStorage.clear();
			$state.go('app.login');
		};

    }

})();
