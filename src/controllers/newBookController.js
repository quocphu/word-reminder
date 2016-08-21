/**
 * New book controller
 * Created on: Sat Aug 20 2016
 * Author: Quoc Phu <quocphu.02@gmail.com>
 */

angular.module('wordReminder.controllers').controller('newBookController',
  function($scope, $window){
    $scope.title = 'dddd';
    $scope.descrtiption = '';

    function createImage(canvas){
      //var canvas = document.getElementById("cvCover");
      var ctx = canvas.getContext("2d");
      ctx.width = ctx.width;
      ctx.fillStyle = "#FF00FF";
      ctx.fillRect(0,0,150,150);

      ctx.font = "30px Comic Sans MS";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText("New Book", canvas.width/2, canvas.height/2);
      console.log('created');
      
    }

    $scope.createCover = function(){
      // var canvas = $('#cvCover');
      var canvas = document.getElementById('cvCover');
      createImage(canvas);
    }
    $scope.createCover();

    $scope.onTitleChange = function(){
      $scope.createCover(this.title)
    }


    $scope.onSave = function(event){
      event.preventDefault();
      console.log('insert book event');
      console.log($window.DbProvider);
      $window.DbProvider.bookInsert($scope.title, $scope.descrtiption, '', function(err, book){
        if(err) {
          return alert('insert book err');
        }

        console.log(book);

      })
    }
  }
);