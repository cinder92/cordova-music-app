(function() {
	'use strict';

	angular
	  .module('music-player')
	  .service('skullMp3', skullMp3);

	skullMp3.$inject = ['$http','$q','$ionicLoading'];

	function skullMp3($http,$q,$ionicLoading) {
		//content
		var vm = this

		var host = 'mp3skull.cr';
		var query = '/search_db.php?q={query}&fckh={token}';

		 vm.getHttpsContent = function(url) {
		    var defer = $q.defer();
		    
		    $http({
		  		method : 'GET',
		  		url : url
			 }).then(function successCallback(response) {
			 		defer.resolve(response)
			 },function errorCallback(response){
			 		defer.reject(response)
			 });

		    return defer.promise;
		}

		vm.getLinks = function(song, token) {
		    var url = 'https://' + host + query.replace('{query}', song).replace('{token}', token),
		        defer = $q.defer();

		    vm.getHttpsContent(url).then(function(content){
		    	//solo 15
		    	//var link = jQuery(content.data).find('.download_button a').first().attr('href');
		    	var links = []
		    	for(var i = 1; i <= 15; i++){
				   var el = jQuery(content.data).find('.show'+i)
				   var title = el.find('.mp3_title').text()
				   var link = el.find('.download_button a').attr('href');
				  // console.log(title,link)
					
				   links.push({
				   	  title : title,
				   	  link : link
				   })
				}
		    	defer.resolve(links); 
		    })  

		    return defer.promise;
		}

		vm.getToken = function() {
		    var defer = $q.defer();
		    vm.getHttpsContent('https://' + host).then(function(content){
		    	var token = jQuery(content.data).find('[name=fckh]').first().val();
		        defer.resolve(token);
		    })
		    return defer.promise;
		}

		vm.search = function(song,cb){
			$ionicLoading.show({
		      template: '<ion-spinner></ion-spinner><br><p>Please wait ...</p>'
		    });
			vm.getToken().then(function(token){
				vm.getLinks(song, token).then(function(link){
					cb(link)
					$ionicLoading.hide()
				})
			})

		}

	}
})();