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
			$scope.forms = [];

			var checkContent = function() {
				if (!$scope.groups || $scope.groups.length < 1) {
					toastr.warning('需要至少一个问卷');
					return false;
				}

				for (var i=0; i<$scope.groups.length; i++) {
					if (!$scope.groups[i] || !$scope.groups[i].surveys || $scope.groups[i].surveys.length < 1) {
						toastr.warning('每个组内需要至少一个问卷');
						return false;
					}

					for (var n=0; n<$scope.groups[i].surveys.length; n++) {
						if (!$scope.groups[i].surveys[n] || !$scope.groups[i].surveys[n].questions || $scope.groups[i].surveys[n].questions.length < 1) {
							toastr.warning('每个组每一个问卷至少需要一个问题');
							return false;
						}

						for (var m=0; m<$scope.groups[i].surveys[n].questions.length; m++) {
							var question = $scope.groups[i].surveys[n].questions[m];
							if (!question.options || question.options.length < 1) {
								toastr.warning('每个组每一个问卷每一个问题至少需要一个答案');
								return false;
							}

							if (question.apply && question.required) { // 问题为必选, 需要监测是否答案已选
								if (question.answer_type == 3 ) {
									if (!question.options[0].answer) {
										toastr.warning('请输入回答问题[' + question.question + ']');
										return false;
									}
								}
								else {
									var selectedCount = 0;
									for (var x=0; x<question.options.length; x++) {
										if (question.options[x].selected) {
											selectedCount++;
										}
									}
									if (selectedCount === 0) {
										toastr.warning('请选择问题[' + question.question + ']的答案');
										return false;
									}
								}

							}
						}
					}

				}

				return true;
			};

			$scope.selectOk = function() {
				// validation first.
				if (!checkContent()) {
					return;
				}

				// convert and save
				convertAndSave();

				// return to main process
				this.$close($scope.surveyFirst);
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

			var convertAndSave = function () {

				$scope.groups.map(function(group) {
					var surveys = [];

					//if ($scope.forms[index].$dirty) {
					group.surveys.map(function(survey) {
						var reqSurvey = {
							department: $rootScope.login.department,
							group: group.id,
							name: survey.name,
							order: survey.order,
							type: 1,
							questions: survey.questions
						}
						toastr.info(reqSurvey);

						// save
						$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'survey', reqSurvey)
							.success(function (response) {
								surveys.push(reqSurvey);
							})
							.error(function(error){
								toastr.error(error.messageFormatted);
							});

					});
					
				});

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
