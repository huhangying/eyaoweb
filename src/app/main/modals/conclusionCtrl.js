/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.conclusion', [])

		.controller('ConclusionController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.conclusion = {};

			$scope.selectOk = function() {
				this.$close($scope.conclusion);
			};



			var init = function () {
				$scope.activeTab = 0;

			};

			init();

		});

})();
