(function() {

    'use strict';

    angular
        .module('app.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, $http, toastr, $uibModal, $filter, CONFIG, $window) {
        var vm = this;

		var updateDiagnose = function() {
			if ($scope.diagnose._id) {
				// update

			}
			else { // create
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
			}

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
					$scope.diagnose.user = booking.user._id;

					updateDiagnose();
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
					$scope.diagnose.user = patient._id;

					updateDiagnose();
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
				function (survey) {
					switch(type) {
						case 1:
							$scope.surveyFirst = survey;
					}
				},
				function (err) {
					//toastr.info('错误: ' + err.messageFormatted + ' @' + new Date());
				});
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
				function (conclusion) {
					$scope.conclusion = conclusion;
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
					updatePrescriptionNotices();
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
					updatePrescriptionNotices();
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

			updatePrescriptionNotices();
		};

		var updatePrescriptionNotices = function() {
			$scope.prescriptionNotices = [];
			if ($scope.diagnose.prescription && $scope.diagnose.prescription.length>0) {
				for (var i=0; i<$scope.diagnose.prescription.length; i++) {
					if ($scope.diagnose.prescription[i].notices && $scope.diagnose.prescription[i].notices.length) {
						for (var j=0; j<$scope.diagnose.prescription[i].notices.length; j++) {
							if ($scope.diagnose.prescription[i].notices[j].apply) {
								$scope.prescriptionNotices.push($scope.diagnose.prescription[i].notices[j]);
							}
						}
					}
				}
			}

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


		var init = function () {
			$scope.patient = {
				_id: '57981d36ccc395a90ec28020',
				name: '张三'
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
