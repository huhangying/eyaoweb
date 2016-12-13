(function() {

    'use strict';

    angular
        .module('app.book', [])
		.config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.book', {
            url  : '/book',
            views  : {
                'content@app': {
                    templateUrl: 'app/book/book.html',
                    controller : 'BookController as vm'
                }
            }
        });
    }
})();
