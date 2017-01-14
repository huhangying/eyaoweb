/**
 * Created by harry on 16/12/31.
 */

(function() {

	'use strict';

	angular
		.module('app.main.notices', [])
		.controller('EditNoticesController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var vm = this;

			$scope.selectOk = function() {
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
			};

			var init = function () {
				$scope.notices = [];

				$scope.noticeList = [];
				if ($scope.diagnose.prescription && $scope.diagnose.prescription.length>0) {
					for (var i=0; i<$scope.diagnose.prescription.length; i++) {
						if ($scope.diagnose.prescription[i].notices && $scope.diagnose.prescription[i].notices.length > 0) {
							for (var j=0; j<$scope.diagnose.prescription[i].notices.length; j++) {
								$scope.noticeList.push($scope.diagnose.prescription[i].notices[j]);
							}
						}
					}
				}

				if ($scope.diagnose.notices && $scope.diagnose.notices.length>0) {
					// 在 notices 里面的都是已经选择了的。
					$scope.notices = $scope.diagnose.notices.map(function(notice) {
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
