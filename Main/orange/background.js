let bgButton;
let host;
let activeTab;
let recording = false;
let stop = false;
let recordedCommands = {};

chrome.runtime.onMessage.addListener(receiver);

chrome.runtime.sendMessage({
  msg: 'something_completed',
  data: {
    subject: 'Loading',
    content: 'Just completed!',
  },
});

// RECEIVE MESSAGE FUNCTION
function receiver(request, sender, sendResponse) {
  if (request.state === 'recording') {
    if (stop === false) {
      recognition.stop();
    }
    bgButton = request.button;
    host = request.host;
    recording = true;
    stop = true;
    recognition.start();
    console.log(request);
  } else if (request.state === 'start') {
    chrome.storage.local.sync.set(
      { recordedCommands: recordedCommands },
      function () {
        console.log(recordedCommands);
      }
    );
    chrome.storage.local.sync.get(['recordedCommands'], function (result) {
      console.log('Value currently is ' + result.recordedCommands);
      recordedCommands = result.recordedCommands;
    });
    (activeTab = request.host),
      (recording = false),
      (stop = false),
      recognition.start(),
      console.log(request);
  } else if (request.state === 'stop') {
    chrome.storage.local.sync.set(
      { recordedCommands: recordedCommands },
      function () {
        console.log(recordedCommands);
      }
    );
    (recording = false),
      (stop = true),
      recognition.stop(),
      console.log(request);
  }
}

// SEND MESSAGE FUNCTION
function commandResult(message) {
  let params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, gotTab);

  function gotTab(tabs) {
    let msg = {
      txt: 'command',
      commandResult: message,
    };
    chrome.tabs.sendMessage(tabs[0].id, msg);
  }
}

// Create Speech Recognition instance
var SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
var SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;

const grammar = '#JSGF V1.0;';

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;

//LISTENING
recognition.onresult = function (event) {
  if (recording === false) {
    const last = event.results.length - 1;

    const command = event.results[last][0].transcript;
    // message.textContent = 'Voice Input: ' + command + '.';

    let commandSplit = command.toLowerCase().split(' ');

    //EXECUTE COMMANDS
    if (commandSplit.includes('orange')) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const url = new URL(tab.url);
        activeTab = url.hostname;
      });
      let command = commandSplit;
      let key = `${command[command.indexOf('orange') + 1]}`;

      try {
        commandResult(recordedCommands[activeTab][key]);
      } catch (error) {
        console.log(error);
      }
    }
    //ASSIGN NEW OBJ PROPERTY
  } else if (recording === true) {
    const last = event.results.length - 1;

    const command = event.results[last][0].transcript;

    let commandSplit = command.toLowerCase().split(' ');

    let temp = bgButton;
    if (!recordedCommands[host]) {
      recordedCommands[host] = {};
    }
    recordedCommands[host][commandSplit[0]] = temp;
    recognition.stop();
  }
};

//CATCH RECOGNITION ERRORS
recognition.onerror = function (event) {
  console.log(event);
};

//CONTINOUS LISTENING LOOP
recognition.onend = function () {
  if (stop === false) {
    recognition.start();
  } else if (stop === true) {
    recognition.stop();
  }
};
