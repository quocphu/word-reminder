var fs = require('fs');
var path = require('path');

var FileUtilNode = function () { };

/**
 * Check is file
 */
FileUtilNode.isFile = function (path, cb) {
  fs.stat(path, function (stat) {
    return cb(stat.isFile());
  });
}

/**
 * Check is directory
 */
FileUtilNode.isDirectory = function (path, cb) {
  fs.stat(path, function (stat) {
    return cb(stat.isDirectory());
  });
}

/**
 * Read file as string
 */
FileUtilNode.readFileAsString = function (path, cb) {
  fs.readFile(path, function (err, data) {
    if (err) {
      return cb(err);
    }
    if (!data) {
      return cb(null, '');
    }
    return cb(null, data.toString());
  });
}

/**
 * Read file as JSON
 */
FileUtilNode.readFileAsJSON = function (path, cb) {
  this.readFileAsString(path, function (err, data) {
    if (err) {
      return cb(err);
    }
    var json = null;
    try {
      json = JSON.parse(data);
    } catch (e) {
      json = null;
    }
    return cb(json);
  });

}

/**
 * Write file
 */
FileUtilNode.writeFile = function (path, data, cb) {
  return fs.writeFile(path, data, cb);
}

/**
 * Join path
 */
FileUtilNode.joinPath = function(){
  return path.join(arguments);
}

FileUtilNode.getDataPath =  function(){
  
}

module.export = FileUtilNode;