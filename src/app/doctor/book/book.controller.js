(function() {

    'use strict';

    angular
        .module('app.book')
        .controller('BookController', BookController);

    /** @ngInject */
    function BookController($scope, $rootScope, CONFIG) {
        var vm = this;

		$scope.detailFrame = CONFIG.peerPageUrl + 'doctor/makeAppointmentView?doctor=' + $rootScope.login._id;
	}

})();
