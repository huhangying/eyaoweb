/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.history', [])

		.controller('HistoryController', function ($scope, $rootScope, $http, toastr, CONFIG, $uibModal) {
			var ctrl = this;
			$scope.history = {};

			$scope.selectOk = function() {
				this.$close($scope.conclusion);
			};

			// load data for each tab
			$scope.loadTab = function(tabIndex) {
				$scope.activeTab = tabIndex;

				switch(tabIndex) {
					case 1: // 门诊记录
						$scope.history.diagnoses = [];
						$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'diagnoses/history/' + $scope.diagnose.user)
							.then(function (response) {
									// check if return null
									if (response.data && response.data.return && response.data.return == 'null'){
										//toastr.error(CONFIG.Error.NoData);
									}
									else {
										$scope.history.diagnoses = response.data;
									}

								},
								function(){
									toastr.error(CONFIG.Error.Internal);
								});
						break;
					case 2: // 化验结果
						$scope.history.labResults = [];
						$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'labresult/user/' + $scope.diagnose.user)
							.then(function (response) {
									// check if return null
									if (response.data && response.data.return && response.data.return == 'null'){
										//toastr.error(CONFIG.Error.NoData);
									}
									else {
										$scope.history.labResults = response.data;
									}

								},
								function(){
									toastr.error(CONFIG.Error.Internal);
								});
						break;
					case 3: // 不良反应反馈
						$scope.history.feedback1 = [];
						$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'feedbacks/unread/1/user/' + $scope.diagnose.user)
							.then(function (response) {
									// check if return null
									if (response.data && response.data.return && response.data.return == 'null'){
										//toastr.error(CONFIG.Error.NoData);
									}
									else {
										$scope.history.feedback1 = response.data;
									}

								},
								function(){
									toastr.error(CONFIG.Error.Internal);
								});
						break;
					case 4: // 联合用药
						$scope.history.feedback1 = [];
						$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'feedbacks/unread/2/user/' + $scope.diagnose.user)
							.then(function (response) {
									// check if return null
									if (response.data && response.data.return && response.data.return == 'null'){
										//toastr.error(CONFIG.Error.NoData);
									}
									else {
										$scope.history.feedback2 = response.data;
									}

								},
								function(){
									toastr.error(CONFIG.Error.Internal);
								});
						break;
					case 5: // 今日用药
						$scope.history.prescriptionToday = [];
						// get latest diagnose

						$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'diagnose/history/latest/' + $scope.diagnose.user)
							.then(function (response) {
									// check if return null
									if (response.data && response.data.return && response.data.return == 'null'){
										//toastr.error(CONFIG.Error.NoData);
									}
									else {
										$scope.history.prescriptionToday = response.data.prescription;
										//todo: filter out non-today's
									}

								},
								function(){
									toastr.error(CONFIG.Error.Internal);
								});
						break;
				}
			};

			$scope.toggleLabResultDetails = function (index) {
				//$scope.history.labResults[index].expanded = !$scope.history.labResults[index].expanded;
				$scope.history.labResultIndex = index;
				$uibModal.open({
					scope: $scope,
					animation: true,
					ariaLabelledBy: 'modal-title-top',
					ariaDescribedBy: 'modal-body-top',
					templateUrl: 'app/main/modals/history/labResultDetails.html',
					controller: 'LabResultDetailsController',
					size: 'lg'
				});
			};

			$scope.viewDiagnoseDetails = function (id) {
				//$scope.history.labResults[index].expanded = !$scope.history.labResults[index].expanded;
				$scope.history.diagnoseId = id;
				$uibModal.open({
					scope: $scope,
					animation: true,
					ariaLabelledBy: 'modal-title-top',
					ariaDescribedBy: 'modal-body-top',
					templateUrl: 'app/main/main.html',
					controller: 'MainController',
					size: 'lg'
				});
			};

			var init = function () {
				$scope.activeTab = 0;

				// get person info
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'user/' + $scope.diagnose.user)
					.then(function (response) {
							// check if return null
							if (response.data && response.data.return && response.data.return == 'null'){
								//toastr.error(CONFIG.Error.NoData);
							}
							else {
								$scope.history.user = response.data;
							}

						},
						function(){
							toastr.error(CONFIG.Error.Internal);
						});
			};

			init();

		});

})();
