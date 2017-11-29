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
      .when('/kiitos', {
        templateUrl: 'views/kiitos.html',
        controller: 'KiitosCtrl',
        controllerAs: 'about'
      })
      .when('/form', {
        templateUrl: 'views/form.html',
        controller: 'FormCtrl',
        controllerAs: 'form'
      })
      .when('/peruuta', {
        templateUrl: 'views/peruuta.html',
        controller: 'PeruutaCtrl',
        controllerAs: 'peruuta'
      })
      .when('/kirjaudu', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .when('/adminEtusivu', {
        templateUrl: 'views/adminEtusivu.html',
        controller: 'AdminHallintaCtrl',
        controllerAs: 'adminHallinta'
      })
      .when('/adminMuokkaa', {
        templateUrl: 'views/adminMuokkaa.html',
        controller: 'AdminMuokkaaCtrl',
        controllerAs: 'adminMuokkaa'
      })
      .when('/adminLukitse', {
        templateUrl: 'views/adminLukitse.html',
        controller: 'adminLukitseCtrl',
        controllerAs: 'adminLukitse'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
