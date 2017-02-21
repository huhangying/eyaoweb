(function() {

    'use strict';

    angular
        .module('app.patientGroupManage')
        .controller('PatientGroupManageController', PatientGroupManageController);

    /** @ngInject */
    function PatientGroupManageController($scope, $rootScope, CONFIG) {

        var vm = this;

		$scope.detailFrame = CONFIG.peerPageUrl + 'doctor/patientGroupManage?doctor=' + $rootScope.login._id;
    }

})();
