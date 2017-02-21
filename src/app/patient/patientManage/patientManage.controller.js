(function() {

    'use strict';

    angular
        .module('app.patientManage')
        .controller('PatientManageController', PatientManageController);

    /** @ngInject */
    function PatientManageController($scope, $rootScope, CONFIG) {

        var vm = this;

		$scope.detailFrame = CONFIG.peerPageUrl + 'doctor/patientManage?doctor=' + $rootScope.login._id;
    }

})();
