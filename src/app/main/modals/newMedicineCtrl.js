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


			$scope.setSelectedMedicine = function(item, modal) {
				$scope.selectedMedicine = item;

				// filter out non-applied notices
				if ($scope.selectedMedicine.notices && $scope.selectedMedicine.notices.length > 0) {
					$scope.selectedMedicine.notices = $scope.selectedMedicine.notices.filter(function(notice) {
						return notice.apply;
					});
				}
			};


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

				$http.get(CONFIG.baseApiUrl + 'const/medicine_usages')
					.success(function (response) {
						//console.log(JSON.stringify(response))
						if (!response ){
							toastr.error('无数据!')
						}
						else if (response.return == 'error') {
							toastr.error(response.message);
						}
						else{
							$scope.usages = response.value.split('|');
						}
					});

				$http.get(CONFIG.baseApiUrl + 'const/medicine_periods')
					.success(function (response) {
						//console.log(JSON.stringify(response))
						if (!response ){
							toastr.error('无数据!')
						}
						else if (response.return == 'error') {
							toastr.error(response.message);
						}
						else{
							$scope.periods = response.value.split('|');
						}
					});

				$http.get(CONFIG.baseApiUrl + 'const/medicine_ways')
					.success(function (response) {
						//console.log(JSON.stringify(response))
						if (!response ){
							toastr.error('无数据!')
						}
						else if (response.return == 'error') {
							toastr.error(response.message);
						}
						else{
							$scope.ways = response.value.split('|');
						}
					});

			};

			init();

		});

})();
