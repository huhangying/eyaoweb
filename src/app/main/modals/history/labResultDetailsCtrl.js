/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.history.labResultDetails', [])

		.controller('LabResultDetailsController', function ($scope) {

			$scope.selectOk = function() {
				this.$close();
			};

			var init = function () {
				$scope.history.labResultDetails = $scope.history.labResults[$scope.history.labResultIndex];
			};

			init();
		});

})();
