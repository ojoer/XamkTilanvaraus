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

    $scope.roles = [
      'guest', 
      'user', 
      'customer', 
      'admin'
    ];

    $scope.user = {
      roles: ['user']
    };

    $http({
      method: "POST",
      url: "http://localhost:8000/haeVarausTiedotLomakkeelle",
      data: { id: localStorage.getItem("id") }
    })
      .then(function (response) { // Onnistunut http-kutsu (success)

        if(response.data.length == 0){
          $scope.eiTiloja = true;
          $scope.virheteksti = "Tiloja ei ole valittu. Ole hyvä ja siiry etusivulle aloittaaksesi varauksen teon.";
          
                  $("#virheIkkuna").modal("show");
        }

        else{
          $scope.yhteenveto = response.data;
        }

      })
      .catch(function (response) { // error

        $scope.virheteksti = response.data.virhe;

        $("#virheIkkuna").modal("show");

      });

    $scope.myFunc = function () {

      console.log($scope.varaus);

      var data = {
        lomake: $scope.varaus,
        kalenteri: $scope.yhteenveto
      }

      $http({
        method: "POST",
        url: "http://localhost:8000/tallennaVaraus",
        data: data
      })
        .then(function (response) { // Onnistunut http-kutsu (success)

          console.log("Kiitos varauksestasi");
          localStorage.clear();

        })
        .catch(function (response) { // error

          $scope.virheteksti = response.data.virhe;

          $("#virheIkkuna").modal("show");

        });
    };
  });
