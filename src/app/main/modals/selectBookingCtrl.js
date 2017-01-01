/**
 * Created by harry on 16/12/31.
 */

(function() {

	'use strict';

	angular
		.module('app.main.booking', [])
		.controller('SelectBookingController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var vm = this;

			$scope.selectOk = function() {
				this.$close($scope.selectedBooking);
			};

			$scope.selectBooking = function(index) {
				$scope.selectedBooking = $scope.bookings[index];
			};


			var init = function () {

				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'bookings/today/doctor/' + $rootScope.login._id)
					.then(function (response) {
							// check if return null
							if (response.return && response.return == 'null'){
								$scope.bookings = [];
								return;
							}
							$scope.bookings = response.data;

						},
						function(){
							toastr.error(CONFIG.Error.Internal);
						});

			};

			init();

		});

})();
