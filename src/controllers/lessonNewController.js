'use strict';

angular.module('wordReminder.controllers').controller('lessonNewController', lessonNewController);

// '$scope, $filter, $http'
function lessonNewController($scope, $filter, $http, $stateParams, $state) {
  $scope.words = [
    // {
    //   word: "",
    //   type: "",
    //   pronunciation: "",
    //   meaning: "",
    //   example: "",
    //   audio: "",
    //   image: "",
    //   isNew: true
    // }
    // ,
    // {
    //   word: "live",
    //   type: "v",
    //   pronunciation: "liv",
    //   meaning: "Song",
    //   example: "I live in London",
    //   audio: "live.mp3",
    //   image: "live.jpg",
    //   isNew: true
    // }
  ];
  console.log($stateParams);
  $scope.originalWord = [];
  $scope.bookId = $stateParams.id;
  $scope.bookTitle = $stateParams.title;
  $scope.lessonId = parseInt($stateParams.lessonId);
  $scope.wordClasses = window.CONS.WORD_CLASS;

  $scope.title = '';
  $scope.description = '';

  $scope.filterWord = function (word) {
    return word.isDeleted !== true;
  };

  // Remove word
  $scope.deleteWord = function (word, type, idx) {
    var filtered;
    // New word does not have id field
    if(word == '') {
      for(var i = 0; i < $scope.words.length; i++) {
        if($scope.words[i].id == undefined  && $scope.words[i].idx == idx) {
          $scope.words.splice(i, 1);
          break;
        }
      }
    } else {
      filtered = $filter('filter')($scope.words, { word: word });
      if (filtered.length) {
        filtered[0].isDeleted = true;
      }
    }

  };

  // Add word
  $scope.addWord = function () {
    $scope.inserted = {
      idx: $scope.words.length + 1,
      word: '',
      type: '',
      pronunciation: '',
      meaning: '',
      example: '',
      audio: '',
      image: '',
      isNew: true
    };
    $scope.words.push($scope.inserted);
  };

  /**
   * On cancel event
   * If is new lesson -> clear all word
   * If is edit lesson -> reload from database
   */
  $scope.onCancel = function () {
    if ($scope.lessonId >= 0) {
      $scope.words = angular.copy($scope.originalWord);
      $scope.title = $scope.lesson.title;
      $scope.description = $scope.lesson.description;
    } else {
      $scope.words = [];
    }
  }

  /**
   * Save lesson
   */
  $scope.saveTable = function () {
    var results = [];
    var newList = [];
    var deletedList = [];
    var editedList = [];

    // Detemine word status (deleted, edited or new)
    for (var i = $scope.words.length; i--;) {
      var word = $scope.words[i];

      // Add to new list
      if (word.isNew) {
        delete word.isNew;
        newList.push(word)
      } else
        // Add to deleted list
        if (word.isDeleted && word.id >= 0) {
          // $scope.words.splice(i, 1);
          deletedList.push(word);
        } else
          // Add to editedList (compare with original word)
          if (word.id >= 0) {
            for (var j = 0; j < $scope.originalWord.length; j++) {
              if (word.id == $scope.originalWord[j].id) {
                if (word.word != $scope.originalWord[j].word
                  || word.type != $scope.originalWord[j].type
                  || word.pronunciation != $scope.originalWord[j].pronunciation
                  || word.meaning != $scope.originalWord[j].meaning
                  || word.example != $scope.originalWord[j].example) {
                  editedList.push(word);
                }
              }
            }
          }
    }

    var wordTable = '';
    async.series([
      // Display waiting dialog
      function (sCb) {
        sCb();
      },
      // Insert lesson
      function (sCb) {
        if ($scope.lessonId >= 0) {
          wordTable = $scope.lesson.wordTable;
          return sCb();
        }
        window.DbProvider.lessonInsert(
          $scope.bookId,
          $scope.title,
          $scope.author,
          $scope.description,
          function (err, data) {
            if (data) {
              wordTable = data.wordTable;
            }
            return sCb(err);
          });
      },
      // Insert word
      function (sCb) {
        if (newList.length > 0) {
          console.log('new list', wordTable);
          console.log(newList);
          window.DbProvider.wordInsert(wordTable, newList, function (err, data) {
            console.log('insert lesson finish: ', wordTable);
            return sCb(err);
          });
        } else {
          return sCb();
        }
      },
      // Delete words
      function (sCb) {
        console.log('deletedList');
        console.log(deletedList);
        if (deletedList.length > 0) {
          window.DbProvider.wordDeleteArray($scope.lesson.wordTable, deletedList, function (err) {
            sCb(err);
          });
        } else {
          sCb();
        }
      },
      // Update word
      function (sCb) {
        console.log('editedList'); console.log(editedList);
        if (editedList.length > 0) {
          window.DbProvider.wordUpdateArray($scope.lesson.wordTable, editedList, function (err) {
            sCb(err);
          });
        } else {
          sCb();
        }
      },
      // Update lesson
      function(sCb){
        console.info('update lesson');
        console.log($scope.lesson);
        console.log('$scope.title: ', $scope.title, $scope.description);
        if($scope.lesson.title != $scope.title || $scope.lesson.description != $scope.description){
          var lesson = angular.copy($scope.lesson);
          lesson.title = $scope.title;
          lesson.description = $scope.description;
          DbProvider.lessonUpdate(lesson, function(err){
            return sCb(err);
          });
        } else {
          sCb();
        }
      }
    ],
    function (err) {
      //TODO: hide waiting dialog
      //TODO: show insert results
      console.log('insert finish');
      console.log(err);
    })
  };

  function init() {
    //TODO:Show loading
    console.log('$stateParams.lessonId: ', $stateParams.lessonId);
    if ($scope.lessonId >= 0) {
      // Load lesson from DB
      window.DbProvider.lessonGetById($scope.lessonId, function (err, lesson) {
        // console.log('getLesson ', lesson);
        if (err) {
          //TODO handle error
          console.error(err);
        } else if (lesson) {
          $scope.lesson = lesson;
          $scope.title = lesson.title;
          $scope.description = lesson.description;

          // Load word of lesson
          DbProvider.getAll(lesson.wordTable, function (err, words) {
            if (err) {
              //TODO handle error
              console.error(err);
            } else {
              $scope.words = words;
              $scope.originalWord = angular.copy(words);
              $scope.$apply();
            }
          })
        }
      });
    } else {
      $scope.words = [
        {
          word: "",
          type: "",
          pronunciation: "",
          meaning: "",
          example: "",
          audio: "",
          image: "",
          isNew: true
        }]
    }
  }

  $scope.onBack = function(){
    if($scope.lessonId >= 0) {
      // Back to book detail page
      $state.go('book-detail',({id: parseInt($scope.bookId)}));
    } else{
      // Back to dashboard
      $state.go('dashboard');
    }
  }

  $scope.showWordClass = function(type) {
    for(var i = 0; i < $scope.wordClasses.length; i++) {
      if($scope.wordClasses[i].shortName == type) {
        return $scope.wordClasses[i].name;
      }
    }
    return '';
  }

  $scope.onLearn = function () {
    var options = {
      id: 'play',
      innerBounds: {
        width: 400,
        height: 235,
      },
      left: screen.width - 400 - 200,
      top: screen.height / 2 - 200 / 2,
      type: 'panel',
      frame: 'none',
      resizable: false,
      alwaysOnTop: true
    };
    var popupData =  {info: $scope.lesson, words: $scope.words };
    chrome.storage.sync.set({ 'lesson': popupData}, function () {
      var flip = chrome.app.window.create('src/popup/flipcard.html', options, function(){
        chrome.app.window.current().hide();
        chrome.app.window.get('play').onClosed.addListener(function(){
          console.log('closed');
          chrome.app.window.current().show();
        })
      });
      
    });
  } 
  init();
}