/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.surveyEdit', [])

		.controller('SurveyEditController', function ($scope, $rootScope, $http, toastr, CONFIG, $stateParams) {
			var ctrl = this;
			var type, department, doctor, user, list;
			$scope.surveys = [];

			var checkContent = function() {
				if (!$scope.surveys || $scope.surveys.length < 1) {
					toastr.warning('需要至少一个问卷调查');
					return false;
				}

				for (var i=0; i<$scope.surveys.length; i++) {
					if (!$scope.surveys[i].questions || $scope.surveys[i].questions.length < 1) {
						toastr.warning('每个问卷调查至少需要有一个问题');
						return false;
					}

					for (var m=0; m<$scope.surveys[i].questions.length; m++) {
						var question = $scope.surveys[i].questions[m];
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
				this.$close($scope.surveys);
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

				$scope.surveys.map(function(survey) {
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

			var loadFromTemplate = function(department, doctor, user, type, list) {
				var reqUrl ='';
				if (list) {
					reqUrl = CONFIG.baseApiUrl + 'surveyTemplates/' + department + '/type/' + type + '/' + list;
				}
				else {
					reqUrl = CONFIG.baseApiUrl + 'surveyTemplates/' + department + '/type/' + type;
				}
				$scope.myPromise = $http.get(reqUrl)
					.success(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							$scope.surveys = [];
						}
						else {
							$scope.surveys = response;
							$scope.surveys.map(function(survey) {
								survey.surveyTemplate = survey._id;
								survey.doctor = doctor;
								survey.user = user;

								survey._id = undefined;
							});
						}

					})
					.error(function(){
						toastr.error(CONFIG.Error.Internal);
					});
			};

			var init = function () {
				type = $stateParams.type || $scope.selectedSurveyType;
				department = $stateParams.department || $rootScope.login.department;
				doctor = $stateParams.doctor || $rootScope.login._id;
				user = $stateParams.user || $scope.diagnose.user;
				list = $stateParams.list;
				if (!list) {
					var selectedSurveys = $scope.diagnose.surveys.filter(function(_survey) {
						return _survey.type == type;
					});
					if (selectedSurveys && selectedSurveys.length > 0) {
						if (selectedSurveys[0].list && selectedSurveys[0].list.length>0) {
							list = selectedSurveys[0].list.join('|');
						}
					}
				}


				$scope.surveyTitle = CONFIG.surveyTypes[type];
				var reqUrl ='';
				if (list) {
					reqUrl = CONFIG.baseApiUrl + 'surveys/' + doctor + '/' + user + '/' + type + '/' + list;
				}
				else {
					reqUrl = CONFIG.baseApiUrl + 'surveys/' + doctor + '/' + user + '/' + type;
				}
				$scope.myPromise = $http.get(reqUrl)
					.success(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							loadFromTemplate(department, doctor, user, type, list);
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
