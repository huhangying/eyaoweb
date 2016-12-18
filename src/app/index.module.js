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
			'app.main',
			'app.chat',
			'app.book',
			'app.articlePush',
			'app.articlePush.receivers',
			'app.articlePush.template',
			'app.articlePush.old',
			'app.components'

		]);
})();
