(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('songDetailsCtrl', songDetailsCtrl);

	songDetailsCtrl.$inject = ['$cordovaFile','$timeout','$ionicLoading','$cordovaDialogs','$http','$stateParams','$localForage','$rootScope'];

	function songDetailsCtrl($cordovaFile,$timeout,$ionicLoading,$cordovaDialogs,$http,$stateParams,$localForage,$rootScope) {
		//content
		var vm = this,
		songId = $stateParams.id

		vm.songDetails = ''

		/*document.addEventListener('DOWNLOADER_downloadSuccess', function(event){
		  	var data = event.data;
		  	var path = cordova.file.externalRootDirectory.replace('file://','')+data[0].name;
			
		  	//renombrar el archivo descargado
		  	var newName = randomString()+'.jpg'
			  $cordovaFile.moveFile(cordova.file.externalRootDirectory, data[0].name, cordova.file.externalDataDirectory,newName)
		      .then(function (success) {
		        // success
		        console.log(success)
		       
				vm.songDetails.Cover = cordova.file.externalDataDirectory.replace('file://','')+newName
				

				cordova.plugins.blurImage.blurImage(vm.songDetails.Cover,
				function(blurPath){	  
					//blur
				 	 vm.songDetails.Blur = blurPath;
				},function(e){  alert('Oops! there was an errro! => '+e)  })
				console.log(vm.songDetails)

		      }, function (error) {
		        // error
		         console.log('error al mover => '+JSON.stringify(error))
		      });

		});*/
		//blurear la imagen :D

		//save files
		//downloader.init({folder: "/", fileSystem : cordova.file.externalRootDirectory});
							

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
			    /*
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
						//console.log(track.album.image[2]['#text'])
						
						//suele tener más de una imagen , es un arreglo
						
						if(undefined != track.album){
							//descargar el cover art para ponerle blur
							downloader.init({folder: "covers"});
							downloader.get(track.album.image[2]['#text']);
							vm.songDetails.Cover = track.album.image[2]['#text']
							vm.songDetails.Blur = "covers/"+getFilename(track.album.image[2]['#text'])+'.png';
						}else{
							vm.songDetails.Cover = "img/vinyl.png"
							vm.songDetails.Blur = "img/vinyl.png"
						}

						if(track.name != ""){
							vm.songDetails.Title = track.name
						}else{
							vm.songDetails.Title = "<unknown>"
						}

						if(track.artist.name != ""){
							vm.songDetails.Author = track.artist.name
						}else{
							vm.songDetails.Author = "<unknown>"
						}

						if(track.album.title != ""){
							vm.songDetails.Album = track.album.title
						}else{
							vm.songDetails.Album = "<unknown>"
						}
						
					}

			  	}, function errorCallback(response) {
			    	alert('Oops! there was an error, '+response)
			    	$ionicLoading.hide()
			  	});*/

			  	$http({
			  		method : 'GET',
			  		url : 'https://itunes.apple.com/search?term='+encodeURIComponent(vm.songDetails.Title+' '+vm.songDetails.Author)+'&country=US&limit=1'
			  	}).then(function successCallback(response) {
			  		

			  		if(response.data.resultCount == 1){
			  			vm.songDetails.Title = response.data.results[0].trackName
			  			vm.songDetails.Cover = response.data.results[0].artworkUrl100.replace('100x100', '500x500')
			  			//vm.songDetails.Blur = response.data.results[0].artworkUrl100.replace('100x100', '500x500')
			  			vm.songDetails.Album = response.data.results[0].collectionName
			  			vm.songDetails.Genre = response.data.results[0].primaryGenreName
			  			vm.songDetails.Author = response.data.results[0].artistName


			  			if(vm.songDetails.Cover != ""){

			  				//downloader.get(vm.songDetails.Cover);
							//download file
							var fileTransfer = new FileTransfer(),
							fileName = randomString()+'.jpg'
							fileTransfer.download(vm.songDetails.Cover, cordova.file.externalRootDirectory + fileName, 
					        function(entry) {
					           
					        	//blur
					        	cordova.plugins.blurImage.blurImage(cordova.file.externalRootDirectory.replace('file://','') + fileName,
								function(blurPath){	  
									//blur
									 vm.songDetails.Cover = cordova.file.externalRootDirectory.replace('file://','') + fileName
								 	 vm.songDetails.Blur = blurPath;
								 	 console.log(vm.songDetails)
								},function(e){  alert('Oops! there was an errro! => '+e)  })

					        }, 
					        function(err) {
					            console.log('Err => '+JSON.stringify(err))
					        });

					        $ionicLoading.hide()

						}else{
							$ionicLoading.hide()
						}
						
						//cambiar la ruta de los archivos
						//vm.songDetails.Cover = cordova.file.externalRootDirectory+getFilename(vm.songDetails.Cover)
			  			//vm.songDetails.Blur = cordova.file.externalRootDirectory+getFilename(vm.songDetails.Cover)

			  		}else{
			  			$ionicLoading.hide()
			  			console.log(response)
			  		}

			  	}, function errorCallback(response) {
			    	alert('Oops! there was an error, '+JSON.stringify(response))
			    	$ionicLoading.hide()
			  	})

		      }
		    });
		}

		function randomString(){
			var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		    for( var i=0; i < 5; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));

		    return text;
		}

		vm.reverChanges = function(){
			vm.getSong(songId)
		}

		function getFilename(url){
		   if (url){
		      var m = url.toString().match(/.*\/(.+?)\./);
		      if (m && m.length > 1)
		      {
		         return m[1];
		      }
		   }
		   return "";
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
					//console.log('de favoritos => '+JSON.stringify(current))

					var nuevaFav = _.pull(favoritos,current)

					//la añadimos nuevamente
					nuevaFav.push(vm.songDetails)

					//guardar 
					$localForage.setItem('favoriteSongs',nuevaFav)
				})

				$localForage.getItem('playlistSongs').then(function(playlists){
					var current = _.find(playlists,{'Id':vm.songDetails.Id})
					//console.log('de palylist => '+JSON.stringify(current))

					var nuevaPlaylist = _.pull(playlists,current)

					//la añadimos nuevamente
					//añadir id de playlist

					if(undefined != current && null != current){
						vm.songDetails.pid = current.pid
						nuevaPlaylist.push(vm.songDetails)
						//guardar 
						$localForage.setItem('playlistSongs',nuevaPlaylist)
					}
				})

				//console.log('añadida la nueva cancion => '+JSON.stringify(newSongList))

				$localForage.setItem('songList',newSongList)

				//actualizar la lista de canciones actual
				$rootScope.loadSongs()
			})
			//obtener la información de last fm
			$timeout(function(){
				$ionicLoading.hide();
			},2000)
			
		}

		vm.getSong(songId)
	}
})();