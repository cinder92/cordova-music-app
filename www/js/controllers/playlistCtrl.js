(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('playlistCtrl', playlistCtrl);

	playlistCtrl.$inject = ['$scope','$rootScope','$localForage'];

	function playlistCtrl($scope,$rootScope,$localForage) {
		//content
		var vm = this
		vm.playlists = ''
		$scope.$on("$ionicView.beforeEnter",function(){
			//mostrar el boton de añadir nueva
			$rootScope.isPlaylist = true
			vm.getPlaylists()
		})

		$scope.$on("$ionicView.beforeLeave",function(){
			//mostrar el boton de añadir nueva
			$rootScope.isPlaylist = false
		})

		vm.getPlaylists = function(){
			$localForage.getItem('playlist').then(function(pls){
				//console.log(pls)
				if(undefined != pls && null != pls && pls.length > 0){
					vm.playlists = pls
				}
			})
		}

		$rootScope.addnewPlayList = function(){
			//añadir nueva playlist
			var plsname = prompt('Create new playlist','', ['Cancel,Perfect!'], 'New Playlist');
			
			if(plsname != ''){

				$localForage.getItem('playlist').then(function(playlist){
					if(undefined != playlist && null != playlist && playlist.length > 0){
						//buscar el nombre actual
						var pls = _.find(playlist,{'name' : plsname})

						if(undefined != pls && null != pls){
							//alert('There is one playlist with same name, do you want to delete it?')
						}else{
							var currentPlayLists = playlist,
							plsInfo = {
								id : Math.floor((Math.random() * 9999) + 1111),
								name : plsname,
								songs : []
							}

							currentPlayLists.push(plsInfo)
							$localForage.setItem('playlist',currentPlayLists);
						}
					}else{
						//crearla
						var currentPlayLists = [{
							id : Math.floor((Math.random() * 9999) + 1111),
							name : plsname,
							songs : []
						}]

						$localForage.setItem('playlist',currentPlayLists);
					}

					vm.getPlaylists()
				})
			}
		}

		vm.playNow = function(plsdid,id,position){
			if(plsid > 0){
				//buscar la playlist, y reproducir todas las canciones en ella, en cola
				var args = {
					plsid : plsdid,
					id : id,
					position : position
				}
				$rootScope.$emit('fromPlaylist', args);
			}else{
				//return false
			}
		}

		vm.addToPlayList = function(plsid,song){
			//do something
		}


	}
})();