/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('FormCtrl', function ($scope, $http, $window,$sce) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.verkkomaksu = false;

    $scope.renderHtml = function(html_code)
    {
        return $sce.trustAsHtml(html_code);
    };

    $http({
      method: "POST",
      url: "https://localhost:8000/haeVarausTiedotLomakkeelle",
      data: { id: localStorage.getItem("id") }
    })
      .then(function (response) { // Onnistunut http-kutsu (success)
        console.log(response.data)
        if(response.data.length == 0){
          $scope.eiTiloja = true;
          $scope.virheteksti = "Tiloja ei ole valittu. Ole hyvä ja siiry etusivulle aloittaaksesi varauksen teon.";
          
          $("#virheIkkuna").modal("show");
        }

        else{

          $scope.yhteenveto =response.data;

        }

      })
      .catch(function (response) { // error

        // $scope.virheteksti = response.data.virhe;

        $("#virheIkkuna").modal("show");

      });
    // $scope.$watch("varaus.verkkomaksu", function() {

    //   if($scope.varaus.verkkomaksu == true){

    //     // $scope.asd();
    //   }
    //   else{

    //   }
    // });


    $scope.asd = function () {

  var tiedot = $scope.yhteenveto;
  var hinta = 0;

  for(var i = 0; i<tiedot.length;i++){

    if (typeof tiedot[i].lisaPal == "undefined") {
      hinta += tiedot[i].hinta; 
      continue
    }

    if (typeof tiedot[i].lisaPal.it == "undefined") {
      console.log("Ei löydy");
    }
    else if(tiedot[i].lisaPal.it){
      hinta += 50
    }
    
    if (typeof tiedot[i].lisaPal.ruoka == "undefined") {
      console.log("Ei löydy");
    }

    else if(tiedot[i].lisaPal.ruoka){
      hinta += 100
    }

    if (typeof tiedot[i].lisaPal.vahtimestari == "undefined") {
      console.log("Ei löydy");
    }

    else if(tiedot[i].lisaPal.vahtimestari){
      hinta += 70
    }

    hinta += tiedot[i].hinta;
  }

  var data = {
    hinta : hinta
  };

      $http({
        method: "POST",
        url: "https://localhost:8000/verkkomaksu",
        data: data
      })
      .then(function (response) { // Onnistunut http-kutsu (success)
        
                  console.log(response)
                  $scope.verkkomaksuPlugin = response.data;
        
                })
    };

    $scope.myFunc = function () {

      var tiedot = $scope.yhteenveto;
      var hinta = 0;
    
      for(var i = 0; i<tiedot.length;i++){
    
        if (typeof tiedot[i].lisaPal == "undefined") {
          hinta += tiedot[i].hinta; 
          continue
        }
    
        if (typeof tiedot[i].lisaPal.it == "undefined") {
          console.log("Ei löydy");
        }
        else if(tiedot[i].lisaPal.it){
          hinta += 50
        }
        
        if (typeof tiedot[i].lisaPal.ruoka == "undefined") {
          console.log("Ei löydy");
        }
    
        else if(tiedot[i].lisaPal.ruoka){
          hinta += 100
        }
    
        if (typeof tiedot[i].lisaPal.vahtimestari == "undefined") {
          console.log("Ei löydy");
        }
    
        else if(tiedot[i].lisaPal.vahtimestari){
          hinta += 70
        }
    
        hinta += tiedot[i].hinta;
      }

      console.log($scope.varaus.vahvistettu)
      
      var data = {
        lomake: $scope.varaus,
        kalenteri: $scope.yhteenveto,
        hinta : hinta
      }


      $http({
        method: "POST",
        url: "https://localhost:8000/verkkomaksu",
        data: data
      })
        .then(function (response) { // Onnistunut http-kutsu (success)
          console.log(response.data);
          $scope.verkkomaksu = true;
          $scope.verkkomaksuPlugin = response.data;
          // console.log("Kiitos varauksestasi");
          // localStorage.clear();

        })
        .catch(function (response) { // error

          $scope.virheteksti = response.data.virhe;

          $("#virheIkkuna").modal("show");

        });
    };
  });
