(function() {

    'use strict';

    angular
        .module('app.shortcut', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.shortcut', {
            url  : '/shortcut',
            views  : {
                'content@app': {
                    templateUrl: 'app/doctor/shortcut/shortcut.html',
                    controller : 'ShortcutController as vm'
                }
            }
        });
    }
})();
