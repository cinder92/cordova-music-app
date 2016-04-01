(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('settingsCtrl', settingsCtrl);

	settingsCtrl.$inject = ['$localForage','$rootScope'];

	function settingsCtrl($localForage,$rootScope) {
		//content
		var vm = this

		//vm.curTheme = 'brown'

		vm.getcurrentTheme = function(){
			$localForage.getItem('themes').then(function(themes){
				if(undefined != themes && themes.length > 0){
					var actual = _.find(themes,{'active':1})
					vm.curTheme = actual
				}else{
					
					//temas
					var temas = [
						{	
							id : 'brown',
							name : 'Brown',
							active : 1
						},
						{	
							id : 'material',
							name : 'Material',
							active : 0
						},
						{	
							id : 'dark',
							name : 'Dark',
							active : 0
						}
					]

					//guardarlos
					$localForage.setItem('themes',temas)

					vm.curTheme = 'brown'
				}
			})

			console.log(vm.curTheme)
		}

		vm.setTheme = function(theme){
			
			$localForage.getItem('themes').then(function(themes){
				var find = _.find(themes,{'id' : theme}),
				newThemes = []
				if(undefined != find){
					$rootScope.style = theme
					vm.curTheme = theme

					if(vm.curTheme == 'material'){
						 window.plugins.tintstatusbar.setColor('#004540')
					}else{
						 window.plugins.tintstatusbar.setColor('#291e22')
					}
					//check as active
					for(var i = 0; i < themes.length; i++){
						if(themes[i].id == theme){
							themes[i].active = 1
						}else{
							themes[i].active = 0
						}
						newThemes.push(themes[i])
					}

					//save new config
					$localForage.setItem('themes',newThemes)
				}
			})
		}

		vm.getcurrentTheme()
	}
})();