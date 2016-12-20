/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.main.surveyFirst', [])

		.controller('SurveyFirstController', function ($scope, $rootScope, $http, toastr, CONFIG) {
			var ctrl = this;
			$scope.surveyFirst = {};

			$scope.selectOk = function() {
				// get article by id
				this.$close($scope.surveyFirst);

			};

			var init = function () {

			};

			init();

		});

})();
