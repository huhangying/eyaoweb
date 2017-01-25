(function() {

    'use strict';

    angular
        .module('rin', [

            // Core
            'app.core',
			//'CONFIG',

            // Navigation
            'app.sidebar',
            'app.topbar',

            // Views
            'app.login',
            'app.register',
            'app.home',
			'app.main',
			'app.main.booking',
			'app.main.patient',
			'app.main.newPatient',
			'app.surveyEdit',
			'app.main.surveyEdit',
			'app.main.surveySelect',
			'app.main.conclusion',
			'app.main.newMedicine',
			'app.main.notices',
			'app.main.newLabResult',
			'app.main.history',
			'app.main.history.labResultDetails',
			'app.chat',
			'app.book',
			'app.articlePush',
			'app.articlePush.receivers',
			'app.articlePush.template',
			'app.articlePush.old',
			'app.components'

		]);
})();
