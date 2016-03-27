(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('songDetailsCtrl', songDetailsCtrl);

	songDetailsCtrl.$inject = ['$timeout','$ionicLoading','$cordovaDialogs','$http','$stateParams','$localForage','$rootScope'];

	function songDetailsCtrl($timeout,$ionicLoading,$cordovaDialogs,$http,$stateParams,$localForage,$rootScope) {
		//content
		var vm = this,
		songId = $stateParams.id

		vm.songDetails = ''

		vm.getSong = function(songId){

			$localForage.getItem('songList').then(function(songs){
				//buscar la cancion
				var song = _.find(songs,{'Id':songId})
				vm.songDetails = song
			})
		}

		vm.getInfoFromLastFM = function(){
			$cordovaDialogs.confirm('Do you want to get track info automaticatelly?', 'Hey!', ['Please','Nope'])
		    .then(function(buttonIndex) {
		      // no button = 0, 'OK' = 1, 'Cancel' = 2
		      var btnIndex = buttonIndex;
		      if(btnIndex == 1){

			    $ionicLoading.show({
			      template: '<ion-spinner></ion-spinner><p>Please wait ...</p>'
			    });

		      	$http({
				  method: 'GET',
				  url: 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=8cf3a69f80d503675694282e32960069&track='+vm.songDetails.Title+'&artist='+vm.songDetails.Author+'&format=json'
				}).then(function successCallback(response) {
			    	//console.log(response)
					$ionicLoading.hide()
					var track = response.data.track,
					message = response.data.message

					if(undefined != message && message != ""){
						alert(message)
					}else{
						vm.songDetails.Title = track.name
						vm.songDetails.Author = track.artist.name
						vm.songDetails.Album = track.album.title
						//suele tener más de una imagen , es un arreglo
						vm.songDetails.Cover = track.album.image[2]['#text']
						//console.log(track.album.image[1])
					}

			  	}, function errorCallback(response) {
			    	alert('Oops! there was an error')
			    	$ionicLoading.hide()
			  	});

		      }
		    });
		}

		vm.saveDetails = function(){
			//borrar la canción de la lista y volver a añadirla
			/*$localForage.pull({'Id':vm.songDetails.Id}).then(function(deleted){
				console.log('borrado => '+JSON.stringify(deleted))
			})*/
			$ionicLoading.show({
		      template: '<ion-spinner></ion-spinner><p>Please wait ...</p>'
		    });

			$localForage.getItem('songList').then(function(songs){
				var current = _.find(songs,{'Id':vm.songDetails.Id})

				var newSongList = _.pull(songs, current)

				//console.log(newSongList+' => lista nueva')

				newSongList.push(vm.songDetails)

				//actualizar tambien las canciones favoritas y las de las playlist
				$localForage.getItem('favoriteSongs').then(function(favoritos){
					var current = _.find(favoritos,{'Id':vm.songDetails.Id})
					console.log('de favoritos => '+JSON.stringify(current))

					var nuevaFav = _.pull(favoritos,current)

					//la añadimos nuevamente
					nuevaFav.push(vm.songDetails)

					//guardar 
					$localForage.setItem('favoriteSongs',nuevaFav)
				})

				$localForage.getItem('playlistSongs').then(function(playlists){
					var current = _.find(playlists,{'Id':vm.songDetails.Id})
					console.log('de palylist => '+JSON.stringify(current))

					var nuevaPlaylist = _.pull(playlists,current)

					//la añadimos nuevamente
					//añadir id de playlist
					vm.songDetails.pid = current.pid
					nuevaPlaylist.push(vm.songDetails)
					//guardar 
					$localForage.setItem('playlistSongs',nuevaPlaylist)
				})

				//console.log('añadida la nueva cancion => '+JSON.stringify(newSongList))

				$localForage.setItem('songList',newSongList)

				//actualizar la lista de canciones actual
				$rootScope.loadSongs()

				$timeout(function(){
					$ionicLoading.hide()
				},2000)
			})
			//obtener la información de last fm

			
		}

		vm.getSong(songId)
	}
})();