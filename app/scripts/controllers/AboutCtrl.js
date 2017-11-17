/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('AboutCtrl', function ($scope, $http, $window) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


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

    var varaus = [];
      for(var i = 0; i<pituus;i++){
          varaus.push({
            id :  genId,
            tilaId : $('#calendar').fullCalendar( 'clientEvents', function(event){  return event.isNew == true;    })[i]._id,
            start: $('#calendar').fullCalendar( 'clientEvents', function(event){    return event.isNew == true;    })[i].start,
            end: $('#calendar').fullCalendar( 'clientEvents', function(event){      return event.isNew == true;    })[i].end,
            otsikko: $('#calendar').fullCalendar( 'clientEvents', function(event){  return event.isNew == true;    })[i].title
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
              
            
                      
          })
          .catch(function (response) { // error
            
              // $scope.virheteksti = response.data.virhe;
              console.log(response.data)
    
              // $("#virheIkkuna").modal("show");
    
          });
          $window.location.href = 'http://localhost:9000/#!/form'
    };
    
  });

