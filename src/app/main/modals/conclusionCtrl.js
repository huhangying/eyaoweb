/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.conclusion', [])

		.controller('ConclusionController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.conclusion = {};

			$scope.selectOk = function() {

				// add/update visited departments
				$scope.patient.visitedDepartments = $scope.patient.visitedDepartments || [];
				var isExisted = false;
				for (var i=0; i<$scope.patient.visitedDepartments.length; i++) {
					if ($scope.patient.visitedDepartments[i] == $rootScope.login.department) {
						isExisted = true;
						break;
					}
				}
				if (!isExisted) {
					$scope.patient.visitedDepartments.push($rootScope.login.department);
					// update
					$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'user/wechat/' + $scope.patient.link_id,
						{ visitedDepartments: $scope.patient.visitedDepartments })
						.then(function (response) {
								// check if return null
								if (response.data.return && response.data.return == 'null'){
									toastr.warning('后台无此数据')
									return;
								}
								//$scope.patient = response.data;
								toastr.success('更新成功')

							},
							function(){
								toastr.error(CONFIG.Error.Internal);
							});
				}

				this.$close($scope.conclusion);
			};

			$scope.rollbackVisitedDepartments = function () {
				// add/update visited departments
				$scope.patient.visitedDepartments = $scope.patient.visitedDepartments || [];

				var isDeleted = false;
				for (var i=0; i<$scope.patient.visitedDepartments.length; i++) {
					if ($scope.patient.visitedDepartments[i] == $rootScope.login.department) {
						$scope.patient.visitedDepartments.splice(i, 1);
						isDeleted = true;
						break;
					}
				}

				if (!isDeleted) {
					$scope.patient.visitedDepartments.push($rootScope.login.department);
					// update
					$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'user/wechat/' + $scope.patient.link_id,
						{ visitedDepartments: $scope.patient.visitedDepartments })
						.then(function (response) {
								// check if return null
								if (response.data.return && response.data.return == 'null'){
									toastr.warning('后台无此数据')
									return;
								}
								//$scope.patient = response.data;
								toastr.success('更新成功')

							},
							function(){
								toastr.error(CONFIG.Error.Internal);
							});
				}
			};


			var init = function () {
				$scope.activeTab = 0;

			};

			init();

		});

})();
