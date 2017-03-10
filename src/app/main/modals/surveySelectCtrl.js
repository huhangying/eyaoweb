/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.surveySelect', [])

		.controller('SurveySelectController', function ($scope, $rootScope, $http, $q, $uibModalInstance, toastr, CONFIG) {
			var ctrl = this;
			$scope.surveyTemplates = [];

			$scope.selectOk = function() {
				var selectedSurveyIdList = [];

				// save surveys from survey templates
				var promises = [];
				$scope.surveyTemplates.map(function(template) {
					var survey = angular.copy(template);
					survey.surveyTemplate = template._id;
					survey.doctor = $scope.diagnose.doctor;
					survey.user = $scope.diagnose.user;
					survey._id = undefined;
					// convert availableDays to availableBy
					survey.availableBy = moment().add(template.availableDays || 30, 'days');

					$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'survey', survey)
						.then(function (response) {
								// check if return null
								if (response.data.return && response.data.return == 'null'){
									//toastr.warning('后台无此问卷' + survey.name);
									//return;
								}
								else {
									selectedSurveyIdList.push(response.data._id);
								}
							},
							function(){
								toastr.error(CONFIG.Error.Internal);
							});
					promises.push($scope.myPromise);

				});

				$q.all(promises).then(
					function(values) {
						// return to main process
						$uibModalInstance.close(selectedSurveyIdList);
					},
					function(err){
						$uibModalInstance.dismiss(err);
					});

			};

			$scope.getQuestionList = function(survey) {
				var str = '';
				if (survey && survey.questions && survey.questions.length > 0) {
					for (var i=0; i<survey.questions.length; i++) {
						str += survey.questions[i].question + '\r\n';
					}
				}
				return str;
			};


			var loadFromTemplate = function(department) {
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'surveyTemplates/' + department + '/type/' + $scope.selectedSurveyType)
					.success(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							$scope.surveyTemplates = [];
						}
						else {
							$scope.surveyTemplates = response;
							// $scope.surveys.map(function(survey) {
							// 	survey.surveyTemplate = survey._id;
							// 	survey.doctor = $rootScope.login._id;
							// 	survey.user = $scope.diagnose.user;
                            //
							// 	survey._id = undefined;
							// });
						}

					})
					.error(function(){
						toastr.error(CONFIG.Error.Internal);
					});
			};

			var init = function () {

				$scope.surveyTitle = CONFIG.surveyTypes[$scope.selectedSurveyType];


				loadFromTemplate($rootScope.login.department);
			};

			init();

		});

})();
