/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xamkTilanvarausApp
 */

/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('MainCtrl', function ($scope, $http, $window) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.valittu = "Mikpolisali";

    $scope.$watch("valittu", function() {

      console.log($scope.hinta)
      
      data = {
        tilaId: $scope.valittu
      }

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

          $http({
            method : "post",
            url : "http://localhost:8000/haeValiaikaistenVarausTiedot",
            data: data
          })
              .then(function (response) { // Onnistunut http-kutsu (success)
                console.log(response.data);

                $('#calendar').fullCalendar( 'addEventSource',response.data)
    
              })
              .catch(function (response) { // error
        
                // $scope.virheteksti = response.data.virhe;
        
                // $("#virheIkkuna").modal("show");
        
              });

      
    });


    $scope.testi = function() {

            var genId;
            function makeid() {
              var text = "";
              var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            
              for (var i = 0; i < 25; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            
                return text;
            }
            
            genId = makeid();
      
            var pituus = $('#calendar').fullCalendar( 'clientEvents', function(event){
              return event.isNew == true;
            }).length;
      console.log($scope.valittu);
          var varaus = [];
          var tilaId = $scope.valittu;
            for(var i = 0; i<pituus;i++){
                varaus.push({
                  id :  genId,
                  tilaId : tilaId,
                  start: $('#calendar').fullCalendar( 'clientEvents', function(event){    return event.isNew == true;    })[i].start,
                  end: $('#calendar').fullCalendar( 'clientEvents', function(event){      return event.isNew == true;    })[i].end,
                  otsikko: $('#calendar').fullCalendar( 'clientEvents', function(event){  return event.isNew == true;    })[i].title,
                  valiaikainen: true
                })
            }
      
            localStorage.setItem("id", genId);
      
            
            // 
                $http({
                  method : "POST",
                  url : "http://localhost:8000/valiaikainenVaraus",
                  data : varaus
                  
                })
                .then(function (response) { // Onnistunut http-kutsu (success)
                    
                  console.log(response);
                  $window.location.href = 'http://localhost:9000/#!/form'
                            
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
