(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('nowPlayingCtrl', nowPlayingCtrl);

	nowPlayingCtrl.$inject = ['$scope','$rootScope','$localForage','$stateParams','$cordovaMedia','favoriteSongs'];

	function nowPlayingCtrl($scope,$rootScope,$localForage,$stateParams,$cordovaMedia,favoriteSongs) {
		//content
		var vm = this,
		duration = 0,
		currentSongPosition = parseInt($stateParams.position),
		currentSongId = $stateParams.id,
		playSongAtEnter = $stateParams.play
		vm.song = "";
		vm.totalDuration = 0
		var currentTiemSong = {
			h : 0,
			m : 0,
			s : 0
		}

		vm.isFavorite = false
		$rootScope.isShuffle = false


		/*favoriteSongs.getFavoritSongs().then(function(greeting) {
		  alert('Success: ' + greeting);
		}, function(reason) {
		  alert('Failed: ' + reason);
		}, function(update) {
		  alert('Got notification: ' + update);
		})
		//

		//ocultar el reproductor mini
		/*$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
	        $rootScope.hideMiniControls = true
	    });

	    $scope.$on("$ionicView.leave",function(scopes,states){
	    	$rootScope.hideMiniControls = false
	    })*/

		//@$stateParams.id identificador de cancion
		//@$stateParams.position posición del arreglo

		vm.getCurrentSong = function(id,position){
			//si el id y la posición no están vacíos
			$rootScope.hideMiniControls = false
			vm.durationensecs = 0
			if(undefined != id && undefined != position){

				$localForage.getItem('songList').then(function(songs) {
					//se parseo el Id porque sino, no encuentra la canción,
					//por el tipo de dato
					//limpiar el intervalo de tiempo
					//console.log(songs)
					clearInterval(duration)
					clearIntervals()
					vm.song = _.find(songs, { 'Id': id });
					//console.log('escribe!!! => '+id+' > '+position)
					vm.durationensecs = parseInt(vm.song.Duration) / 1000           
		        	vm.totalDuration = secs2time(parseInt(vm.song.Duration)/1000);
		        	vm.song.Duration = secs2time(parseInt(vm.song.Duration)/1000);
		        	$rootScope.songTitle = vm.song.Title
		        	$rootScope.songAuthor = vm.song.Author
		        	$rootScope.songCover = vm.song.Cover
		        	$rootScope.songId = id
		        	//console.log(id)

		        	//verificar que sea favorita
		        	favoriteSongs.isFavorite(id).then(function(is){
		        		//console.log('la cancion es favorita? => '+is)
		        		if(is == 'true'){
			    			vm.isFavorite = true
		        		}else{
		        			vm.isFavorite = false
		        		}
		        	})

		        	//widget
			        MusicControls.destroy()

			        MusicControls.create({
					    track: vm.song.Title,				//Requierd 
						artist: vm.song.Author,			//Required 
					    cover: vm.song.Cover,	//Required 
						album: vm.song.Album,				//Optional, Only visible on Android 
					    isPlaying: true,				//Required
						ticker : "Escuchando : "+vm.song.Title
					}, onSuccess, onError);

			        if($rootScope.isPlaying){
						vm.stopSong(); //detener la canción actual
					}
			        //comienza para reproducción
					$rootScope.media = $cordovaMedia.newMedia(vm.song.Path);
					
					$rootScope.playSong()
					
					//almacenar la posición actual de la canción
					$rootScope.songPosition = position
					$rootScope.isPlaying = true;

					document.getElementById('circle').style['stroke-dashoffset'] = 200
					//actualizar la barra de tiempo
					var time = vm.durationensecs; /* how long the timer runs for */
					var initialOffset = '200';
					var i = 1
					$rootScope.interval = setInterval(function() {
					document.getElementById('circle').style['stroke-dashoffset'] = initialOffset-(i*(initialOffset/time))
					    if (i == time) {
					    	clearIntervals()
					    }
					    if(!$rootScope.pauseInterval){
					    	i++;  
					    }
					}, 1000);

					//duración de canción
					duration = setInterval(function(){
						//vm.song.Duration => {h,i,s}
						$rootScope.media.currentTime().then(
							function(data){
								//console.log('tiempo => '+data.status.value)
								var tiempoActual = secs2time(parseInt(data.status.value))
								var sec = 0;
								var mins = 0;
								var hrs = 0;
								if(tiempoActual.h <= 9){
									hrs = '0'+tiempoActual.h
								}else{
									hrs = tiempoActual.h
								}
								if(tiempoActual.m <= 9){
									mins = '0'+tiempoActual.m
								}else{
									mins = tiempoActual.m
								}
								if(tiempoActual.s <= 9){
									sec = '0'+tiempoActual.s
								}else{
									sec = tiempoActual.s
								}

								//actualizar el tiempo de la canción
								vm.song.Duration.h = hrs
								vm.song.Duration.m = mins
								vm.song.Duration.s = sec

								//verificar cuado acabe una canción y cambiar a la siguiente
								
								if(parseInt(hrs) == vm.totalDuration.h 
									&& parseInt(mins) == vm.totalDuration.m 
									&& parseInt(sec) == (vm.totalDuration.s-2)
								){
									//console.log(hrs,mins,sec,vm.totalDuration.h,vm.totalDuration.m,vm.totalDuration.s-2)
									$rootScope.nextSong($rootScope.songPosition);

								}
							},
							function(error){
								console.log('error => '+error)
							}
						);
						
					},1000)
		        });

			}
		}

		function clearIntervals(){
			clearInterval($rootScope.interval);
		}

		function onSuccess(success){
			console.log('Bien! => '+success)

			function events(action) {
				switch(action){
					case 'music-controls-next':
						//Do something 
						clearIntervals()
						$rootScope.nextSong($rootScope.songPosition);
					break;
					case 'music-controls-previous':
						//Do something 
						clearIntervals()
						$rootScope.prevSong($rootScope.songPosition);
					break;
					case 'music-controls-pause':
						//Do something
						if($rootScope.isPlaying){
							$rootScope.pauseSong()
							MusicControls.updateIsPlaying(false);
						}else{
							$rootScope.playSong()
							MusicControls.updateIsPlaying(true);
						}
					break;
					case 'music-controls-play':
						//Do something 
						$rootScope.playSong()
						MusicControls.updateIsPlaying(true);
					break;
			 
					//Headset events 
					case 'music-controls-headset-unplugged':
						//Do something 
						break;
					case 'music-controls-headset-plugged':
						//Do something 
						break;
					case 'music-controls-headset-button':
						//Do something 
						break;
					default:
						break;
				}
			}

			//Register callback 
			MusicControls.subscribe(events);
			 
			//Start listening for events 
			MusicControls.listen();
		}

		function onError(error){
			console.log('error => '+error)
		}

		$rootScope.playSong = function(){
			$rootScope.isPlaying = true
			$rootScope.pauseInterval = false
			$rootScope.media.play()
		}
		$rootScope.pauseSong = function(){
			$rootScope.isPlaying = false
			$rootScope.pauseInterval = true
			$rootScope.media.pause()
		}
		vm.stopSong = function(){
			$rootScope.media.stop()
		}
		$rootScope.nextSong = function(position){
			position = (undefined != position) ? position : 0;
			
			//si está activado el shuffle
			if(!$rootScope.isShuffle){
				$localForage.getItem('songList').then(function(songs) {
					var posicion = songs[position+1]
					//posicion devuelve un objeto de cancion
					var Id = (undefined != posicion) ? posicion.Id : songs[0].Id ;
					if(undefined != posicion){
					   vm.getCurrentSong(Id,parseInt(position)+1)	
					}else{
						//mostrar la primera canción de la lista
					    vm.getCurrentSong(Id,0)
					}
				});
			}else{
				$localForage.getItem('songList').then(function(songs){
		    		var length = songs.length,
		    		newposition = _.random(length),
		    		playthis = songs[newposition]
		    		
		    		vm.getCurrentSong(playthis.Id,newposition)
		    	})
			}
		}
		$rootScope.prevSong = function(position){
			//con la posición del arreglo, buscar en el arreglo de canciones
			//su Id para reproducirla
			if(!$rootScope.isShuffle){
				position = (undefined != position) ? position : 0;
				$localForage.getItem('songList').then(function(songs) {
					var posicion = songs[parseInt(position)-1]
					var Id = (undefined != posicion) ? posicion.Id : songs[0].Id ;
					if(undefined != posicion){  
					   vm.getCurrentSong(Id,parseInt(position)-1)	
					}else{
						//mostrar la primera canción de la lista
					   vm.getCurrentSong(Id,0)
					}
				});
			}else{
				$localForage.getItem('songList').then(function(songs){
		    		var length = songs.length,
		    		newposition = _.random(length),
		    		playthis = songs[newposition]
		    		
		    		vm.getCurrentSong(playthis.Id,newposition)
		    	})
			}
		}

		function secs2time(secs){
	        var hours = Math.floor(secs / (60 * 60));

	        var divisor_for_minutes = secs % (60 * 60);
	        var minutes = Math.floor(divisor_for_minutes / 60);

	        var divisor_for_seconds = divisor_for_minutes % 60;
	        var seconds = Math.ceil(divisor_for_seconds);

	        var obj = {
	            "h": hours,
	            "m": minutes,
	            "s": seconds
	        };
	        return obj;
	    }

	    //other controls
	    $rootScope.shuffle = function(){
	    	//reproducir canciones aleatorias (sencillo)
	    	//obtener la longitud de las canciones
	    	if($rootScope.isShuffle){
	    		$rootScope.isShuffle = false
	    	}else{
		    	$rootScope.isShuffle = true
	    	}
	    	
	    }

	    $rootScope.addtoFavorites = function(id){
	    	//añadir a favoritos
	    	favoriteSongs.isFavorite(id).then(function(is){
        		//console.log('la cancion es favorita? => '+is,id)
        		if(is == 'true'){
        			//console.log('si es favorita')
        			favoriteSongs.deleteSong(id)
	    			vm.isFavorite = false
        		}else{
        			//console.log('no es favorita')
        			favoriteSongs.addtoFavorite(id)
	    			vm.isFavorite = true
        		}
        	})
	    }

	    $rootScope.$on('playSong', function(event, args) {
	    	vm.getCurrentSong(args.id,args.position)
	    });

	    
		//vm.getCurrentSong(currentSongId,currentSongPosition)
	    

		//obtener la información de la canción en curso
	}
})();