'use strict';

/**
 * @ngdoc overview
 * @name xamkTilanvarausApp
 * @description
 * # xamkTilanvarausApp
 *
 * Main module of the application.
 */
angular
  .module('xamkTilanvarausApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/form', {
        templateUrl: 'views/form.html',
        controller: 'FormController',
        controllerAs: 'form'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
