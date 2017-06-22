/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.patient', [])
		.controller('SelectPatientController', function ($scope, $rootScope, $http, toastr, CONFIG, $uibModal, $uibModalInstance) {
			var vm = this;
			$scope.loading = false;

			$scope.selectOk = function() {
				// toastr.info($scope.selectedPatient);
				// check if the patient has been connected to the doctor
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'relationship/' + $rootScope.login._id + '/' + $scope.selectedPatient._id)
					.then(function (response) {
							// check if return null
							if (response.data && response.data.existed == true){
								$uibModalInstance.close($scope.selectedPatient);
								return;
							}
							//
							$scope.confirmContent = '病患' + $scope.selectedPatient.name + '还没有关注' + $rootScope.login.name + ', 确定要建立关联？';

							$uibModal.open({
								animation: true,
								templateUrl: 'app/components/confirmation/confirm.html',
								controller: 'confirmCtrl',
								size: 'sm',
								scope: $scope
							}).result.then(
								function(rsp) {
									// build the relationship

									$http.post(CONFIG.baseApiUrl + 'relationship', {doctor: $rootScope.login._id, user: $scope.selectedPatient._id})
										.then(function (response) {
												// check if return null
												if (response.return && response.return == 'null'){
													toastr.error('创建关联失败');
													return;
												}
												$uibModalInstance.close($scope.selectedPatient);
											},
											function(error){
												toastr.error('创建关联失败');
												$scope.loading = false;
											});


								},
								function(err) {

								}
							);
						},
						function(error){
							toastr.error(error.messageFormatted);
							$scope.loading = false;
						});

			};

			$scope.searchPatients = function() {

				// validation
				if ($scope.form.$invalid) {
					return;
				}

				$scope.loading = true;
				var searchCriteria = {};
				switch($scope.searchOption) {
					case '1': // 门诊号
						searchCriteria.admissionNumber = $scope.searchValue;
						break;
					case '2': // 姓名
						searchCriteria.name = $scope.searchValue;
						break;
					case '3': // 手机号码
						searchCriteria.cell = $scope.searchValue;
						break;
					case '4': // 社保号码
						searchCriteria.sin = $scope.searchValue;
						break;
					default:
						toastr.warning('暂不支持该搜索项。');
						$scope.loading = false;
						return;

				}

				$scope.patients = [];
				$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'users/search', searchCriteria)
					.then(function (response) {
							// check if return null
							if (response.return && response.return == 'null'){
								$scope.patients = [];
								return;
							}
							$scope.patients = response.data;
							$scope.loading = false;

						},
						function(error){
							toastr.error(error.messageFormatted);
							$scope.loading = false;
						});

			};

			var init = function () {
				$scope.searchOption = '2'; // select 姓名 by default

			};

			init();

		});

})();
