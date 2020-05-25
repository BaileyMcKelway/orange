function recordButtonClicked() {
  let params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, gotTab);

  function gotTab(tabs) {
    let msg = {
      txt: 'recording',
    };
    chrome.tabs.sendMessage(tabs[0].id, msg);
  }
}

function startButtonClicked() {
  let params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, gotTab);

  function gotTab(tabs) {
    let msg = {
      txt: 'start',
    };
    chrome.tabs.sendMessage(tabs[0].id, msg);
  }
}

function stopButtonClicked() {
  let params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, gotTab);

  function gotTab(tabs) {
    let msg = {
      txt: 'stop',
    };
    chrome.tabs.sendMessage(tabs[0].id, msg);
  }
}

//Start LISTENING
document
  .querySelector('#btnGiveCommand')
  .addEventListener('click', startButtonClicked);

// START RECORDING
document
  .querySelector('#btnRecord')
  .addEventListener('click', recordButtonClicked);

//STOP LISTENING
document.querySelector('#btnStop').addEventListener('click', stopButtonClicked);
