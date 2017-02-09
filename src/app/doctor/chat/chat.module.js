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
                    templateUrl: 'app/doctor/chat/chat.html',
                    controller : 'ChatController as vm'
                }
            }
        });
    }
})();
