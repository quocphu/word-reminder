
var modules = [
  'ngRoute',
  'ui.router',
  'wordReminder.controllers',
  'xeditable'
];

var wordReminder = window.wordReminder = angular.module('wordReminder', modules);

// wordReminder.config(function($routeProvider) {
//     $routeProvider
//     .when("/", {
//         templateUrl : "views/dashboard.html"
//     });
// });

// angular.module('wordReminder.services', []);
angular.module('wordReminder.controllers', []);
