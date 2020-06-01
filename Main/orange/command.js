chrome.runtime.sendMessage({ state: 'popup commands' });

chrome.extension.onMessage.addListener(function (
  message,
  messageSender,
  sendResponse
) {
  let recordedCommands = JSON.parse(message.recordedCommands);

  const hostKeys = Object.keys(recordedCommands);
  console.log(recordedCommands[hostKeys]);
  if (hostKeys.length === 0) {
    const commands = document.querySelector('#commands');
    const p = document.createElement('p');
    p.textContent = 'No recorded commands';
    commands.append(p);
  } else {
    const div = document.createElement('div');

    hostKeys.forEach((mainKeys) => {
      const table = document.createElement('table');
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = mainKeys;
      tr.appendChild(th);
      const mainKeyObject = recordedCommands[mainKeys];
      const secondaryKeys = Object.keys(mainKeyObject);

      table.appendChild(tr);
      secondaryKeys.forEach((secondary) => {
        const secondtr = document.createElement('tr');
        const td = document.createElement('td');
        const a = document.createElement('a');
        a.classList.add('square_btn35');
        a.classList.add(mainKeys);
        a.id = secondary;
        const linkText = document.createTextNode('[ x ]');
        a.appendChild(linkText);
        a.href = '#';
        td.textContent = secondary;
        td.append(a);
        secondtr.appendChild(td);
        table.appendChild(secondtr);
      });

      div.appendChild(table);
    });
    const commands = document.querySelector('#commands');
    commands.appendChild(div);
  }
});

document.querySelector('#commands').addEventListener('click', removeClick);

function removeClick(event) {
  const commandWord = event.target.id;
  const hostURL = event.target.className.split(' ')[1];
  console.log(commandWord, hostURL);
  chrome.runtime.sendMessage({
    state: 'remove',
    command: commandWord,
    host: hostURL,
  });
  event.target.parentElement.remove();
}
