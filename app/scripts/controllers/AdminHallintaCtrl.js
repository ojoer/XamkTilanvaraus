/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('AdminHallintaCtrl', function ($scope, $http, $window) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    
// $scope.piilotaTiedot = true;
// $scope.vahvistusPuuttuu = true;

// $scope.vahvista = function (){
//   if($scope.vahvistusPuuttuu == false){
//     $scope.vahvistusPuuttuu = true;
//   }
//   else if($scope.vahvistusPuuttuu == true){
//     $scope.vahvistusPuuttuu = false;
//   }
// };

// var console = {};
// console.log = function(){};

$http({
  method: "get",
  url: "http://localhost:8000/haeAdminVaraukset"
})
  .then(function (response) { // Onnistunut http-kutsu (success)
    console.log(response.data);
    $scope.varaukset = response.data;
    $scope.asd = $scope.varaukset[0].varaukset;
    console.log($scope.varaukset[0].varaukset); 
    

  })
  .catch(function (response) { // error

    $scope.virheteksti = response.data.virhe;
    $scope.otsikko = "VIRHE";

    $("#virheIkkuna").modal("show");

  });

    $scope.poistaKokoVaraus = function () {

      console.log(this.varaus)

      if(window.confirm("Poista varaus?")){
        
        $http({
          method: "POST",
          url: "http://localhost:8000/poistaKokoVaraus",
          data: this.varaus
        })
          .then(function (response) { // Onnistunut http-kutsu (success)
  
            console.log(response.data);
            
  
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
          url: "http://localhost:8000/poistaYksittainenVaraus",
          data: data
        })
          .then(function (response) { // Onnistunut http-kutsu (success)
  
            console.log(response.data);
            
  
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
    //     url: "http://localhost:8000/poistaAsiakkaanVaraukset",
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