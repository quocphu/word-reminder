/**
 * New book controller
 * Created on: Sat Aug 20 2016
 * Author: Quoc Phu <quocphu.02@gmail.com>
 */

angular.module('wordReminder.controllers').controller('bookNewController',
  function($scope, $window, $mdDialog, $state){
    $scope.title = 'title';
    $scope.description = 'des';


    $scope.onSave = function(event){
      event.preventDefault();
      console.log('insert book event');
      console.log($window.DbProvider);
      $window.DbProvider.bookInsert($scope.title, $scope.description, '', function(err, bookId){
        if(err) {
          return showFail();
        }

        showSuccess({id: bookId, title: $scope.title});
      });
    }

    
    function showSuccess (book) {
      var confirm = $mdDialog.confirm()
          .title('Create book success')
          .textContent('Do you want create new lesson for this book now?')
          .ariaLabel('Lucky day')
          .targetEvent(null)
          .ok('Create now')
          .cancel('Later');

      $mdDialog.show(confirm).then(function () {
        console.log('Create now');
       
        $state.go('new-lesson', book);
      }, function () {
        console.log('Later');
      });
    };

    function showFail(){
      $mdDialog.show(
      $mdDialog.alert()
        .parent()
        .clickOutsideToClose(true)
        .title('Create new book error')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Close')
        .targetEvent()
    );
    }
    
  }
);