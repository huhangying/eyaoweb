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
            'app.components',
			'app.main',
			'app.main.booking',
			'app.main.patient',
			'app.main.newPatient',
			'app.surveyEdit',
			'app.main.surveyEdit',
			'app.main.surveySelect',
			'app.main.newMedicine',
			'app.main.notices',
			'app.main.newLabResult',
			'app.main.history',
			'app.main.history.labResultDetails',
			'app.main.submit',
			'app.chat',
			'app.book',
			'app.profile',
			'app.shortcut',
			'app.articlePush',
			'app.articlePush.receivers',
			'app.articlePush.template',
			'app.articlePush.old',
			'app.patientManage',
			'app.patientGroupManage',
			'app.pushMessage',
			'app.test'

		]);
})();
