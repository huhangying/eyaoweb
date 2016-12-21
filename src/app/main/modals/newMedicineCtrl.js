/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.newMedicine', [])

		.controller('NewMedicineController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.newMedicine = {};

			$scope.selectOk = function() {
				this.$close($scope.newMedicine);
			};



			var init = function () {


			};

			init();

		});

})();
