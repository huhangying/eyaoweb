/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.surveyFirst', [])

		.controller('SurveyFirstController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.surveyFirst = {};

			$scope.selectOk = function() {
				// get article by id
				this.$close($scope.surveyFirst);
			};

			$scope.getTypeById = function(id) {
				switch (id) {
					case 0:
					case 1:
						return 'radio';
					case 2:
						return 'checkbox';
					case 3:
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
				$scope.firstSurveys = [];
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'surveyTemplates/' + $rootScope.login.department + '/1/0')
					.success(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							$scope.firstSurveys = [];
						}
						else {
							$scope.firstSurveys = response;
							$scope.groups = [];
							$scope.firstSurveys.map(function(survey) {
								var found = false;
								for (var i=0; i<$scope.groups.length; i++) {
									if ($scope.groups[i].id === survey.group) {
										found = true;
										$scope.groups[i].surveys.push({
											questions: survey.questions,
											name: survey.name,
											order: survey.order
										});
										break;
									}
								}
								if (found === false) {
									$scope.groups.push({
										id: survey.group,
										surveys: [{
											questions: survey.questions,
											name: survey.name,
											order: survey.order
										}]
									});
								}
							});
						}

					})
					.error(function(error){
						toastr.error(error.messageFormatted);
					});
			};

			init();

		});

})();
