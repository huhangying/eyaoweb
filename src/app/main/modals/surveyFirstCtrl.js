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
				if (!$scope.firstSurveys || $scope.firstSurveys.length < 1) {
					toastr.warning('需要至少一个问卷调查');
					return false;
				}

				for (var i=0; i<$scope.firstSurveys.length; i++) {
					if (!$scope.firstSurveys[i].questions || $scope.firstSurveys[i].questions.length < 1) {
						toastr.warning('每个问卷调查至少需要有一个问题');
						return false;
					}

					for (var m=0; m<$scope.firstSurveys[i].questions.length; m++) {
						var question = $scope.firstSurveys[i].questions[m];
						if (!question.options || question.options.length < 1) {
							toastr.warning('每个问题至少需要一个答案');
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

				$scope.firstSurveys.map(function(survey) {
					// save
					if (survey._id) { // update
						$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'survey/' + survey._id, survey)
							.success(function (response) {
								toastr.info('更新问卷' + survey.name + '成功');
							})
							.error(function(){
								toastr.error(CONFIG.Error.Internal);
							});
					}
					else {
						$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'survey', survey)
							.success(function (response) {
								survey = response;
								toastr.info('创建问卷' + survey.name + '成功');
							})
							.error(function(){
								toastr.error(CONFIG.Error.Internal);
							});
					}

				});

			};

			var loadFromTemplate = function(department) {
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'surveyTemplates/' + department + '/type/1')
					.success(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							$scope.firstSurveys = [];
						}
						else {
							$scope.firstSurveys = response;
							$scope.firstSurveys.map(function(survey) {
								survey.surveyTemplate = survey._id;
								survey.user = $scope.patient._id;

								survey._id = undefined;
							});
						}

					})
					.error(function(){
						toastr.error(CONFIG.Error.Internal);
					});
			};

			var init = function () {
				$scope.firstSurveys = [];

				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'surveys/' + $rootScope.login.department
					+ '/' + $scope.patient._id + '/1')
					.success(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							$scope.firstSurveys = [];

							loadFromTemplate($rootScope.login.department);
						}
						else {
							$scope.firstSurveys = response;
							// $scope.firstSurveys.map(function(survey) {
							// 	survey.surveyTemplate = survey._id;
							// 	survey.user = $scope.patient._id;
                            //
							// 	survey._id = undefined;
							// });
						}

					})
					.error(function(){
						toastr.error(CONFIG.Error.Internal);
					});

			};

			init();

		});

})();
