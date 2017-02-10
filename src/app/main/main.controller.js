(function() {

    'use strict';

    angular
        .module('app.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, $http, toastr, $uibModal, $filter, CONFIG) {
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
					if ($scope.history && $scope.history.diagnoseId) { // in view mode
						return display1 || true;
					}
					else {	// in edit mode
						return display || $scope.diagnose.user;
					}
					break;

				case 1: // edit only
					if (!($scope.history && $scope.history.diagnoseId)) {
						return display || $scope.diagnose.user;
					}
					break;

				case 2: // view only
					if ($scope.history && $scope.history.diagnoseId) { // in view mode
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

		var loadDiagnose = function (id) {
			if ($scope.history && $scope.history.diagnoseId) {
				$scope.myPromise = $http.get(CONFIG.baseApiUrl + 'diagnose/' + $scope.history.diagnoseId)
					.then(function (response) {
							// check if return null
							if (response.data && response.data.return && response.data.return == 'null'){
								toastr.error(CONFIG.Error.NoData);
							}
							else {
								$scope.diagnose = response.data;
							}

						},
						function(){
							toastr.error(CONFIG.Error.Internal);
						});
			}
		};

		var updateDiagnose = function(loadDiagnose, fromBooking) {

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

								// update
								vm.saveDiagnose();

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

			$scope.diagnose
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
			$scope.myPromise = $http.patch(CONFIG.baseApiUrl + 'diagnose/' + $scope.diagnose._id, $scope.diagnose)
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
					$scope.diagnose.booking = booking;
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

		vm.openSurvey = function (type) {
			$scope.selectedSurveyType = type;
			if (type == 1) {
				$scope.selectedSurveyType = $scope.isFirstVisit ? 1 : 2;
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
					// add survey ids into diagnose
					var surveyIds = [];

					surveys.map(function(survey) {
						surveyIds.push(survey._id);
					});

					var existed = false;
					$scope.diagnose.surveys.map(function(_survey) {
						if (_survey.type === $scope.selectedSurveyType) {
							// update if existed
							existed = true;
							_survey.list = surveyIds;
						}
					});

					// create if not existed
					if (!existed) {
						$scope.diagnose.surveys.push({type: $scope.selectedSurveyType, list: surveyIds});
					}
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};


		var sendWechatMessage = function (type, targetUrl) {
			// 发送消息给微信
			var reqBody = {
				openidList: [$scope.patient.link_id],
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

		vm.drawConclusion = function () {

			$uibModal.open({
				scope: $scope,
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'app/main/modals/conclusion.html',
				controller: 'ConclusionController',
				size: 'lg'
			})
				.result.then(
				function (conclusion) { // same as open/edit surveys
					// add survey ids into diagnose
					var surveyIds = [];

					conclusion.surveys.map(function(survey) {
						surveyIds.push(survey._id);
					});

					$scope.diagnose.surveys = _.union($scope.diagnose.surveys, surveyIds);
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
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

		$scope.removePrescription = function(index) {

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


			$scope.diagnose.prescription.splice(index, 1);
		};

		vm.selectNotices = function () {
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
					$scope.diagnose.notices = notices;
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		//todo:
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
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		vm.submitDiagnose = function () {
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

					// save status
					$scope.diagnose.status = status;
					vm.saveDiagnose();

				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
		};

		var init = function () {
			if ($scope.history && $scope.history.diagnoseId) {
				loadDiagnose($scope.history.diagnoseId);
				return;
			}

			$scope.patient = {

			};
			$scope.diagnose = {
				doctor: $rootScope.login._id,
				prescription: [],
				notices: []
			};
			$scope.prescription = [];
			$scope.prescriptionNotices = [];	// notices for doctor to select
			$scope.notices = [];				// notices for users


		};
		init();
	}

})();
