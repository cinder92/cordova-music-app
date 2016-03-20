(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('nowPlayingCtrl', nowPlayingCtrl);

	nowPlayingCtrl.$inject = ['$rootScope','$localForage','$stateParams','$cordovaMedia'];

	function nowPlayingCtrl($rootScope,$localForage,$stateParams,$cordovaMedia) {
		//content
		var vm = this,
		duration = 0,
		currentSongPosition = parseInt($stateParams.position),
		currentSongId = $stateParams.id
		
		vm.song = "";
		vm.totalDuration = 0
		var currentTiemSong = {
			h : 0,
			m : 0,
			s : 0
		}
		//@$stateParams.id identificador de cancion
		//@$stateParams.position posición del arreglo

		vm.getCurrentSong = function(id,position){
			//si el id y la posición no están vacíos
			vm.durationensecs = 0
			if(undefined != id && undefined != position){

				$localForage.getItem('songList').then(function(songs) {
					//se parseo el Id porque sino, no encuentra la canción,
					//por el tipo de dato
					//limpiar el intervalo de tiempo
					clearInterval(duration)
					clearIntervals()
					vm.song = _.find(songs, { 'Id': parseInt(id) });
					vm.durationensecs = parseInt(vm.song.Duration) / 1000           
		        	vm.totalDuration = secs2time(parseInt(vm.song.Duration)/1000);
		        	vm.song.Duration = secs2time(parseInt(vm.song.Duration)/1000);
		        	
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
					
					vm.playSong()
					
					//almacenar la posición actual de la canción
					$rootScope.songPosition = position
					$rootScope.isPlaying = true;


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
									vm.nextSong($rootScope.songPosition);

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
			document.getElementById('circle').style['stroke-dashoffset'] = 200
		}

		function onSuccess(success){
			console.log('Bien! => '+success)

			function events(action) {
				switch(action){
					case 'music-controls-next':
						//Do something 
						clearIntervals()
						vm.nextSong($rootScope.songPosition);
					break;
					case 'music-controls-previous':
						//Do something 
						clearIntervals()
						vm.prevSong($rootScope.songPosition);
					break;
					case 'music-controls-pause':
						//Do something
						if($rootScope.isPlaying){
							vm.pauseSong()
							MusicControls.updateIsPlaying(false);
						}else{
							vm.playSong()
							MusicControls.updateIsPlaying(true);
						}
					break;
					case 'music-controls-play':
						//Do something 
						vm.playSong()
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

		vm.playSong = function(){
			$rootScope.isPlaying = true
			$rootScope.pauseInterval = false
			$rootScope.media.play()
		}
		vm.pauseSong = function(){
			$rootScope.isPlaying = false
			$rootScope.pauseInterval = true
			$rootScope.media.pause()
		}
		vm.stopSong = function(){
			$rootScope.media.stop()
		}
		vm.nextSong = function(position){

			$localForage.getItem('songList').then(function(songs) {
				var posicion = songs[position+1]
				//posicion devuelve un objeto de cancion
				
				if(undefined != posicion){
				   var Id = posicion.Id
				   vm.getCurrentSong(Id,parseInt(position)+1)	
				}
			});
		}
		vm.prevSong = function(position){
			//con la posición del arreglo, buscar en el arreglo de canciones
			//su Id para reproducirla
			$localForage.getItem('songList').then(function(songs) {
				var posicion = songs[parseInt(position)-1]
				if(undefined != posicion){
				   var Id = posicion.Id
				   vm.getCurrentSong(Id,parseInt(position)-1)	
				}
			});
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

	    //reproducir cancion actual
		vm.getCurrentSong(currentSongId,currentSongPosition)

		//obtener la información de la canción en curso
	}
})();