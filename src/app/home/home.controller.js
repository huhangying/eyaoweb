(function() {

	'use strict';

	angular
		.module('app.home')
		.controller('HomeController', HomeController);

	/** @ngInject */
	function HomeController($scope, $rootScope, CONFIG) {
		var vm = this;

		var init = function() {
			if ($rootScope.login) {
				$scope.detailFrame = CONFIG.peerPageUrl + 'wx/start?doctor=' + $rootScope.login._id;
			}
		};
		init();
	}

})();
