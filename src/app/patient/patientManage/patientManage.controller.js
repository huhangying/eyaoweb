(function() {

    'use strict';

    angular
        .module('app.patientManage')
        .controller('PatientManageController', PatientManageController);

    /** @ngInject */
    function PatientManageController($scope) {

        var vm = this;

		$scope.detailFrame = 'http://223.93.176.119:8880/rosten-medical/doctor/patientManage';
    }

})();
