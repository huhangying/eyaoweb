(function() {

    'use strict';

    angular
        .module('app.surveyEdit', [])
		.config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.surveyEdit', {
            url  : '/surveyEdit/:department/:doctor/:user/:type',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/modals/surveyEdit.html',
                    controller : 'SurveyEditController as vm'
                }
            }
        });
    }
})();
