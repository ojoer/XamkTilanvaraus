/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('AdminMuokkaaCtrl', function ($scope, $http, $window, $route) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


// var console = {};
// console.log = function(){}



var data = {
  id: localStorage.getItem("muokkaaId")
};

$http({
  method: "post",
  url: "https://localhost:8000/haeAdminVarauksetMuokkaukseen",
  data: data
})
  .then(function (response) { // Onnistunut http-kutsu (success)
    $scope.varaukset = response.data;
    console.log($scope.varaukset)
    $('#calendar').fullCalendar( 'addEventSource', response.data[0].varaukset);
    $('#calendar').fullCalendar( 'refetchEvents' )
    
    
  })
  .catch(function (response) { // error

    // $scope.virheteksti = response.data.virhe;
    $scope.otsikko = "VIRHE";

    $("#virheIkkuna").modal("show");

  });

    $scope.VahvistaMuokkaukset = function () {

      var pituus = $('#calendar').fullCalendar( 'clientEvents', function(event){
        return event.aloitus, event.lopetus 
      }).length;

      var asd = [];
        for(var i = 0; i<pituus;i++){
          asd.push({
              start: $('#calendar').fullCalendar( 'clientEvents', function(event){     return event.aloitus, event.lopetus   })[i].start,
              end: $('#calendar').fullCalendar( 'clientEvents', function(event){       return event.aloitus, event.lopetus    })[i].end,
              otsikko: $('#calendar').fullCalendar( 'clientEvents', function(event){   return event.aloitus, event.lopetus    })[i].title
            })
        }
    
    var varausData = {
      varaustiedot : $scope.varaukset,
      aikatiedot : asd
    }
    console.log(varausData);

    $http({
      method: "post",
      url: "https://localhost:8000/adminMuokkaaVarausta",
      data: varausData
    })
      .then(function (response) { // Onnistunut http-kutsu (success)
        // $scope.varaukset = response.data;
        // console.log($scope.varaukset)
        
        
      })
      .catch(function (response) { // error
    
        // $scope.virheteksti = response.data.virhe;
        // $scope.otsikko = "VIRHE";
    
        // $("#virheIkkuna").modal("show");
    
      });

    };

  });
