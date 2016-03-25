(function(){
  'use strict'

  angular.module('music-player', ['ionic','ngCordova','LocalForageModule'])

  .run(function($ionicPlatform,$rootScope) {
    $rootScope.hideMiniControls = false
    $ionicPlatform.ready(function() {

      // then override any default you want
        /*window.plugins.nativepagetransitions.globalOptions.duration = 500;
        window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
        window.plugins.nativepagetransitions.globalOptions.androiddelay = 350;
        window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
        window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
        // these are used for slide left/right only currently
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;*/
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#fff");
        }
                //StatusBar.styleDefault();
      }

    });
  })

  .config(function($stateProvider, $urlRouterProvider,$localForageProvider) {
    
    //configurando la base de datos, almacenará la información de la música,
    //así como las listas de reproducción y demás configuraciones
    $localForageProvider.config({
        driver      : localforage.WEBSQL, // if you want to force a driver
        name        : 'music-player', // name of the database and prefix for your data, it is "lf" by default
        version     : 1.0, // version of the database, you shouldn't have to use this
        storeName   : 'keyvaluepairs' // name of the table
    });


    $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

    .state('app.songlist', {
      url: '/songlist',
      views: {
        'menuContent': {
          templateUrl: 'templates/songList.html',
          controller: 'songListCtrl as songList'
        }
      }
    })

    .state('app.favourites', {
      url: '/favourites',
      views: {
        'menuContent': {
          templateUrl: 'templates/favourites.html',
          controller: 'favouritesCtrl as favourite'
        }
      }
    })

    /*.state('app.nowplaying', {
      url: '/nowplaying/:id/:position/:play',
      views: {
        'menuContent': {
          templateUrl: 'templates/nowPlaying.html',
          controller: 'nowPlayingCtrl as playing'
        }
      }
    })*/


    /*.state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })

    .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      
    .state('app.single', {
      url: '/playlists/:playlistId',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    });*/
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/songlist');
  });

})();