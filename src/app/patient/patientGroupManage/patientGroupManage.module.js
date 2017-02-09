(function() {

    'use strict';

    angular
        .module('app.patientGroupManage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.patientGroupManage', {
            url  : '/patientGroupManage',
            views  : {
                'content@app': {
                    templateUrl: 'app/patient/patientGroupManage/patientGroupManage.html',
                    controller : 'PatientGroupManageController as vm'
                }
            }
        });
    }
})();
