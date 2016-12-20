/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.newPatient', [])

		.controller('NewPatientController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.newPatient = {};

			$scope.selectOk = function() {
				this.$close($scope.newPatient);
			};



			var init = function () {


			};

			init();

		});

})();
