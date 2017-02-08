(function() {

    'use strict';

    angular
        .module('app.book')
        .controller('BookController', BookController);

    /** @ngInject */
    function BookController($scope) {
        var vm = this;

		$scope.detailFrame = 'http://223.93.176.119:8880/rosten-medical/doctor/makeAppointmentView';
	}

})();
