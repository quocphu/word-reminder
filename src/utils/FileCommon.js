FileCommon = function(){};
FileCommon.CAN_NOT_READ_FILE = 'CAN_NOT_READ_FILE';
/**
 * Read file as text
 */
FileCommon.readFileAsText = function(path, cb){
  var reader = new FileReader();
  reader.onload = function(e){
    return cb(null, reader.result);
  }
  reader.onerror = function(e){
    console.error(e);
    return cb('READ_FILE_ERROR', null);
  }
  reader.onabort = function(e){
    console.error(e);
    return cb('READ_FILE_ABORT', null);
  }
  reader.readAsText(path);
}

/**
 * Read file as json
 */
FileCommon.readFileAsJson = function(path, cb){
  FileCommon.readAsText(path, function(err, data){
    if(err){
      return cb(err, null);
    }
    var json = null;
    var err = null;
    try {
      json = JSON.parse(data);
    } catch(ex){
      err = 'JSON_DATA_INVALID";'
      console.error(err);
      console.error(ex);
    }
    return cb(err, data);
  })
}

/**
 * Write file
 */
FileCommon.writeFile = function (path, data) {
  if (typeof data == 'object') {
    data = JSON.stringify(data);
  }
}

FileCommon.encodeImageFileAsURL = function(file, cb) {
        var reader  = new FileReader();
        reader.onloadend = function () {
            cb(null, reader.result);
        }
        reader.onerror() =function(){
          cb(FileCommon);
        }
        reader.readAsDataURL(file);
}
