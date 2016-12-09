(function() {

    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($scope, $http, $window, toastr) {

        var vm = this;
		$scope.testTitle = 'ddd';

		$scope.login = function() {
			var baseApiUrl = 'http://139.224.68.92:3000/';

			$http.patch(baseApiUrl + 'login/doctor', $scope.credentials)
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
						$window.location.href = '/#/home' + response._id;
					}

				})
				.error(function(err){
					$window.sessionStorage.clear();
				});
		};
    }

})();
