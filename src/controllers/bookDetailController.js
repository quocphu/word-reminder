angular.module('wordReminder.controllers').controller('bookDetailController',
  function ($scope, $stateParams, $state) {
    $scope.bookId = parseInt($stateParams.id);
    $scope.lessons = [];
    $scope.books = [];
    $scope.isEdit = false;
    
    function loadData(cb) {
      //TODO: Show loading
      window.DbProvider.bookGetById($scope.bookId, function(err, book){
        if(err){
          return cb(err);
        }
        if(book){
          $scope.books = [book];
          window.DbProvider.lessonGetByBookId($scope.bookId, function(err, lessons){
            if(err){
              return cb(err);
            }

            $scope.lessons = lessons;
            console.log($scope.lessons);
            cb();
          });
        } else {
          console.log('BOOK_DOES_NOT_EXIST');
          cb('BOOK_DOES_NOT_EXIST');
        }
      });
    }

    loadData(function (err) {
      // TODO: Hide loading
      if(err) {
        console.error(err);
        //TODO: show err
      }
      $scope.$apply();
    });

    // $scope.onDelete = function (id) {
    //   console.log('delete book ', id);
    //   //TODO show loading
    //   window.DbProvider.bookDeleteById(id, function (err, data) {
    //     //TODO: hide loading
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       for(var i = 0; i < $scope.books.length; i++){
    //         if(id == $scope.books[i].id){
    //           $scope.books.splice(i, 1);
    //           console.log($scope.books);
    //           $scope.$apply();
    //           break;
    //         }
    //       }
    //       console.info('deleted book');
    //     }
    //   })
    // }

    $scope.onNewLesson = function () {
       $state.go('new-lesson', $scope.books[0]);
    }

    $scope.onLessonDetail = function(lessonId) {
      console.log('lessonId', lessonId);
      $state.go('new-lesson', {id: $scope.books[0].id, title: $scope.books[0].title, lessonId: lessonId});
      // $state.go('new-lesson', {1, '$scope.books[0].title', 2});
    }
  }
);