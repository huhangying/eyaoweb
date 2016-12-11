(function() {

    'use strict';

    angular
        .module('app.articlePush', ['textAngular', 'flow'])
		.config(['$provide', function($provide){
			// this demonstrates how to register a new tool and add it to the default toolbar
			$provide.decorator('taOptions', ['$delegate', function(taOptions){
				// $delegate is the taOptions we are decorating
				// here we override the default toolbars and classes specified in taOptions.
				taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
				taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
				taOptions.toolbar = [
					['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
					['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
					['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
					['html', 'insertImage', 'insertLink']
				];
				taOptions.classes = {
					focussed: 'focussed',
					toolbar: 'btn-toolbar',
					toolbarGroup: 'btn-group',
					toolbarButton: 'btn btn-secondary btn-sm',
					toolbarButtonActive: 'active',
					disabled: 'disabled',
					textEditor: 'form-control',
					htmlEditor: 'form-control'
				};
				return taOptions; // whatever you return will be the taOptions
			}]);

		}])
		.config(['flowFactoryProvider', function (flowFactoryProvider) {
			flowFactoryProvider.defaults = {
				// target: util.baseApiUrl + 'upload',
				target: 'http://127.0.0.1:3000/upload',
				testChunks: false,
				permanentErrors: [500, 501],
				maxChunkRetries: 1,
				chunkRetryInterval: 5000,
				simultaneousUploads: 1
			};
		}])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider.state('app.articlePush', {
            url  : '/article',
            views  : {
                'content@app': {
                    templateUrl: 'app/articlePush/articlePush.html',
                    controller : 'ArticlePushController as vm'
                }
            }
        });
    }
})();
