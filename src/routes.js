'use strict';
//Setting up route
angular.module('wordReminder').config(function( $stateProvider, $routeProvider) {
  console.log('route')
  $routeProvider.otherwise('/');

  $stateProvider
    .state('dashboard',{
      url: '/dashboard',
      templateUrl: 'views/dashboard.html'
    })
    .state('book-detail',{
      url: '/book-detail/:id',
      templateUrl: 'views/book-detail.html'
    })
    .state('lesson-detail',{
      url: '/lesson-detail',
      templateUrl: 'views/lesson-detail.html'
    })
    .state('new-book',{
      url: '/new-book',
      templateUrl: 'views/book-new.html'
    })
    .state('new-lesson',{
      url: '/new-lesson/:id/:title/:lessonId',
      templateUrl: 'views/lesson-new.html'
    })
    .state('settings',{
      url: '/settings',
      templateUrl: 'views/settings.html'
    })
  ;
});