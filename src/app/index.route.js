(function() {

    'use strict';

    angular
        .module('rin')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: 'app/core/layouts/default.html'
                    },
                    'topbar@app': {
                        templateUrl: 'app/frame/navigation/topbar/topbar.html',
                        controller : 'TopbarController as vm'
                    },
                    'sidebar@app': {
                        templateUrl: 'app/frame/navigation/sidebar/sidebar.html',
                        controller : 'SidebarController as vm'
                    }
                }
            });
		$locationProvider.html5Mode(true); // remove # in path
    }

})();
