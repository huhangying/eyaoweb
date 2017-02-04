/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.submit', [])

		.controller('SubmitController', function ($scope, $rootScope, $http, toastr, CONFIG) {
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

				this.$close(CONFIG.diagnoseStatus.Archived);
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

				this.$close(CONFIG.diagnoseStatus.Saved);
			};

			$scope.getTypeById = function(id) {
				switch (id) {
					case 0:
					case 1:
						return 'radio';
					case 2:
						return 'checkbox';
					case 3: //text
						return 'hidden';
				}
			};

			$scope.changeSelection = function (question, index) {
				if (question.answer_type == 0 || question.answer_type == 1) {
					for (var i=0; i<question.options.length; i++) {
						question.options[i].selected = (i == index);
					}
				}
				else if (question.answer_type == 2) {
					question.options[index].selected = !question.options[index].selected;
				}

			};

			var init = function () {
				$scope.activeTab = 0;

				// load 门诊结论问卷
				var list = '';
				var selectedSurveys = $scope.diagnose.surveys.filter(function(_survey) {
					return _survey.type == 5;
				});
				if (selectedSurveys && selectedSurveys.length > 0) {
					if (selectedSurveys[0].list && selectedSurveys[0].list.length>0) {
						list = selectedSurveys[0].list.join('|');
					}
				}
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'surveys/' + $scope.diagnose.doctor
					+ '/' + $scope.diagnose.user + '/5/' + list)
					.success(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							// load from template
							$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'surveyTemplates/' + $rootScope.login.department + '/type/5')
								.success(function (response) {
									// check if return null
									if (response.return && response.return == 'null'){
										$scope.conclusion.surveys = [];
									}
									else {
										$scope.conclusion.surveys = response;
										$scope.conclusion.surveys.map(function(survey) {
											survey.surveyTemplate = survey._id;
											survey.doctor = $scope.diagnose.doctor;
											survey.user = $scope.diagnose.user;

											survey._id = undefined;
										});
									}

								})
								.error(function(){
									toastr.error(CONFIG.Error.Internal);
								});
						}
						else {
							$scope.conclusion.surveys = response;
						}

					})
					.error(function(){
						toastr.error(CONFIG.Error.Internal);
					});

				// load notices

			};

			init();

		});

})();
