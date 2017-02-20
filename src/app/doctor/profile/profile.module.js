(function() {

    'use strict';

    angular
        .module('app.profile', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.profile', {
            url  : '/profile',
            views  : {
                'content@app': {
                    templateUrl: 'app/doctor/profile/profile.html',
                    controller : 'ProfileController as vm'
                }
            }
        });
    }
})();
