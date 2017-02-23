/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.newMedicine', [])

		.controller('NewMedicineController', function ($scope, $rootScope, $http, toastr, CONFIG, $filter) {
			var ctrl = this;
			$scope.selectedMedicine = {};

			$scope.selectOk = function() {
				if ($scope.medicineForm.$invalid) {
					toastr.warning('保存前请确认所有的输入项和格式。');
					return;
				}

				this.$close($scope.selectedMedicine);
			};


			$scope.setSelectedMedicine = function(item, modal) {
				item.startDate = item.startDate || new Date();
				item.quantity = item.quantity || 1;

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
					$scope.selectedMedicine.startDate = new Date($scope.selectedMedicine.startDate);
					if ($scope.selectedMedicine.endDate) {
						$scope.selectedMedicine.endDate = new Date($scope.selectedMedicine.endDate);
					}
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

				// move it to main process
				// $http.get(CONFIG.baseApiUrl + 'const/medicine_periods')
				// 	.success(function (response) {
				// 		//console.log(JSON.stringify(response))
				// 		if (!response ){
				// 			toastr.error('无数据!')
				// 		}
				// 		else if (response.return == 'error') {
				// 			toastr.error(response.message);
				// 		}
				// 		else{
				// 			$scope.periods = [];
				// 			response.value.split('|').map(function(item) {
				// 				$scope.periods.push({
				// 					name: item.split(':')[0],
				// 					value: item.split(':')[1]
				// 				});
				// 			});
				// 		}
				// 	});

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

				$scope.selectedMedicine.startDate = $scope.selectedMedicine.startDate || new Date();

			};

			init();

			// $scope.$watch('editedMedicine.startDate', function (newValue) {
			// 	$scope.editedMedicine.startDate = $filter('date')(newValue, 'yyyy/MM/dd');
			// });

		});

})();
