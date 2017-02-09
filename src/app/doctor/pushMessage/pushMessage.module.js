(function() {

    'use strict';

    angular
        .module('app.pushMessage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.pushMessage', {
            url  : '/pushMessage',
            views  : {
                'content@app': {
                    templateUrl: 'app/doctor/pushMessage/pushMessage.html',
                    controller : 'PushMessageController as vm'
                }
            }
        });
    }
})();
