let bgButton;
let host;
let activeTab;
let recording = false;
let stop = false;
let recordedCommands = {};

chrome.runtime.onMessage.addListener(receiver);

// RECEIVE MESSAGE FUNCTION
function receiver(request, sender, sendResponse) {
  if (request.state === 'recording') {
    if (stop === false) {
      stop = true;
      recognition.stop();
    }
    bgButton = request.button;
    host = request.host;
    recording = true;
    stop = true;
    confirm('Click "OK" and then speak single word to record command');
    recognition.start();
  } else if (request.state === 'popup commands') {
    chrome.runtime.sendMessage({
      recordedCommands: JSON.stringify(recordedCommands),
    });
  } else if (request.state === 'start') {
    (activeTab = request.host),
      (recording = false),
      (stop = false),
      recognition.start(),
      console.log(request);
  } else if (request.state === 'stop') {
    (recording = false),
      (stop = true),
      recognition.stop(),
      console.log(request);
  } else if (request.state === 'remove') {
    const host = request.host;
    const command = request.command;
    const currentHostObject = recordedCommands[host];
    delete currentHostObject[command];
    if (Object.keys(currentHostObject).length === 0) {
      delete recordedCommands[host];
    }
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
