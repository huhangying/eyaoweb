(function () {
	'use strict';

	angular.module('app.components')
		.controller('ChangePasswordCtrl', ChangePasswordCtrl);

	/** @ngInject */
	function ChangePasswordCtrl($scope, $rootScope, $http, toastr, CONFIG) {

		$scope.changePassword = function (password) {

			$http.patch(CONFIG.baseApiUrl + 'doctor/' + $rootScope.login.user_id, {password: password}) // mark as read
				.then(function (response) {
						// check if return null
						if (response.data && response.data.return && response.data.return == 'null'){
							toastr.error(CONFIG.Error.FailedOnUpdate);
						}
						else {
							// close
							$scope.$close();
							toastr.info('药师密码更新成功');
						}

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});


		};

	}
})();
