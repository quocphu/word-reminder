
(function (window) {
  var Lesson = function () {
    this.id = null;
    this.title = null;
    this.author = null;
    this.isPrivate = null;
    this.img = null;
    this.order = null;
    this.createAt = null;
    this.createAt = null;
    this.data = [];
  };

  Lesson.readFile = function(filePath, cb){
    window.FileUtil.getInstance().readFileAsJSON(filePath, function(err, data){
      return cb(err, data);
    });
  }
  window.Lesson = Lesson;
})(window);