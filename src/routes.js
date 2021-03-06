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
      url: '/book-detail',
      templateUrl: 'views/book-detail.html'
    })
    .state('lesson-detail',{
      url: '/lesson-detail',
      templateUrl: 'views/lesson-detail.html'
    })
  ;
});