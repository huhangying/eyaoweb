(function() {

	'use strict';

	angular
		.module('app.home', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {

		$stateProvider.state('app.home', {
			url  : '/home',
			views  : {
				'content@app': {
					templateUrl: 'app/home/home.html',
					// templateUrl: 'test/test.html',
					// templateUrl: 'http://223.93.176.119:8880/rosten-medical/doctor/pushMessage?companyId=402880fb-5942f1e0-0159-42f57f7d-000d',
					controller : 'HomeController as vm'
				}
			}
		});
	}
})();
