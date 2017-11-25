/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('PeruutaCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    


    $scope.hae = function () {

      var data = {
        id: $scope.id
      }
      console.log($scope.id)

      $http({
        method: "POST",
        url: "http://localhost:8000/haeAsiakkaanAjat",
        data: data
      })
        .then(function (response) { // Onnistunut http-kutsu (success)

          console.log(response.data);
          $scope.varaukset = response.data;

        })
        .catch(function (response) { // error

          $scope.virheteksti = response.data.virhe;

          $("#virheIkkuna").modal("show");

        });
    };
  });
