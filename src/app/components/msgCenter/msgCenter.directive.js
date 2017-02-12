
(function () {
	'use strict';

	angular.module('app.components')
		.directive('msgCenter', msgCenter);

	/** @ngInject */
	function msgCenter() {
		return {
			restrict: 'E',
			templateUrl: 'app/components/msgCenter/msgCenter.html',
			controller: 'MsgCenterCtrl',
			scope: {
				object: '='
			}
		};
	}

})();
