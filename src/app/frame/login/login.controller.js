(function() {

    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($scope, $http, $state, $location, $window, toastr, CONFIG) {

        var vm = this;

		$scope.login = function() {

			$http.patch(CONFIG.baseApiUrl + 'login/doctor', $scope.credentials)
				.success(function(response) {
					if (!response || response.length < 1 ||
						(response.return && response.return.length > 0)) {
						toastr.error('不正确的用户名或密码, 请确认后重试.');
						$scope.credentials = null;
						return;
					}
					$window.sessionStorage.user = JSON.stringify(response);
					//toastr.info(JSON.stringify($window.sessionStorage.user));

					if ($window.sessionStorage.currentUrl){
						$window.location.href = $window.sessionStorage.currentUrl;
						$window.sessionStorage.currentUrl = null;
					}
					else{
						//$window.location.href = '/#/home';// + response._id;
						$state.go('app.main');
					}

				})
				.error(function(err){
					$window.sessionStorage.clear();
				});
		};

		var init = function() {

			if ($location && $location.search()) {
				var debug = $location.search().debug;
				if (debug !== undefined) {

					if (debug === '0') {
						$window.sessionStorage.debug = 'D0';
						CONFIG.baseApiUrl = 'http://127.0.0.1:3000/';
					}
					else if (debug === '1') {
						$window.sessionStorage.debug = 'D1';
						CONFIG.baseApiUrl = 'http://116.62.29.222:3000/';
					}
				}
				else {
					$window.sessionStorage.debug = undefined;
					CONFIG.baseApiUrl = 'http://139.224.68.92:3000/';
				}


			}

		};
		init();
    }

})();
