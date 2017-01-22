/**
 * Created by harry on 16/12/31.
 */

(function() {

	'use strict';

	angular
		.module('app.main.newLabResult', [])
		.controller('NewLabResultController', function ($scope, $rootScope, $http, toastr, CONFIG, $q) {
			var vm = this;

			$scope.selectOk = function() {
				this.$close($scope.labResults);
			};

			$scope.updateContent = function() {
				if (!$scope.editResult._id && !$scope.editResult.saved) {
					// create
					$scope.editResult.saved = true;
					$scope.labResults.push(angular.copy($scope.editResult));
				}
				else {
					// update
					for (var i=0; i<$scope.labResults.length; i++) {
						if (!$scope.editResult.saved) {
							if ($scope.labResults[i]._id === $scope.editResult._id) {
								$scope.labResults[i] = angular.copy($scope.editResult);
								break;
							}
						}
						else {
							if ($scope.labResults[i].name === $scope.editResult.name) {
								$scope.labResults[i] = angular.copy($scope.editResult);
								break;
							}
						}

					}
				}
				$scope.editResult = undefined;
			};

			$scope.cancelUpdateContent = function ()
			{
				$scope.editResult = undefined;
			};

			$scope.editLabResult = function (result) {
				result.testDate = new Date(result.testDate);
				$scope.editResult = angular.copy(result);
			}

			$scope.addLabResult = function() {
				$scope.editResult = {
					doctor: $scope.diagnose.doctor,
					user: $scope.diagnose.user,
					name: '',
					list: [],
					testDate: ''
				};
			};

			$scope.removeLabResult = function(index) {
				$scope.labResults.splice(index, 1);
			};

			$scope.addLabTestItem = function() {
				$scope.inserted = {
					item: '',
					result: ''
				};

				$scope.editResult.list.push($scope.inserted);
			};

			$scope.deleteItem = function(index) {
				$scope.editResult.list.splice(index, 1);
			};

			$scope.checkItem = function (data) {
				if (!data) {
					return '必填项';
				}
			};

			var init = function () {
				$scope.labResults = $scope.labResults || [];
				if ($scope.diagnose.labResults.length > 0) {
					$scope.diagnose.labResults.map(function(id) {
						$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'labresult/' + id)
							.then(function (response) {
									// check if return null
									if (response.return && response.return == 'null'){
										toastr.error('没能获取化验单数据');
										return;
									}
									$scope.labResults.push(response.data);

								},
								function(error){
									toastr.error(error.messageFormatted);
								});
					});

				}
				else {
					$scope.addLabResult();
				}

			};

			init();

		});

})();
