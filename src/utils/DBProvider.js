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
      if (!db.objectStoreNames.contains(window.CONS.DB_TBL_BOOK)) {
        var tblLesson = db.createObjectStore(window.CONS.DB_TBL_LESSON, { keyPath: 'id', autoIncrement: true });
        tblLesson.createIndex('by_title', 'title', { unique: false, multiEntry: false });
      }
    };

    // Handle event
    request.onsuccess = function (e) {
      window.WordReminderDb = e.target.result;
      return cb();
    }

    request.onerror = function (e) {
      console.error(e);
      return cb('CAN_NOT_INITIALIZE_DB');
    }
  }

  /**
   * Insert book
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

    requestAdd.onsuccess = function (e) {
      return cb(e.target.errorCode, null);
    };

    requestAdd.onfailure = function (e) {
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
      return cb(e.result.errorCode);
    }

    request.onsuccess = function (e) {
      var cursor = event.target.result;
      if (cursor) {
        if (cursor.value[field].indexOf(keyword) !== -1) {
          d.push(JSON.stringify(cursor.value))
        }
        cursor.continue();
      } else {
        cb(null, d);
      }
    }
  }

  /**
   * Search book by title
   */
  DbProvider.bookSearch = function(title, cb){
    DbProvider.search(window.CONS.DB_TBL_BOOK, 'title', title, cb);
  }


  window.DbProvider = DbProvider;
})(window);