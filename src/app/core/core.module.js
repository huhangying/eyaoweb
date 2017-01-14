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
				'xeditable'
            ])
		.value('cgBusyDefaults',{
			message:'正在处理...',
			backdrop: false
		})
		// 使用 lodash: allow DI for use in controllers
		.constant('_', window._)
		.run(function ($rootScope) {
			$rootScope._ = window._;
		});
})();
