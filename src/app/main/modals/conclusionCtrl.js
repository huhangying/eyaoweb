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
				this.$close($scope.conclusion);
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
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'surveys/' + $scope.diagnose.doctor
					+ '/' + $scope.diagnose.user + '/6')
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
							$scope.surveys = response;
						}

					})
					.error(function(){
						toastr.error(CONFIG.Error.Internal);
					});
			};

			init();

		});

})();
