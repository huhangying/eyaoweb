(function() {

	'use strict';

	angular
		.module('app.home')
		.controller('HomeController', HomeController);

	/** @ngInject */
	function HomeController($scope, $rootScope, CONFIG) {
		var vm = this;

		$scope.detailFrame = CONFIG.peerPageUrl + 'wx/start?doctor=' + $rootScope.login._id;
	}

})();
