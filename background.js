chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create('src/index.html', {
    id: "main",
    innerBounds: {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600
    }
  });
});

chrome.runtime.onInstalled.addListener(function() {
  console.log('installed');
});

chrome.runtime.onSuspend.addListener(function() { 
  // Do some simple clean-up tasks.
});
