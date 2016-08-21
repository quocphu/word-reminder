

(function(window){
  var FileUtil = function(){};

  FileUtil.getInstance = function(){
    return new FileUtilNode();
  }

  window.FileUtil = FileUtil;
})(window);