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
					toastr.warning('保存前请确认所有的输入项和格式, 如输入的值是否有效。');
					return;
				}

				this.$close($scope.selectedMedicine);
			};


			$scope.setSelectedMedicine = function(item, modal) {

				// 已经在处方里的药品不能第二次开。
				var duplicatedMedicine = false;
				$scope.diagnose.prescription.some(function(medicine) {
					if (medicine._id ===  item._id) {
						duplicatedMedicine = true;
						return true;
					}
				});
				if (duplicatedMedicine) {
					toastr.warning('已经开过了的处方药, 不能再次被开。')
					return;
				}

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

			/*
			*
			* */
			$scope.caculateEndDate = function() {
				var total = $scope.selectedMedicine.capacity * $scope.selectedMedicine.quantity;
				var everyPeriod = $scope.selectedMedicine.dosage.frequency * $scope.selectedMedicine.dosage.count;

				var days = total * $scope.selectedMedicine.dosage.intervalDay / everyPeriod;

				$scope.selectedMedicine.endDate = new Date(moment($scope.selectedMedicine.startDate).add(days, 'days').format());
			};

			$scope.caculationAvailable = function() {
				if ( !$scope.selectedMedicine || !$scope.selectedMedicine.dosage ||
					$scope.selectedMedicine.dosage.intervalDay < 1 || !$scope.selectedMedicine.startDate ||
					$scope.selectedMedicine.capacity < 1 || $scope.selectedMedicine.quantity < 1 ||
					$scope.selectedMedicine.dosage.frequency < 1 || $scope.selectedMedicine.dosage.count <=0 ) {
					return false;
				}
				$scope.calculateName = $scope.selectedMedicine.endDate ? '重新计算时间' : '计算时间';

				return true;
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
							toastr.error('无数据!');
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
