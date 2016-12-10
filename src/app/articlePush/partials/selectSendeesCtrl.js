/**
 * Created by harry on 16/12/9.
 */
(function() {

	'use strict';

	angular
		.module('app.articlePush.receivers', [])
		.controller('SelectSendeesController', function ($scope, $rootScope, $http, toastr) {
			var ctrl = this;
			$scope.groups = [];

			$scope.selectOk = function() {
				this.$close();
			};
			var baseApiUrl = 'http://139.224.68.92:3000/';

			$scope.toggleGroup = function(index) {
				var gs = !$scope.groups[index].selected;

				$scope.groups[index].users.map(function(user) {
					user.selected = gs;
				});
				$scope.groups[index].selected = gs;
			}

			var getGroupIndexByName = function (group_name) { 
				for (var i=0; i<$scope.groups.length; i++) { 
					if ($scope.groups[i].name === group_name) { 
						return i; 
					} 
				} 
				return -1; 
			};

			var init = function () {
				$http.get(baseApiUrl + 'relationships/doctor/' + $rootScope.login._id + '/select')
					.success(function(response) {
						if (!response || response.length < 1 ||
							(response.return && response.return.length > 0)) {
							toastr.error('不正确的用户名或密码, 请确认后重试.');
							return;
						}

						if (response && response.length > 0) { 
							var item, groupName, index;   
							for(var i=0; i<response.length; i++) { 
								item = response[i]; 
								if (item.group){ 
									groupName = item.group.name || '未分组'; 
								} 
								else { 
									groupName = '未分组'; 
								}  
								index = getGroupIndexByName(groupName); 
								if (index < 0) { 
									// create NEW 
									$scope.groups.push({ 
										name: groupName, 
										users: [ 
											{ 
												id: item.user.link_id, 
												name: item.user.name 
											} 
										] 
									}); 
								} 
								else { 
									// insert into the group 
									$scope.groups[index].users.push({ 
										id: item.user.link_id, 
										name: item.user.name 
									}); 
								}  
							} 
						}


					})
					.error(function(err){
						toastr.error(err);
					});
			};

			init();

		});

})();
