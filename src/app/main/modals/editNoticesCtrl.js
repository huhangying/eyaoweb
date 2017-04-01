/**
 * Created by harry on 16/12/31.
 */

(function() {

	'use strict';

	angular
		.module('app.main.notices', [])
		.controller('EditNoticesController', function ($scope, $rootScope, $http, toastr, CONFIG, $timeout) {
			var vm = this;

			$scope.selectOk = function() {
				if ($scope.readonly) {
					this.$dismiss();
					return;
				}
				this.$close($scope.notices);
			};

			$scope.updateNotices = function() {
				$scope.notices = $scope.noticeList
					.filter(function(notice) {
						return notice.selected === true;
					});
			};

			$scope.addNotice = function() {
				$scope.inserted = {
					notice: '',
					days_to_start: -1,
					during: 1,
					require_confirm: true
				};
				$scope.noticeList.unshift($scope.inserted);
				$timeout(function(){
					$scope.rowform.show(); // enter edit mode
				});
			};

			var init = function () {
				$scope.notices = [];
				$scope.noticeList = [];
				var prescription;
				var notices;

				if ($scope.readonly) {
					prescription = $scope.history.diagnose.prescription;
					notices = $scope.history.diagnose.notices;
				}
				else {
					prescription = $scope.diagnose.prescription;
					notices = $scope.diagnose.notices;
				}

				var notice = {};
				if (prescription && prescription.length>0) {
					for (var i=0; i<prescription.length; i++) {
						if (prescription[i].notices && prescription[i].notices.length > 0) {
							for (var j=0; j<prescription[i].notices.length; j++) {
								notice =prescription[i].notices[j];
								notice.startDate = new Date(prescription[i].startDate);
								if (prescription[i].endDate) {
									notice.endDate = new Date(prescription[i].endDate);
								}

								$scope.noticeList.push(notice);
							}
						}
					}
				}

				if (notices && notices.length>0) {
					// 在 notices 里面的都是已经选择了的。
					$scope.notices = notices.map(function(notice) {
						notice.selected = true;
						return notice;
					});
					// override模式加入到药品都带的所有的notice list.
					$scope.noticeList = _.unionBy($scope.notices, $scope.noticeList, '_id');
				}

			};

			init();

		});

})();
