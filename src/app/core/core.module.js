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
				'cgBusy'
            ])
		.value('cgBusyDefaults',{
			message:'正在处理...',
			backdrop: false
		});
})();
