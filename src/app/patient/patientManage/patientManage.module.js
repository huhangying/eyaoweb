(function() {

    'use strict';

    angular
        .module('app.patientManage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.patientManage', {
            url  : '/patientManage',
            views  : {
                'content@app': {
                    templateUrl: 'app/patient/patientManage/patientManage.html',
                    controller : 'PatientManageController as vm'
                }
            }
        });
    }
})();
