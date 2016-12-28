(function() {

    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($scope, $http, $state, $window, toastr, CONFIG) {

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
    }

})();
