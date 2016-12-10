/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.articlePush.template', ['textAngular', 'flow'])
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
					toolbarButton: 'btn btn-default',
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

		.controller('SelectTemplateController', function ($scope, $rootScope, $http, toastr) {
			var ctrl = this;


			$scope.selectOk = function() {
				this.$close();
			};
			var baseApiUrl = 'http://139.224.68.92:3000/';

			var templateChanged = function() {
				if (!$scope.selectedTemplate) {return;}

				// load template
				$http.get(baseApiUrl + 'template/' + $scope.selectedTemplate)
					.success(function(response) {
						if (!response || response.length < 1 ||
							(response.return && response.return.length > 0)) {
							toastr.warning('没有可用的模块, 请联系管理员, 先在管理后台中添加专科模版.');
							return;
						}

						$scope.template = response;
					})
					.error(function(err){
						toastr.error(err);
					});
			};

			var init = function () {
				$scope.cats = [];
				$scope.loadCats = function() {
					$http.get(baseApiUrl + 'articlecats/department/' + $rootScope.login.department)
						.success(function (response) {
							// check if return null
							if (response.return && response.return == 'null'){
								$scope.cats = [];
							}
							else {
								$scope.cats = response;
							}

						})
						.error(function(error){
							toastr.error(error.messageFormatted);
						});
				};
				$scope.loadCats();

				$scope.templates = [];
				$scope.loadTemplates = function() {
					$http.get(baseApiUrl + 'templates/department/' + $rootScope.login.department)
						.success(function (response) {
							// check if return null
							if (response.return && response.return == 'null'){
								$scope.templates = [];
								toastr.warning('没有可用的模块, 请联系管理员, 先在管理后台中添加专科模版.');
							}
							else {
								$scope.templates = response;
							}

						})
						.error(function(error){
							toastr.error(error.messageFormatted);
						});
				};
				$scope.loadTemplates();

			};

			init();

			$scope.$watch('selectedTemplate', templateChanged);

		});

})();
