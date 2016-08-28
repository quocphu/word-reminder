
var currentWindow;
var currentIndex = 0;
var words = [];
var frontWord = $('#front-word');
var frontType = $('#front-type');
var backType = $('#back-type');
var backWord = $('#back-word');
var backPronunciation = $('#back-pronunciation');
var backExample = $('#back-example');
var backMean = $('#back-mean');
var dictionaryLink = 'http://vndic.net/index.php?word={word}&dict=en_vi';
var isHiding = false;
var randomIndex = [];
var SETTINGS = {
  wrapAround: false,
  isDrawAttention: true,
  repeatTime: 1000 * 3,
  isRandom: true
}
// Load words data
chrome.storage.sync.get('lesson', function (item) {
  console.log(item);
  words = item.lesson.words;

  if (SETTINGS.isAlwaysOntop) {
    currentWindow.setAlwaysOnTop(true);
  }

  frontWord = $('#front-word');
  frontType = $('#front-type');

  // Create attention
  currentWindow = chrome.app.window.current();
  currentWindow.drawAttention();

  // currentWindow.onClose()
  // Set button event
  var flipper = $('#flipper');
  $('#flip').on('click', function () {
    flipper.toggleClass('go');
  });

  // Next event
  $('#next').on('click', function () {
    next();
  });

  // Next event
  $('#prev').on('click', function () {
    prev();
  });

  // Setting event
  $('#setting').on('click', function () {
    console.log('setting click');
  });

  // Close event
  $('#btnHide').on('click', function () {
    isHiding = true;
    currentWindow.hide();
  });

  // Setting event
  $('#btnSetting').on('click', function () {
    chrome.app.window.get('main').show();
  });

  // Ontop event
  $('#btnOnTop').on('click', function () {
    currentWindow.setAlwaysOnTop(!currentWindow.isAlwaysOnTop());
    currentWindow.hide();
    isHiding = true;
    $('#btnOnTop').toggleClass('glyphicon-object-align-bottom');
    $('#btnOnTop').toggleClass('glyphicon-object-align-top');
  });

  // Create random index
  createRandomIndex(words.length);

  // Bind data to html
  showData(currentIndex);

  setTimeout(function () {
    console.log('start');
    start();
  }, SETTINGS.repeatTime);
});

function next() {
  if (++currentIndex >= words.length) {
    if (SETTINGS.wrapAround) {
      currentIndex = 0;
    } else {
      currentIndex--;
    }
  }
  showData(currentIndex);
}

function prev() {
  if (--currentIndex < 0) {
    if (SETTINGS.wrapAround) {
      currentIndex = words.length - 1;
    } else {
      currentIndex++;
    }
  }
  showData(currentIndex);
}

function showData(idx) {
  var word = words[randomIndex[idx]];
  frontWord.html(word.word);
  frontType.html('(' + word.type + ')');

  // backType = word.type;
  backWord.html(word.word);
  backWord.attr('href', dictionaryLink.replace('{word}', word.word))
  backPronunciation.html('/' + word.pronunciation + '/');
  backExample.html(word.example);
  backMean.html(word.meaning);
}

function start() {
  setInterval(function () {
    console.log('repeat');
    next();

    if (currentWindow.isAlwaysOnTop()) {
      currentWindow.focus();

    }

    if (isHiding) {
      isHiding = false;
      currentWindow.show();
    }



    if (SETTINGS.isDrawAttention) {
      currentWindow.drawAttention();
    }

  }, SETTINGS.repeatTime);
}

function createRandomIndex(len) {
  if(SETTINGS.isRandom) {
    randomIndex = randomArray(len);
  } else {
    randomIndex = [];
    for(var i = 0; i < len; i++){
      randomIndex.push(i);
    }
  }

}

/**
 * Create random integer between {min} and {max}
 */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Create array of unique integer random
 */
function randomArray(num) {
  var arr = Array();
  var idx = 1;
  var exist = false;
  arr[0] = randomBetween(1, num) - 1;

  while (idx < num) {
    exist = false;

    var rd = randomBetween(1, num) - 1;

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == rd) {
        exist = true;
        break;
      }
    }

    if (exist) {
      continue;
    } else {
      arr[idx] = rd;
      idx++;
    }
  }
  return arr;
};