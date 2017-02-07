(function() {

    'use strict';

    angular
        .module('app.chat', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.chat', {
            url  : '/chat',
            views  : {
                'content@app': {
                    templateUrl: 'http://223.93.176.119:8880/rosten-medical/doctor/pushMessage?companyId=402880fb-5942f1e0-0159-42f57f7d-000d',
                    controller : 'ChatController as vm'
                }
            }
        });
    }
})();
