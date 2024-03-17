import {sendToReduce} from "./sendToReduce.js";
/**
 * @param {string} filename
 * @param {string} content
 */
async function handleFile(filename, content) {
  console.log('handleFile', {filename, content});
  if (filename.endsWith('.js')) {
    eval(content);
  } else if (filename.endsWith('.red')) {
    await sendToReduce(content);
  }
}
async function enableDragAndDrop() {
  const e = document.getElementById("SystemOutput");
  if (!(e instanceof HTMLDivElement)) {
    console.error("SystemOutput isn't a <div>!");
    return;
  }
  e.ondrop = async function (event) {
    event.preventDefault();
    for (const file of event.dataTransfer.files) {
      const txt = await file.text();
      await handleFile(file.name, txt);
    }
    const txt = event.dataTransfer.getData('Text');
    // If we only get a file name (e.g. from dragging file from VSCode onto SystemOutput),
    // then try to fetch it.
    if (txt.startsWith('/var/www/')) {
      const www = txt
        .replace('/var/www/html/', '/var/www/')
        .replace('/var/www/', 'http://127.0.0.1/');
      const res = await fetch(www);
      const content = await res.text();
      await handleFile(txt, content);
    }
    // console.log("non-file text", event.dataTransfer.getData('Text'), typeof event.dataTransfer.getData('Text'));
    return false;
  };
  e.ondragover = function (event) {
    event.preventDefault();
  };
}
export {enableDragAndDrop};
