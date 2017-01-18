/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.history', [])

		.controller('HistoryController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.history = {};

			$scope.selectOk = function() {
				this.$close($scope.conclusion);
			};



			var init = function () {
				$scope.activeTab = 0;

				// get person info
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'user/' + $scope.diagnose.user)
					.then(function (response) {
							// check if return null
							if (response.data && response.data.return && response.data.return == 'null'){
								//toastr.error(CONFIG.Error.NoData);
							}
							else {
								$scope.history.user = response.data;
							}

						},
						function(){
							toastr.error(CONFIG.Error.Internal);
						});
			};

			init();

		});

})();
