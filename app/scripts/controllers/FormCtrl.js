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
<<<<<<< HEAD
      .then(function (response) { // Onnistunut http-kutsu (success)

        $scope.yhteenveto = response.data;


        console.log($scope.yhteenveto)

      })
      .catch(function (response) { // error

=======
    .then(function (response) { // Onnistunut http-kutsu (success)
      
      $scope.yhteenveto = response.data;
                
    })
    .catch(function (response) { // error
      
>>>>>>> 622aeba6a6cc30583a3d8b16981ed3e1a711c955
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
<<<<<<< HEAD
        method: "POST",
        url: "http://localhost:8000/tallennaVaraus",
        data: $scope.varaus
=======
        method : "POST",
        url : "http://localhost:8000/tallennaVaraus",
        data: data
      })
      .then(function (response) { // Onnistunut http-kutsu (success)
          
        console.log(response.data);
                  
>>>>>>> 622aeba6a6cc30583a3d8b16981ed3e1a711c955
      })
        .then(function (response) { // Onnistunut http-kutsu (success)

          console.log(response.data);

        })
        .catch(function (response) { // error

          $scope.virheteksti = response.data.virhe;

          $("#virheIkkuna").modal("show");

<<<<<<< HEAD
        });

      $http({
        method: "POST",
        url: "http://localhost:8000/tallennaKalenteriin",
        data: $scope.yhteenveto
      })
        .then(function (response) { // Onnistunut http-kutsu (success)

          console.log(response.data);

        })
        .catch(function (response) { // error

          // $scope.virheteksti = response.data.virhe;
          // console.log(response.data)

          // $("#virheIkkuna").modal("show");

        });
=======
      });
>>>>>>> 622aeba6a6cc30583a3d8b16981ed3e1a711c955
    };
  });
