/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.newMedicine', [])

		.controller('NewMedicineController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.selectedMedicine = {};

			$scope.selectOk = function() {
				this.$close($scope.selectedMedicine);
			};

			$scope.selectMedicine = function (id) {
				$scope.selectedMedicine = $scope.medicines.filter(function(med) {
					return med._id === id;
				});

				// filter out non-applied notices
				if ($scope.selectedMedicine.notices && $scope.selectedMedicine.notices.length > 0) {
					$scope.selectedMedicine.notices = $scope.selectedMedicine.notices.filter(function(notice) {
						return notice.apply;
					});
				}

			}


			var init = function () {
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'medicines')
					.then(function (response) {
							// check if return null
							if (response.return && response.return == 'null'){
								$scope.medicines = [];
								return;
							}
							$scope.medicines = response.data;

						},
						function(){
							toastr.error(CONFIG.Error.Internal);
						});

				if ($scope.editedMedicine) {
					$scope.selectedMedicine = $scope.editedMedicine;
				}

			};

			init();

		});

})();
