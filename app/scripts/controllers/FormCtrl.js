'use strict';

/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */
 
angular.module('xamkTilanvarausApp')
  .controller('FormCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.myFunc = function() {
      console.log($scope.varaus);

      $http({
        method : "POST",
        url : "http://localhost:8000/tallenna",
        data: $scope.varaus
      })
      .then(function (response) { // Onnistunut http-kutsu (success)
          
        console.log(response);
                  
      }, function(response) { // Epäonnistunut http-kutsu (error)
          
          console.log("Ei yhteyttä");
          
      });
    };
  });
