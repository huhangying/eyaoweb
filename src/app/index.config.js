(function() {

    'use strict';

    angular
        .module('rin')
        .config(config);

    /** @ngInject */
    function config($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			'http://*/**',
			'https://*/**',
			// Allow loading from our assets domain.  Notice the difference between * and **.
			'http://223.93.176.119:8880/**']);

	}

})();
