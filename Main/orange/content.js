chrome.runtime.onMessage.addListener(gotMessage);

let gotButtons;
let isRecording = false;

// Receive messages from popup
function gotMessage(message, sender, sendResponse) {
  if (message.txt === 'recording') {
    // Highlights Recordable Buttons
    isRecording = true;
    const buttons = document.getElementsByTagName('button');
    gotButtons = buttons;
    addhighLightButtons(buttons);

    //Listen for user input

    // Adds event listener is recording
    if (isRecording === true) {
      window.addEventListener('click', recordEvent, false);
    }
    // Sends start message to background if start
  } else if (message.txt === 'start') {
    const host = window.location.hostname;
    console.log(host);
    isRecording = false;
    let msg = {
      state: 'start',
      host: host,
    };
    chrome.runtime.sendMessage(msg);

    //Sends stop message to background if stop
  } else if (message.txt === 'stop') {
    isRecording = false;
    let msg = {
      state: 'stop',
    };
    chrome.runtime.sendMessage(msg);

    // Executes button click
  } else if (message.txt === 'command') {
    let classNames = message.commandResult.split(' ');
    const length = classNames.length - 1;
    classNames = classNames.map((className, index = 0) => {
      if (index === length) {
        return '.' + `${className}`;
      } else if (index === 0) {
        return 'button' + '.' + `${className}`;
      } else {
        return '.' + `${className}`;
      }
    });

    let queryReturn = document.querySelectorAll(
      classNames[classNames.length - 1]
    );
    classNames.pop();
    let counter = 0;
    while (queryReturn.length !== 1) {
      if (counter > 10) {
        break;
      }
      queryReturn = document.querySelectorAll(
        classNames[classNames.length - 1]
      );
      classNames.pop();
      counter = counter + 1;
    }

    queryReturn[0].click();
  }
}

// Once user clicked on button send it to background
function recordEvent(event) {
  if (isRecording === true) {
    const host = window.location.hostname;
    let msg = {
      host: host,
      button: event.target.className,
      state: 'recording',
    };
    chrome.runtime.sendMessage(msg);
  }
  removehighLightButtons(gotButtons);
  window.removeEventListener('click', recordEvent, false);
  isRecording = false;
}

function addhighLightButtons(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style['border'] = 'solid';
    buttons[i].style['border-color'] = '#ff8c00';
  }
}
function removehighLightButtons(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style['border'] = '';
    buttons[i].style['border-color'] = '';
  }
}
