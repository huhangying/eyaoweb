(function() {

    'use strict';

    angular
        .module('app.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, $http, toastr, $uibModal, $filter, $q, CONFIG) {
        var vm = this;

		//
		// mode:
		//		0: Edit 和 View 模式下都可能显示;
		//		1: Edit 模式下显示;
		//		2: View 模式下显示;
		// display:
		//		true: always show
		//		控制0()模式中的edit
		// display1: 控制0()模式中的view
		$scope.switchInMode = function(mode, display, display1) {

			switch(mode) {
				case 0: // edit & view
					if ($scope.readonly) { // in view mode
					// if ($scope.history && $scope.history.diagnose) { // in view mode
						return display1 || true;
					}
					else {	// in edit mode
						return display || $scope.diagnose.user;
					}
					break;

				case 1: // edit only
					if (!($scope.readonly)) {
					// if (!($scope.history && $scope.history.diagnose)) {
						return display || $scope.diagnose.user;
					}
					break;

				case 2: // view only
					if ($scope.readonly) { // in view mode
					// if ($scope.history && $scope.history.diagnose) { // in view mode
						return display || false;
					}
					break;
				default:
					return false; // 不显示
			}
			return false;

		};

		var checkFirstVisit = function () {
			$scope.isFirstVisit = true;
			if ($scope.patient.visitedDepartments && $scope.patient.visitedDepartments.length > 0) {
				for (var i=0; i<$scope.patient.visitedDepartments.length; i++) {
					if ($scope.patient.visitedDepartments[i] == $rootScope.login.department) {
						$scope.isFirstVisit = false;
						break;
					}
				}
			}
		};

		var updateDiagnose = function(loadDiagnose, fromBooking) {

			var bookingId;
			if (fromBooking) {
				bookingId = $scope.diagnose.booking;
			}
			if ($scope.diagnose._id) {

				if (loadDiagnose) {
					$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'diagnose/' + $rootScope.login._id + '/' + $scope.diagnose.user)
						.then(function (response) {
								// check if return null
								if (response.data && response.data.return && response.data.return == 'null'){
									if (!fromBooking) {
										$scope.diagnose.booking = undefined;
									}
									$scope.diagnose.surveys = [];
									$scope.diagnose.assessment = undefined;
									$scope.diagnose.prescription = [];
									$scope.diagnose.notices = [];
									$scope.diagnose.status = 1; // doctor operating

									//toastr.error(CONFIG.Error.NoData);
								}
								else {
									$scope.diagnose = response.data;
									if (fromBooking) {
										$scope.diagnose.booking = bookingId;
									}
								}

								// replace/update
								vm.saveDiagnose();

							},
							function(){
								toastr.error(CONFIG.Error.Internal);
							});
				}
				else {
					// update
					vm.saveDiagnose();
				}

			}
			else { // no id
				if (loadDiagnose) {
					$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'diagnose/' + $rootScope.login._id + '/' + $scope.diagnose.user)
						.then(function (response) {
								// check if return null
								if (response.data && response.data.return && response.data.return == 'null'){
									if (!fromBooking) {
										$scope.diagnose.booking = undefined;
									}
									$scope.diagnose.surveys = [];
									$scope.diagnose.assessment = undefined;
									$scope.diagnose.prescription = [];
									$scope.diagnose.notices = [];
									$scope.diagnose.status = 1; // doctor operating

									// create
									vm.createDiagnose();
									return;
								}
								$scope.diagnose = response.data;
								if (fromBooking) {
									$scope.diagnose.booking = bookingId;
								}

							},
							function(){
								toastr.error(CONFIG.Error.Internal);
							});
				}
				else {
					toastr.warning('should not enter here ever');
				}

			}

		};

		vm.createDiagnose = function() {

			// create
			$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'diagnose', $scope.diagnose)
				.then(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							//$scope.diagnose = [];
							return;
						}
						$scope.diagnose = response.data;

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});
		};

		vm.saveDiagnose = function() {
			var diagnose = angular.copy($scope.diagnose);
			diagnose.__v = undefined;
			$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'diagnose/' + $scope.diagnose._id, diagnose)
				.then(function (response) {
						// check if return null
						if (response.return && response.return == 'null'){
							//$scope.diagnose = [];
							return;
						}
						$scope.diagnose = response.data;

					},
					function(){
						toastr.error(CONFIG.Error.Internal);
					});
			return $scope.myPromise;
		};

		vm.selectBooking = function () {

			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/selectBooking.html',
				controller: 'SelectBookingController',
				size: 'lg'
			})
				.result.then(
				function (booking) {
					// $scope.booking = booking;
					// $scope.patient = booking.user;
					$scope.diagnose.booking = booking._id;
					$scope.patient = booking.user;
					checkFirstVisit();
					$scope.diagnose.user = booking.user._id;

					updateDiagnose(true, true);
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		vm.selectPatient = function () {

			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/selectPatient.html',
				controller: 'SelectPatientController',
				size: 'lg'
			})
				.result.then(
				function (patient) {
					$scope.patient = patient;
					checkFirstVisit();
					$scope.diagnose.user = patient._id;

					updateDiagnose(true);
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		vm.createPatient = function () {

			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/newPatient.html',
				controller: 'NewPatientController',
				size: 'lg'
			})
				.result.then(
				function (patient) {
					$scope.patient = patient;
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		// readonly 只读模式下运行
		// check diagnose下有没有填写问卷
		vm.hasAvailableSurveys = function(diagnose, type) {
			diagnose.surveys.map(function(survey) {
				if (survey.type == type) {
					return survey.list && survey.list.length > 0;
				}
			});
			return false;
		};

		vm.openSurvey = function (type, readonly, diagnose) {
			$scope.selectedSurveyType = type;
			if (type == 1) {
				$scope.selectedSurveyType = $scope.isFirstVisit ? 1 : 2;
			}
			$scope.readonly = readonly;
			$scope.viewSurveyList = undefined;
			if (readonly) {
				// 如果是查看门诊历史记录, 那么survey list 可以从门诊里直接得到
				for (var i=0; i<diagnose.surveys.length; i++) {
					// 初诊复诊的type is from diagnose
					if (diagnose.surveys[i].type == $scope.selectedSurveyType) {
						$scope.viewSurveyList = diagnose.surveys[i].list;
						break;
					}
				}
			}

			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/surveyEdit.html',
				controller: 'SurveyEditController',
				size: 'lg'
			})
				.result.then(
				function (surveys) {
					if (!surveys || surveys.length < 1) {
						return;
					}

					// add survey ids into diagnose
					var surveyIds = [];
					for (var i=0; i<surveys.length; i++) {
						surveyIds.push(surveys[i]._id);
					}

					var existed = false;
					for (var i=0; i<$scope.diagnose.surveys.length; i++) {
						if ($scope.diagnose.surveys[i].type === $scope.selectedSurveyType) {
							// update if existed
							existed = true;
							$scope.diagnose.surveys[i].list = surveyIds;
						}
					}

					// create if not existed
					if (!existed) {
						$scope.diagnose.surveys.push({type: $scope.selectedSurveyType, list: surveyIds});
					}

					// only update the surveys section to diagnose
					$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'diagnose/' + $scope.diagnose._id,
						{
							surveys: $scope.diagnose.surveys,
							prescription: undefined // don't update prescription
						})
						.then(function (response) {
								// check if return null
								if (response.return && response.return == 'null'){
									//$scope.diagnose = [];
									return;
								}
								$scope.diagnose = response.data;

							},
							function(){
								toastr.error(CONFIG.Error.Internal);
							});
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};


		var sendWechatMessage = function (type, targetUrl) {
			// 发送消息给微信
			var reqBody = {
				openidList: [$scope.patient.link_id],
				type: 1,
				articles: [
					{
						title: CONFIG.surveyTypes[type],
						description: '请填写' + CONFIG.surveyTypes[type] + '问卷, 谢谢配合!',
						url: targetUrl,
						picurl: ''
					}
				]
			};

			$http.defaults.headers.post['Content-Type'] = 'text/plain';
			$scope.myPromise = $http.post(CONFIG.msgPostUrl, reqBody)
				.success(function(response) {
					if (!response || response.result != 1) {
						toastr.error('问卷发送失败.');
						return;
					}

					toastr.success('问卷发送成功。');
				})
				.error(function(err){
					toastr.error("问卷发送失败");
				});
		};

		vm.sendSurvey = function (type, selectSurveys) {

			if (selectSurveys) {
				$scope.selectedSurveyType = type;
				$uibModal.open({
					scope: $scope,
					animation: true,
					ariaLabelledBy: 'modal-title-top',
					ariaDescribedBy: 'modal-body-top',
					templateUrl: 'app/main/modals/surveySelect.html',
					controller: 'SurveySelectController',
					size: 'lg'
				})
					.result.then(
					function (surveyIdList) {
						// todo: send to wechat
						var url = 'http://localhost:3001/surveyEdit/' + $rootScope.login.department + '/' +
							$scope.diagnose.doctor + '/' + $scope.diagnose.user + '/' +
							$scope.selectedSurveyType + '/' + surveyIdList.join('|');
						//console.log(url);
						sendWechatMessage(type, url)
					},
					function (err) {
						//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
					});

				return;
			}

			sendWechatMessage(type, 'http://www.google.ca')
		};

		vm.addMedicine = function () {
			$scope.editedMedicine = undefined;
			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/newMedicine.html',
				controller: 'NewMedicineController',
				size: 'lg'
			})
				.result.then(
				function (medicine) {
					$scope.diagnose.prescription.push(medicine);
					vm.saveDiagnose();
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		$scope.showDosageWay = function(way) {
			var selected = [];
			if(way && way > 0) {
				selected = $filter('filter')(CONFIG.medicineDosageWays, {value: way});
			}
			return selected.length ? selected[0].text : '未设置';
		};

		$scope.editPrescription = function(medicine) {
			$scope.editedMedicine = medicine;
			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/newMedicine.html',
				controller: 'NewMedicineController',
				size: 'lg'
			})
				.result.then(
				function (_medicine) {
					// update medicine
					for (var i=0; i<$scope.diagnose.prescription.length; i++) {
						if ($scope.diagnose.prescription[i]._id === _medicine._id) {
							$scope.diagnose.prescription[i] = _medicine;
							break;
						}
					}
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		$scope.removePrescription = function(itemId) {

			// remove from diagnose.notices
			if ($scope.diagnose.notices && $scope.diagnose.notices.length > 0) {
				var removedNotices = $scope.diagnose.prescription[index].notices || [];
				$scope.diagnose.notices = $scope.diagnose.notices.filter(function(notice) {
					for (var i=0; i<removedNotices.length; i++) {
						if (notice._id === removedNotices[i]._id) {
							return false;
						}
					}
					return true;
				})
			}


			$scope.diagnose.prescription = $scope.diagnose.prescription.filter(function(med) {
				return med._id != itemId;
			});
			vm.saveDiagnose();
		};

		vm.editNotices = function (readonly, diagnose) {
			$scope.readonly = readonly;
			if (readonly) {
				// 如果是查看门诊历史记录, 那么viewNoticeList 可以从门诊里直接得到
				$scope.history = { diagnose: angular.copy(diagnose) };
			}

			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/editNotices.html',
				controller: 'EditNoticesController',
				size: 'lg'
			})
				.result.then(
				function (notices) {
					$scope.readonly = undefined;
					$scope.diagnose.notices = notices;
					vm.saveDiagnose();
				},
				function (err) {
					$scope.readonly = undefined;
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		vm.createLabResult = function () {
			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/newLabResult.html',
				controller: 'NewLabResultController',
				size: 'lg'
			})
				.result.then(
				function (labResults) {
					$scope.diagnose.labResults = [];
					labResults.map(function(result) {
						if (result._id) {
							// update
							$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'labresult/' + result._id, result)
								.then(function (response) {
										// check if return null
										if (response.return && response.return == 'null'){
											toastr.error('没能更新数据到数据库');
											return;
										}
										$scope.diagnose.labResults.push(response.data._id);
										vm.saveDiagnose();

									},
									function(error){
										toastr.error(error.messageFormatted);
									});
						}
						else {
							// create
							$scope.myPromise = $http.post(CONFIG.baseApiUrl + 'labresult', result)
								.then(function (response) {
										// check if return null
										if (response.return && response.return == 'null'){
											toastr.error('没能创建到数据库');
											return;
										}
										$scope.diagnose.labResults.push(response.data._id);
										vm.saveDiagnose();

									},
									function(error){
										toastr.error(error.messageFormatted);
									});
						}

					});
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		vm.viewPatientHistory = function () {
			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/history/history.html',
				controller: 'HistoryController',
				size: 'lg'
			})
				.result.then(
				function (ret) {
					// tbd:
					$scope.readonly = undefined;
					$scope.history = undefined;
				},
				function (err) {
					$scope.readonly = undefined;
					$scope.history = undefined;
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		vm.submitDiagnose = function () {

			// save prescription first

			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/submit.html',
				controller: 'SubmitController',
				size: 'lg'
			})
				.result.then(
				function (status) {
					// reset environment

					var promises = [];
					// set status of surveys inside to 'finished'
					$scope.diagnose.surveys.map(function(survey) {
						if (!survey.finished && survey.list && survey.list.length > 0) {
							survey.list.map(function(surveyId) {
								// update
								$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'survey/' + surveyId,
									{ finished: true })
									.then(function (response) {
											// check if return null
											if (response.data.return && response.data.return == 'null'){
												//toastr.warning('后台无此问卷' + survey.name);
												//return;
											}
											//$scope.patient = response.data;
											//toastr.success('更新成功')

										},
										function(){
											toastr.error(CONFIG.Error.Internal);
										});
								promises.push($scope.myPromise);
							});
						}
					});

					$q.all(promises).then(function(values) {
						// save status
						$scope.diagnose.status = status;
						vm.saveDiagnose().then(
							function() {
								//todo: send out 随访问卷和

								// 药师门诊评估
								// 发送消息给微信
								var reqBody = {
									openidList: [$scope.patient.link_id],
									type: 1,
									articles: [
										{
											title: '药师门诊评估',
											description: '感谢您选择新华医院 ' + $rootScope.login.name + $rootScope.login.title + '门诊! 请对我们的服务进行评估。',
											url: CONFIG.peerPageUrl + 'web/serviceEvaluation?userid=' + $scope.patient._id + '&doctorid=' + $rootScope.login._id,
											picurl: ''
										}
									]
								};

								$http.defaults.headers.post['Content-Type'] = 'text/plain';
								$scope.myPromise = $http.post(CONFIG.msgPostUrl, reqBody)
									.success(function(response) {
										if (!response || response.result != 1) {
											toastr.error('药师门诊评估发送失败.');
											return;
										}

										toastr.success('药师门诊评估发送成功。');
									})
									.error(function(err){
										toastr.error("药师门诊评估发送失败");
									});

								// 更新 booking 的状态
								if ($scope.diagnose.booking) {

									$scope.myPromise = $http.post(CONFIG.baseApiUrl + $scope.diagnose.booking, { status: 5 }).then(
										function(response) {

										},
										function(err) {
											toastr.error("更新预约状态失败。");
										}
									);

								}


								// reset environment
								resetEnvironment();
							},
							function(err) {
								toastr.error('发送门诊失败!');
							}

						);

					});

				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		$scope.showInterval = function(intervalDayValue) {
			var selected = [];
			if(intervalDayValue > -1) {
				selected = $filter('filter')($scope.intervalDays, {value: intervalDayValue});
			}
			return selected.length ? selected[0].name : '';
		};


		var resetEnvironment = function() {
			$scope.diagnose = {
				doctor: $rootScope.login._id,
				prescription: [],
				notices: []
			};
			$scope.prescription = [];
			$scope.prescriptionNotices = [];	// notices for doctor to select
			$scope.notices = [];				// notices for users
			// ! cannot reset patient info (including visitedDepartments)
		};

		var init = function () {
			if ($scope.history && $scope.history.diagnose) {
				//loadDiagnose($scope.history.diagnoseId);
				$scope.diagnose = $scope.history.diagnose;
				return;
			}
			else {
				resetEnvironment();
			}

			$scope.patient = {};
			$http.get(CONFIG.baseApiUrl + 'const/medicine_periods')
				.success(function (response) {
					//console.log(JSON.stringify(response))
					if (!response ){
						toastr.error('无数据!')
					}
					else if (response.return == 'error') {
						toastr.error(response.message);
					}
					else{
						$scope.intervalDays = [];
						response.value.split('|').map(function(item) {
							$scope.intervalDays.push({
								name: item.split(':')[0],
								value: parseInt(item.split(':')[1])
							});
						});
					}
				});

		};
		init();
	}

})();
