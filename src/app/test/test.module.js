(function() {

    'use strict';

    angular
        .module('app.test', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.test', {
            url  : '/test',
            views  : {
                'content@app': {
                    templateUrl: 'http://223.93.176.119:8880/rosten-medical/doctor/pushMessage',
                    controller : 'TestController as vm'
                }
            }
        });
    }
})();
