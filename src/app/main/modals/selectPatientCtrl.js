/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.patient', [])
		.controller('SelectPatientController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var vm = this;

			$scope.selectOk = function() {
				// toastr.info($scope.selectedPatient);
				this.$close($scope.selectedPatient);
			};

			$scope.searchPatients = function() {

				// validation
				if ($scope.form.$invalid) {
					return;
				}

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
						toastr.warning('暂不支持该搜索项。')
						return;

				}

				$scope.patients = [];
				$scope.getResults = true;

				$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'users/search', searchCriteria)
					.then(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							$scope.patients = [];
							return;
						}
						$scope.patients = response.data;

					},
					function(error){
						toastr.error(error.messageFormatted);
					});

			};

			var init = function () {


			};

			init();

		});

})();
