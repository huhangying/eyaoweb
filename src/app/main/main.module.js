(function() {

    'use strict';

    angular
        .module('app.main', [])
		.config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.main', {
            url  : '/main',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/main.html',
                    controller : 'MainController as vm'
                }
            }
        });
    }
})();
