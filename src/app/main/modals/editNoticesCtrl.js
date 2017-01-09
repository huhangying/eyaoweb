/**
 * Created by harry on 16/12/31.
 */

(function() {

	'use strict';

	angular
		.module('app.main.notices', [])
		.controller('EditNoticesController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var vm = this;

			$scope.selectOk = function() {
				this.$close($scope.notices);
			};

			$scope.updateNotices = function() {
				$scope.notices = $scope.noticeList
					.filter(function(notice) {
						return notice.selected === true;
					});
			};

			var init = function () {
				$scope.notices = [];

				if ($scope.prescriptionNotices) {
					$scope.noticeList = $scope.prescriptionNotices;
				}

				if ($scope.diagnose.notices && $scope.diagnose.notices.length>0) {
					$scope.notices = $scope.diagnose.notices;
				}

				// $scope.myPromise = $http.get(CONFIG.baseApiUrl + 'bookings/today/doctor/' + $rootScope.login._id)
				// 	.then(function (response) {
				// 			// check if return null
				// 			if (response.return && response.return == 'null'){
				// 				$scope.bookings = [];
				// 				return;
				// 			}
				// 			$scope.bookings = response.data;
                //
				// 		},
				// 		function(){
				// 			toastr.error(CONFIG.Error.Internal);
				// 		});

			};

			init();

		});

})();
