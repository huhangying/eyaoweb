(function() {

    'use strict';

    angular
        .module('rin')
        .controller('AppController', AppController)
		.filter("localeOrderBy", [function () {
			return function (array, sortPredicate, reverseOrder) {
				if (!Array.isArray(array)) return array;
				if (!sortPredicate) return array;

				var arrayCopy = [];
				angular.forEach(array, function (item) {
					arrayCopy.push(item);
				});

				arrayCopy.sort(function (a, b) {
					var valueA = a[sortPredicate];
					var valueB = b[sortPredicate];

					return !reverseOrder ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
				});

				return arrayCopy;
			}
		}]);

    /** @ngInject */
	function AppController()  {

        var vm = this;

    }

})();
