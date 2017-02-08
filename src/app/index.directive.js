(function() {

    'use strict';

    angular
        .module('rin')
		.directive('windowResize', ['$window', '$rootScope', function($window, $rootScope){
			return {
				restrict: 'A',
				link: function(scope, element, attrs){
					scope.onResize = function() {
						$rootScope.frameHeight = $window.innerHeight -50 -42;
					}
					scope.onResize();

					angular.element($window).bind('resize', function() {
						scope.onResize();
					});
				}
			}}]);

})();
