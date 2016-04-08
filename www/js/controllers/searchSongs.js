(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('searchSongs', searchSongs);

	searchSongs.$inject = ['skullMp3','$rootScope','$ionicLoading'];

	function searchSongs(skullMp3,$rootScope,$ionicLoading) {
		//content
		var vm = this
		vm.query = ''
		vm.list = []

		vm.searchSong = function(){
			skullMp3.search(vm.query,function(link){
				if(undefined == link){
					alert('There is no results!')
				}else{
					//descargar canción al teléfono
					vm.list = link
			        //console.log(link)
				}
			})
		}

		vm.view = function(link){
			window.open(link, '_blank', 'location=yes');
		}

		vm.download = function(link,name){
			$ionicLoading.show({
		      template: '<ion-spinner></ion-spinner><br><p>Downloading please wait ...</p>'
		    });
			var fileTransfer = new FileTransfer(),
			fileName = name+'.mp3'
			//guardar en la memoria local del teléfono en la carpeta Music
			fileTransfer.download(link, cordova.file.externalRootDirectory + fileName, 
	        function(entry) {
	        	$ionicLoading.hide()
	        	$rootScope.refreshSongs()
	        }, 
	        function(err) {
	            alert('Err => '+JSON.stringify(err))
	        });
		}
	}
})();