/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.surveyEdit', [])

		.controller('SurveyEditController', function ($scope, $rootScope, $http, toastr, CONFIG, $stateParams, $q, $uibModalInstance) {
			var vm = this;
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
				if (!$scope.readonly) {
					// validation first.
					if (!checkContent()) {
						return;
					}

					// convert and save
					convertAndSave().then(
						function(values) {
							$scope.surveys = [];
							// return to main process
							for (var i=0; i<values.length; i++) {
								$scope.surveys.push(values[i].data);
							}
							$uibModalInstance.close($scope.surveys);
						},
						function(err) {
							toastr.error(CONFIG.Error.Internal);
						});
				}
				else {
					$uibModalInstance.dismiss();
				}


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

				var promises = [];

				$scope.surveys.map(function(survey) {
					// save
					if (survey._id) { // update
						$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'survey/' + survey._id, survey)
							.success(function (response) {
								toastr.info('更新问卷' + survey.name + '成功');
								// return response;
							})
							.error(function(){
								toastr.error(CONFIG.Error.Internal);
							});
					}
					else { // create
						$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'survey', survey)
							.success(function (response) {
								survey = response;
								toastr.info('创建问卷' + survey.name + '成功');
								// return response;
							})
							.error(function(){
								toastr.error(CONFIG.Error.Internal);
							});
					}

					promises.push($scope.myPromise);

				});

				return $q.all(promises);

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

								// convert availableDays to availableBy
								survey.availableBy = moment().add(survey.availableDays || 30, 'days');
							});
						}
						$scope.loading = false;

					})
					.error(function(){
						toastr.error(CONFIG.Error.Internal);
						$scope.loading = false;
					});
			};

			var init = function () {
				$scope.loading = true;

				type = $stateParams.type || $scope.selectedSurveyType;
				department = $stateParams.department || $rootScope.login.department;
				if ($scope.readonly) {
					doctor = $rootScope.historySelectedDoctor;
				}
				else {
					doctor = $stateParams.doctor || $scope.diagnose.doctor;
				}
				user = $stateParams.user || $scope.diagnose.user;
				if ($scope.viewSurveyList) {  // $scope.viewSurveyList 只可能在 readonly 的时候有值
					list = $scope.viewSurveyList.join('|');
				}
				else if(!$scope.readonly) {
					list = $stateParams.list;
					if (!list) {
						if ($scope.diagnose.surveys && $scope.diagnose.surveys.length > 0) {
							var tempList = [];
							for (var i=0; i<$scope.diagnose.surveys.length;i++) {
								if ($scope.diagnose.surveys[i].type == type) {
									tempList.push($scope.diagnose.surveys[i].list.join('|'));
								}
							}
							list = tempList.join('|');
						}
					}
				}

				// 如果list没有survey，就到surveyTemplate去取；如果有survey list，直接加载
				$scope.surveyTitle = CONFIG.surveyTypes[type];
				if ($scope.readonly) {
					$scope.surveyTitle = '门诊问卷';
				}
				var reqUrl ='';
				if (list) {
					var readonly = 0;
					if ($scope.readonly) {
						readonly = 1;
					}
					reqUrl = CONFIG.baseApiUrl + 'surveys/' + doctor + '/' + user + '/' + type + '/' + list + '/' + readonly;
					$scope.myPromise = $http.get(reqUrl)
						.success(function (response) {
							// check if return null
							if (response.return && response.return == 'null' && !$scope.readonly ){
								loadFromTemplate(department, doctor, user, type, list);
							}
							else {
								// put into diagnose.surveys
								var surveys = response;
								var list = [];
								for (var i=0; i<surveys.length; i++) {
									list.push(surveys[i]._id);
								}
								if (!$scope.diagnose.surveys || $scope.diagnose.surveys.length < 1) {
									$scope.diagnose.surveys = [{
										type: type,
										list: list
									}];
								}
								else {
									var found = false;
									$scope.diagnose.surveys.map(function(surv) {
										if (surv.type === type) {
											surv.list = list;
											found = true;
										}
									});
									if (!found) {
										$scope.diagnose.surveys.push({
											type: type,
											list: list
										});
									}
								}

								$scope.surveys = response;
								$scope.loading = false;
							}

						})
						.error(function(){
							toastr.error(CONFIG.Error.Internal);
							$scope.loading = false;
						});
				}
				else if (!$scope.readonly){
					//loadFromTemplate(department, doctor, user, type, list);

					// 正在进行的每个药师和病患和问卷类型，只能有一个！！！
					reqUrl = CONFIG.baseApiUrl + 'surveys/' + doctor + '/' + user + '/' + type  + '/0';
					$scope.myPromise = $http.get(reqUrl)
						.success(function (response) {
							// check if return null
							if (response.return && response.return == 'null' && !$scope.readonly ){
								loadFromTemplate(department, doctor, user, type, list);
							}
							else {
								// put into diagnose.surveys
								var surveys = response;
								var list = [];
								for (var i=0; i<surveys.length; i++) {
									list.push(surveys[i]._id);
								}
								if (!$scope.diagnose.surveys || $scope.diagnose.surveys.length < 1) {
									$scope.diagnose.surveys = [{
										type: type,
										list: list
									}];
								}
								else {
									var found = false;
									$scope.diagnose.surveys.map(function(surv) {
										if (surv.type === type) {
											surv.list = list;
											found = true;
										}
									});
									if (!found) {
										$scope.diagnose.surveys.push({
											type: type,
											list: list
										});
									}
								}

								$scope.surveys = response;
								$scope.loading = false;
							}

						})
						.error(function(){
							toastr.error(CONFIG.Error.Internal);
							$scope.loading = false;
						});
				}

			};

			init();

		});

})();
