angular.module('wordReminder.controllers').controller('bookController',
  function ($scope, $state) {
    $scope.books = []
    function loadAllBook(cb) {
      window.DbProvider.getAll(window.CONS.DB_TBL_BOOK, function (err, books) {
        console.log(err); 
        console.log(books);
        $scope.books = books;
        cb(err, books);
      });
    }

    loadAllBook(function () {
      $scope.$apply();
    });

    $scope.onDelete = function (id) {
      console.log('delete book ', id);
      //TODO show loading
      window.DbProvider.bookDeleteById(id, function (err, data) {
        //TODO: hide loading
        if (err) {
          console.error(err);
        } else {
          for(var i = 0; i < $scope.books.length; i++){
            if(id == $scope.books[i].id){
              $scope.books.splice(i, 1);
              $scope.$apply();
              break;
            }
          }
          console.info('deleted book');
        }
      })
    }

    $scope.onNewBook = function () {
      $state.go('new-book');
    }
  }
);