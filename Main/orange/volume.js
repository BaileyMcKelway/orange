// let audioStates = {};
// window.audioStates = audioStates;
// const connectStream = (tabId, stream) => {
//   const audioContext = new window.AudioContext();
//   const source = audioContext.createMediaStreamSource(stream);
//   const gainNode = audioContext.createGain();
//   source.connect(gainNode),
//     gainNode.connect(audioContext.destination),
//     (audioStates[tabId] = {
//       audioContext: audioContext,
//       gainNode: gainNode,
//     });
// };
// const setGain = (tabId, level) => {
//   audioStates[tabId].gainNode.gain.value = level / 100;
// };

// if (message.action === 'set_volume') {
//   if (audioStates.hasOwnProperty(message.tabId)) {
//     setGain(message.tabId, message.sliderValue);
//     updateBadge(message.tabId, message.sliderValue);
//     chrome.tabs.sendMessage(message.tabId, {
//       action: 'update_volume',
//       value: message.sliderValue,
//     });
//   } else {
//     chrome.tabCapture.capture(
//       {
//         audio: true,
//         video: false,
//       },
//       (stream) => {
//         if (chrome.runtime.lastError) {
//           return;
//         } else {
//           connectStream(message.tabId, stream);
//           setGain(message.tabId);
//         }
//       }
//     );
//   }
// }
