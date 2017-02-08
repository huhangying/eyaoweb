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
                    templateUrl: 'http://223.93.176.119:8880/rosten-medical/web/switchChats',
                    controller : 'ChatController as vm'
                }
            }
        });
    }
})();
