/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('AdminHallintaCtrl', function ($scope, $http, $window, $route) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    
    var console = {};
    console.log = function(){};

$http({
  method: "get",
  url: "https://localhost:8000/haeAdminVaraukset"
})
  .then(function (response) { // Onnistunut http-kutsu (success)
    $scope.varaukset = response.data;
    console.log($scope.varaukset)
    // for (i = 0; i < $scope.varaukset.length; i++) {
    //   console.log($scope.varaukset[i].varaukset);

    // };
    
    
  })
  .catch(function (response) { // error

    // $scope.virheteksti = response.data.virhe;
    $scope.otsikko = "VIRHE";

    $("#virheIkkuna").modal("show");

  });

    $scope.poistaKokoVaraus = function () {

      console.log(this.varaus)

      if(window.confirm("Poista varaus?")){
        
        $http({
          method: "POST",
          url: "https://localhost:8000/poistaKokoVaraus",
          data: this.varaus
        })
          .then(function (response) { // Onnistunut http-kutsu (success)
            
            if(response.data){
              $route.reload();
            }
            
  
          })
          .catch(function (response) { // error
  
            $scope.virheteksti = response.data.virhe;
            $scope.otsikko = "VIRHE";
  
            $("#virheIkkuna").modal("show");
  
          });
      }

      else{
        console.log("No ei sitten")
      }


      
    };

    $scope.muokkaaVarausta = function () {
      console.log(this.varaus)
      console.log(this.aika);

      if(window.confirm("Muokkaa varausta?")){
        
        var data = {
          varaustiedot : this.varaus,
          aikatiedot : this.aika
        }

        localStorage.setItem("muokkaaId", this.varaus.id);

        $window.location.href = 'https://localhost:9000/#!/adminMuokkaa'
        

      }

      else{
        console.log("No ei sitten")
      }
    };

    $scope.poistaYksittainenVaraus = function () {
      console.log(this.varaus)
      console.log(this.aika);

      if(window.confirm("Poista varaus?")){

        var data = {
          varaustiedot : this.varaus,
          aikatiedot : this.aika
        }
        
        $http({
          method: "POST",
          url: "https://localhost:8000/poistaYksittainenVaraus",
          data: data
        })
          .then(function (response) { // Onnistunut http-kutsu (success)
            console.log(response.data);
            if(response.data){
              $route.reload();
            }
            
  
          })
          .catch(function (response) { // error
  
            $scope.virheteksti = response.data.virhe;
            $scope.otsikko = "VIRHE";
  
            $("#virheIkkuna").modal("show");
  
          });
      }

      else{
        console.log("No ei sitten")
      }
    };

    $scope.lukitsePaiva = function () {
      $window.location.href = 'https://localhost:9000/#!/adminLukitse'
    }

    // $scope.lahetaPeruutus = function () {

    //   var valitut = [];
    //   for (var i = 0; i < $scope.varaukset.ajat.length; i++) {
    //       if ($scope.varaukset.ajat[i].selected) {
    //           valitut.push(i);
    //       }

    //       else{
    //         valitut.push("Ei valittu");
    //       }

          
    //   }


    //   var data = {
    //     varaukset: $scope.varaukset,
    //     poistettavat: valitut
    //   }


    //   $http({
    //     method: "POST",
    //     url: "https://localhost:8000/poistaAsiakkaanVaraukset",
    //     data: data
    //   })
    //     .then(function (response) { // Onnistunut http-kutsu (success)

    //       console.log(response.data);
    //       $scope.virheteksti = response.data;
    //       $scope.otsikko = "Vahvistus";
    //       $("#virheIkkuna").modal("show");
    //     })
    //     .catch(function (response) { // error

    //       $scope.virheteksti = response.data.virhe;

    //       $("#virheIkkuna").modal("show");

    //     });

    // };


  });
