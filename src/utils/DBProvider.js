/**
 * IndexedDb provider
 * Created on: Sat Aug 20 2016
 * Author: phukq<quocphu.02@gmail.com>
 */

(function (window) {
  'use strict';
  function DbProvider() {

  }

  /**
   * Create database
   */
  DbProvider.init = function (cb) {
    if (window.WordReminderDb) {
      return cb(window.WordReminderDb);
    }

    // Open db
    var request = window.indexedDB.open(window.CONS.DB_NAME);

    // Create table(if db does not exist)
    request.onupgradeneeded = function (e) {
      var db = e.target.result;

      // Create book table
      if (!db.objectStoreNames.contains(window.CONS.DB_TBL_BOOK)) {
        var tblBook = db.createObjectStore(window.CONS.DB_TBL_BOOK, { keyPath: 'id', autoIncrement: true });
        tblBook.createIndex('by_title', 'title', { unique: false, multiEntry: false });
      }

      // Create lession table
      if (!db.objectStoreNames.contains(window.CONS.DB_TBL_LESSON)) {
        var tblLesson = db.createObjectStore(window.CONS.DB_TBL_LESSON, { keyPath: 'id', autoIncrement: true });
        tblLesson.createIndex('by_title', 'title', { unique: false, multiEntry: false });
         tblLesson.createIndex('by_bookId', 'bookId', { unique: false, multiEntry: false });
      }
    };

    // Handle event
    request.onsuccess = function (e) {
      console.log('load db', e);
      window.WordReminderDb = e.target.result;
      return cb();
    }

    request.onerror = function (e) {
      console.error(e);
      return cb('CAN_NOT_INITIALIZE_DB');
    }
  }

  /**
   * Create table
   * @param tableName Name of table
   * @param index Array of index name
   */
  DbProvider.createTable = function (tableName, index, cb) {
    // Open db
    window.WordReminderDb.close();
    var request = window.indexedDB.open(window.CONS.DB_NAME, window.WordReminderDb.version + 1);
    // Create table(if db does not exist)
    request.onupgradeneeded = function (e) {
      var db = e.target.result;
      window.WordReminderDb = db;

      // Create book table
      if (!db.objectStoreNames.contains(tableName)) {
        console.log('creat new table');
        var tblBook = db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: true });
        for (var i = 0; i < index.length; i++) {
          console.log('create index ', index[i]);
          tblBook.createIndex('by_' + index[i], index[i], { unique: false, multiEntry: false });
        }
      } else {
        return cb('TABLE_EXISTED');
      }
    };

    request.onsuccess = function (e) {
       return cb();
    }

    request.onerror = function (e) {
      return cb('CAN_NOT_CREATE_TABLE');
    }


  }

  /**
   * Insert book
   * return book_id
   */
  DbProvider.bookInsert = function (title, description, author, cb) {
    var trans = window.WordReminderDb.transaction(window.CONS.DB_TBL_BOOK, 'readwrite');
    var store = trans.objectStore(window.CONS.DB_TBL_BOOK);
    var currentTime = new Date().getTime();

    var requestAdd = store.add({
      title: title,
      description: description,
      author: author,
      createdAt: currentTime,
      updatedAt: currentTime,
      isShared: false
    });

    requestAdd.onerror = function (e) {
      return cb(e.target.errorCode, null);
    };

    requestAdd.onsuccess = function (e) {
      return cb(null, e.target.result);
    };
  }

  /**
   * Search
   */
  DbProvider.search = function (table, field, keyword, cb) {
    var d = [];
    var trans = window.WordReminderDb.transaction(table, 'readwrite');
    var store = trans.objectStore(table);
    var request = store.openCursor();
    request.onerror = function (e) {
      return cb(e.target.errorCode);
    }

    request.onsuccess = function (e) {
      var cursor = event.target.result;
      if (cursor) {
        if (cursor.value[field].indexOf(keyword) !== -1) {
          d.push(cursor.value);
        }
        cursor.continue();
      } else {
        cb(null, d);
      }
    }
  }

  /**
   * Get all
   */
  DbProvider.getAll = function (table, cb) {
    var d = [];
    var trans = window.WordReminderDb.transaction(table, 'readwrite');
    var store = trans.objectStore(table);
    var request = store.openCursor();
    request.onerror = function (e) {
      return cb(e.target.errorCode);
    }

    request.onsuccess = function (e) {
      var cursor = event.target.result;
      if (cursor) {
        d.push(cursor.value);
        cursor.continue();
      } else {
        cb(null, d);
      }
    }
  }

  /**
   * Get entry by id
   */
  DbProvider.getById = function (table, id, cb) {
    var trans = window.WordReminderDb.transaction(table, 'readwrite');
    var request = trans.objectStore(table).get(id);
    request.onerror = function (e) {
      console.error(e);
      return cb(e.target.errorCode);
    }
    request.onsuccess = function (e) {
      var rs = e.target.result;
      return cb(null, rs);
    }
  }

  /**
   * Delete entry by id
   */
  DbProvider.deleteById = function (table, id, cb) {
    var trans = window.WordReminderDb.transaction(table, 'readwrite');
    var request = trans.objectStore(table).delete(id);
    request.onerror = function (e) {
      console.error(e);
      return cb(e.target.errorCode);
    }

    request.onsuccess = function (e) {
      return cb(null);
    }
  }

  /**
   * Search book by title
   */
  DbProvider.bookSearch = function (title, cb) {
    DbProvider.search(window.CONS.DB_TBL_BOOK, 'title', title, cb);
  }

  /**
   * Get book by id
   */
  DbProvider.bookGetById = function (id, cb) {
    DbProvider.getById(window.CONS.DB_TBL_BOOK, id, cb);
  }

  /**
   * Get book by id
   */
  DbProvider.bookDeleteById = function (id, cb) {
    DbProvider.deleteById(window.CONS.DB_TBL_BOOK, id, cb);
  }


  /**
   * Insert lession
   * return {id, wordTable}
   */
  DbProvider.lessonInsert = function (bookId, title, author, description, cb) {
    var trans = window.WordReminderDb.transaction(window.CONS.DB_TBL_LESSON, 'readwrite');
    var store = trans.objectStore(window.CONS.DB_TBL_LESSON);
    var currentTime = new Date().getTime();
    var wordTable = window.md5(bookId + title);

    var requestAdd = store.add({
      bookId: bookId,
      title: title,
      description: description,
      author: author,
      createdAt: currentTime,
      updatedAt: currentTime,
      isShared: false,
      wordTable: wordTable
    });

    requestAdd.onerror = function (e) {
      return cb(e.target.errorCode, null);
    };

    requestAdd.onsuccess = function (e) {
      return cb(null, { id: e.target.result, wordTable: wordTable });
    };
  }

  /**
   * Get lesson by book id
   */
  DbProvider.lessonGetByBookId = function (bookId, cb) {
    DbProvider.search(window.CONS.DB_TBL_LESSON, 'bookId', bookId, cb);
  }

  /**
   * Get book by id
   */
  DbProvider.lessonGetById = function (id, cb) {
    DbProvider.getById(window.CONS.DB_TBL_LESSON, id, cb);
  }

  /**
   * Update lesson
   */
  DbProvider.lessonUpdate = function(lesson, cb) {
    var transaction = window.WordReminderDb.transaction(window.CONS.DB_TBL_LESSON, 'readwrite');
    var objectStore = transaction.objectStore(window.CONS.DB_TBL_LESSON);
    var request = objectStore.openCursor();

    request.onerror = function(e){
      return cb(e.errorCode);
    }
    var now = new Date().getTime();
    request.onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor && cursor.value ) {
        var cLesson = cursor.value;
        if(cLesson.id == lesson.id){
          console.log('update lesson');
          if(cLesson.title != lesson.title || cLesson.description != lesson.description) {
            var updateReq = cursor.update(lesson);
            lesson.updatedAt = new Date().getTime();
            updateReq.onerror = function (e){
              return cb(e.errorCode);
            }

            updateReq.onsuccess = function (e){
              return cb();
            }
          }
        } else {
          cursor.continue();
        }
      } else {
        cb();
      }
    }
  }

  /**
   * Insert word
   */
  DbProvider.wordInsert = function (wordTable, words, cb) {
    async.series([
      // Create table if does exist
      function (sCb) {
        if (!window.WordReminderDb.objectStoreNames.contains(wordTable)) {
          console.log('Create table');
          window.DbProvider.createTable(wordTable, ['title'], function (err) {
            sCb();
          });
        } else {
          sCb();
        }
      },
      // Insert data
      function (sCb) { 
        var trans = window.WordReminderDb.transaction(wordTable, 'readwrite');
        var store = trans.objectStore(wordTable);
        var currentTime = new Date().getTime();
        var i = 0;

        putNext();

        function putNext() {
          console.log('insert word: ', words[i]);
          if (i < words.length) {
            var requestAdd = store.add(words[i]).onsuccess = putNext;
            requestAdd.onerror = function (e) {
              return sCb(e.target.errorCode);
            };
            ++i;
          } else {
            console.info('wordInsert complete');
            sCb();
          }
        }
      },
    ], function (err) {
      cb(err);
    });
  }

  /**
   * Remove array of word from database
   */
  DbProvider.wordDeleteArray = function (wordTable, words, cb) {
    async.eachSeries(words, function(word, eCb){
      DbProvider.deleteById(wordTable, word.id, function(err){
        eCb(err);
      });
    }, function(err){
      return cb(err);
    });
  }

  /**
   * Update array of word
   */
  DbProvider.wordUpdateArray = function (wordTable, words, cb) {
    if(!words || words.length == 0) {
      return cb();
    }

    var transaction = window.WordReminderDb.transaction(wordTable, 'readwrite');
    var objectStore = transaction.objectStore(wordTable);
    var request = objectStore.openCursor();

    request.onerror = function(e){
      return cb(e.errorCode);
    }
    var now = new Date().getTime();
    request.onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor && cursor.value) {
        var word = cursor.value;
        var i = words.length - 1;
        async.whilst(
          function(){return i >= 0},
          function(wCb){
            if(word.id == words[i].id) {
              word.word = words[i].word;
              word.type = words[i].type;
              word.pronunciation = words[i].pronunciation;
              word.meaning = words[i].meaning;
              word.example = words[i].example;
              word.updatedAt = now;

              var updateReq = cursor.update(word);
              updateReq.onerror = function(e){
                  return wCb(err);
              }
              updateReq.onsuccess =function(){
                words.splice(i, 1);
                return wCb('break');
              }
            }
          },
          function(err){
            if(err && err != 'break') {
              return cb(err);
            }
            cursor.continue();
          }
        );
      } else {
        cb();
      }
    }
  }
  
  window.DbProvider = DbProvider;
})(window);