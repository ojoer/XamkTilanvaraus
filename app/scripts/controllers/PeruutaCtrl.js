/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('PeruutaCtrl', function ($scope, $http, $window) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    
$scope.piilotaTiedot = true;
$scope.vahvistusPuuttuu = true;

$scope.vahvista = function (){
  if($scope.vahvistusPuuttuu == false){
    $scope.vahvistusPuuttuu = true;
  }
  else if($scope.vahvistusPuuttuu == true){
    $scope.vahvistusPuuttuu = false;
  }
};


    $scope.hae = function () {

      var data = {
        id: $scope.id
      }
      console.log($scope.id);

      $http({
        method: "POST",
        url: "http://localhost:8000/haeAsiakkaanAjat",
        data: data
      })
        .then(function (response) { // Onnistunut http-kutsu (success)

          console.log(response.data);
          $scope.piilotaTiedot = false;
          $scope.varaukset = response.data;
          

        })
        .catch(function (response) { // error

          $scope.virheteksti = response.data.virhe;
          $scope.otsikko = "VIRHE";

          $("#virheIkkuna").modal("show");

        });
    };

    $scope.lahetaPeruutus = function () {

      var valitut = [];
      for (var i = 0; i < $scope.varaukset.ajat.length; i++) {
          if ($scope.varaukset.ajat[i].selected) {
              valitut.push(i);
          }

          else{
            valitut.push("Ei valittu");
          }

          
      }


      var data = {
        varaukset: $scope.varaukset,
        poistettavat: valitut
      }


      $http({
        method: "POST",
        url: "http://localhost:8000/poistaAsiakkaanVaraukset",
        data: data
      })
        .then(function (response) { // Onnistunut http-kutsu (success)

          console.log(response.data);
          $scope.virheteksti = response.data;
          $scope.otsikko = "Vahvistus";
          $("#virheIkkuna").modal("show");
        })
        .catch(function (response) { // error

          $scope.virheteksti = response.data.virhe;

          $("#virheIkkuna").modal("show");

        });

    };


  });
