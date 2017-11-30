/**
 * @ngdoc function
 * @name xamkTilanvarausApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the xamkTilanvarausApp
 */
/* eslint-disable */

angular.module('xamkTilanvarausApp')
  .controller('hylattyCtrl', function ($scope, $http, $window, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var data = {
      id :localStorage.getItem('id')
    }

    $http({
      method : "POST",
      url : "https://localhost:8000/vahvistaMaksettuVaraus",
      data : data
      
    })
    .then(function (response) { // Onnistunut http-kutsu (success)
        
      console.log(response);
      if(response.data){
        localStorage.clear();
        $timeout(function (){
            $window.location.href = 'http://localhost:9000/#!/'
          }, 5000);
       
      }
      
                
    })
    .catch(function (response) { // error
      console.log(response.data);
      
        $scope.virheteksti = response.data;
        

        $("#virheIkkuna").modal("show");

    });

    // $timeout(function (){
    //   $window.location.href = 'http://localhost:9000/#!/'
    // }, 5000);

    
   
    
  });

