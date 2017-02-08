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
                    templateUrl: 'app/doctor/book/book.html',
                    // templateUrl: 'test/test.html',
                    // templateUrl: 'http://223.93.176.119:8880/rosten-medical/doctor/pushMessage?companyId=402880fb-5942f1e0-0159-42f57f7d-000d',
                    controller : 'BookController as vm'
                }
            }
        });
    }
})();
