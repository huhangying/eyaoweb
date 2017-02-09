(function() {

    'use strict';

    angular
        .module('app.patientGroupManage')
        .controller('PatientGroupManageController', PatientGroupManageController);

    /** @ngInject */
    function PatientGroupManageController($scope) {

        var vm = this;

		$scope.detailFrame = 'http://223.93.176.119:8880/rosten-medical/doctor/patientGroupManage';
    }

})();
