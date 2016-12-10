(function() {

    'use strict';

    angular
        .module('rin', [

            // Core
            'app.core',

            // Navigation
            'app.sidebar',
            'app.topbar',

            // Views
            'app.login',
            'app.register',
            'app.home',
            'app.components',
			'app.articlePush',
			'app.articlePush.receivers',
			'app.articlePush.template'

        ]);
})();
