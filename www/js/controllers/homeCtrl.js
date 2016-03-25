(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('homeCtrl', homeCtrl);

	homeCtrl.$inject = [
		'$ionicSideMenuDelegate'
	];

	function homeCtrl($ionicSideMenuDelegate) {
		
		setTimeout(function(){
		    $ionicSideMenuDelegate.toggleLeft();
		},600)


		  var e = 'slide_effect,scale_effect,fade_effect,slide_up,wave,drop_in';
		  $scope.slide = function(se) {
		    $('.item').removeClass().addClass('item')
		    $('.item').addClass(se);
		    $('button').removeClass('active')
		    $('.b_' + se).addClass('active');
		    
		    $ionicSideMenuDelegate.toggleLeft();
		    if($ionicSideMenuDelegate.isOpen() == true){
		      setTimeout(function(){
		        $ionicSideMenuDelegate.toggleLeft();
		      },700)
		    }
		  };

	}

})();