/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('adminLukitseCtrl', function ($scope, $http, $window, $route) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.valittu = "Mikpolisali";
    
        $scope.$watch("valittu", function() {
          
          data = {
            tilaId: $scope.valittu
          }

          console.log(data)
    
          $scope.varaukset = {};
    
    
          $http({
            method : "post",
            url : "http://localhost:8000/haeVarausTiedot",
            data: data
          })
              .then(function (response) { // Onnistunut http-kutsu (success)
                console.log(response.data);
                $('#calendar').fullCalendar( 'removeEvents');
                $('#calendar').fullCalendar( 'addEventSource', response.data);
                $('#calendar').fullCalendar( 'refetchEvents' )
                
                
    
              })
              .catch(function (response) { // error
        
                // $scope.virheteksti = response.data.virhe;
        
                // $("#virheIkkuna").modal("show");
        
              });
    
          
        });
    
    
        $scope.testi = function() {
          
                var pituus = $('#calendar').fullCalendar( 'clientEvents', function(event){
                  return event.isNew == true;
                }).length;
          console.log($scope.valittu);
              var varaus = [];
              var tilaId = $scope.valittu;
                for(var i = 0; i<pituus;i++){
                    varaus.push({
                      tilaId : tilaId,
                      start: $('#calendar').fullCalendar( 'clientEvents', function(event){    return event.isNew == true;    })[i].start,
                      end: $('#calendar').fullCalendar( 'clientEvents', function(event){      return event.isNew == true;    })[i].end,
                      otsikko: $('#calendar').fullCalendar( 'clientEvents', function(event){  return event.isNew == true;    })[i].title
                    })
                }

                    $http({
                      method : "POST",
                      url : "http://localhost:8000/adminLukitse",
                      data : varaus
                      
                    })
                    .then(function (response) { // Onnistunut http-kutsu (success)
                        
                      console.log(response);
                      if(response.data){
                        $route.reload();
                      }
                      
                                
                    })
                    .catch(function (response) { // error
                      console.log(response.data);
                      
                        $scope.virheteksti = response.data;
                        
              
                        $("#virheIkkuna").modal("show");
              
                    });
                    
              };
    
              $scope.tyhjenna = function() {
    
                $('#calendar').fullCalendar( 'removeEvents', function(event){    return event.isNew == true;   });
    
              }
  });
