(function() {
    'use strict';

    angular
        .module('app.core',
            [
                'ngAnimate',
                'angularMoment',
                'ngResource',
                'ui.bootstrap',
                'ui.router',
                'toastr',
				'cgBusy',
				'xeditable',
				'ui.select',
				'ngSanitize',
				'smart-table'
            ])
		.value('cgBusyDefaults',{
			message:'正在处理...',
			backdrop: false
		})
		// 使用 lodash: allow DI for use in controllers
		.constant('_', window._)
		.run(function ($rootScope, amMoment) {
			$rootScope._ = window._;
			moment.locale('zh-cn');
		});
})();
