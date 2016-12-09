(function() {

    'use strict';

    angular
        .module('app.articlePush', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.articlePush', {
            url  : '/article',
            views  : {
                'content@app': {
                    templateUrl: 'app/articlePush/articlePush.html',
                    controller : 'ArticlePushController as vm'
                }
            }
        });
    }
})();
