/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.surveySelect', [])

		.controller('SurveySelectController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.surveys = [];

			$scope.selectOk = function() {
				var selectedSurveyIdList = [];
				$scope.surveys.map(function(survey) {
					if (survey.selected) {
						selectedSurveyIdList.push(survey._id);
					}

				});

				// return to main process
				this.$close(selectedSurveyIdList);
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
							$scope.surveys = [];
						}
						else {
							$scope.surveys = response;
							$scope.surveys.map(function(survey) {
								survey.surveyTemplate = survey._id;
								survey.doctor = $rootScope.login._id;
								survey.user = $scope.diagnose.user;

								survey._id = undefined;
							});
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
