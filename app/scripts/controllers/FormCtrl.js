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

    $http({
      method: "POST",
      url: "http://localhost:8000/haeVarausTiedotLomakkeelle",
      data: { id: localStorage.getItem("id") }
    })
      .then(function (response) { // Onnistunut http-kutsu (success)

        $scope.yhteenveto = response.data;

      })
      .catch(function (response) { // error

        $scope.virheteksti = response.data.virhe;

        $("#virheIkkuna").modal("show");

      });

    $scope.myFunc = function () {

      var data = {
        lomake: $scope.varaus,
        kalenteri: $scope.yhteenveto
      }

      console.log($scope.yhteenveto)

      $http({
        method: "POST",
        url: "http://localhost:8000/tallennaVaraus",
        data: data
      })
        .then(function (response) { // Onnistunut http-kutsu (success)

          console.log(response.data);

        })
        .then(function (response) { // Onnistunut http-kutsu (success)

          console.log(response.data);

        })
        .catch(function (response) { // error

          $scope.virheteksti = response.data.virhe;

          $("#virheIkkuna").modal("show");

        });
    };
  });
