/**
 * Support for the File menu.
 * @module FileMenu
 * See The File System Access API: https://web.dev/file-system-access/
 * and https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API.
 * The File System Access API is currently supported on most Chromium browsers,
 * namely Chrome, Edge and Opera, on Windows, macOS, Chrome OS, and Linux.
 * Other browsers, such as Firefox, need a fallback implementation, which is horrible!
 * See https://web.dev/browser-fs-access/.
 */
import {Global                                   } from './Global.js';
import {sendPlainTextToIODisplay                 } from './sendPlainTextToIODisplay.js';
import {debug, typesetMathsCheckbox, inputDiv    } from "./Main.js";
import {hideMenuLink, refocus, enableTypesetMaths} from "./Main.js";
import {sendToReduce                             } from './sendToReduce.js';
const supported = "showOpenFilePicker" in window;
const echoFileInputCheckbox = document.getElementById("EchoFileInputCheckbox");
echoFileInputCheckbox.checked = true;
const fileMenuLink = document.getElementById("FileMenuLink");
echoFileInputCheckbox.addEventListener("change", () => hideMenuLink(fileMenuLink));
const outputFileMenuItem = document.getElementById("OutputFileMenuItem");
const outputHereMenuItem = document.getElementById("OutputHereMenuItem");
outputHereMenuItem.disabled = true;
const outputOpenMenuItem = document.getElementById("OutputOpenMenuItem");
outputOpenMenuItem.disabled = true;
const shutFileMenuItem = document.getElementById("ShutFileMenuItem");
shutFileMenuItem.disabled = true;
let typesetMathsEnabled;
let fileOpen;
if (supported) {
  debug && console.log('Using the File System Access API.');
  const inputPickerOptions = {
    id: "input",
    types: [
      {
        description: "REDUCE Input Files",
        accept: { "text/plain": [".red", ".tst"] }
      },
      {
        description: "REDUCE Test Files",
        accept: { "text/plain": [".tst"] }
      },
      {
        description: "Text Files",
        accept: { "text/plain": [".txt"] }
      }
    ]
  };
  fileOpen = async () => {
    // @ts-ignore non-standard Window method
    const [fileHandle] = await window.showOpenFilePicker(inputPickerOptions);
    return fileHandle.getFile();
  };
} else {
  debug && console.log('The File System Access API is not available.');
  fileOpen = async () => {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = ".red, .tst, .txt, text/plain";
      input.addEventListener('change', () => resolve(input.files[0]));
      input.click();
    });
  };
}
document.getElementById("InputFileMenuItem").addEventListener('click', async () => {
  Global.inputFromKbd = false;
  try {
    const file = await fileOpen();
    sendPlainTextToIODisplay(`Inputting from file "${file.name}"...`, "info");
    const contents = await file.text();
    if (echoFileInputCheckbox.checked) {
      if (Global.echo) {
        sendToReduce(contents);
      } else {
        sendToReduce("on echo;");
        Global.echo = true;
        setTimeout(sendToReduce, 100, contents);
      }
    } else {
      if (Global.echo) {
        Global.hideOutput = true;
        sendToReduce("off echo;");
        Global.echo = false;
        setTimeout(sendToReduce, 100, contents);
      } else {
        sendToReduce(contents);
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err.name, err.message);
    }
  }
  refocus();
});
const defaultOutputFileName = "output.log";
let outputFileName;
if (supported) {
  // While outputToFile is defined (true), REDUCE outputs using
  // outputToFile.write(output);
  // outputToFile is declared in "Main.js".
  var outputFileHandle, writable;
  var outputPickerOptions = {
    id: "output",
    suggestedName: defaultOutputFileName,
    types: [
      {
        description: "REDUCE Log Files",
        accept: { "text/plain": [".log", ".rlg"] }
      },
      {
        description: "Text Files",
        accept: { "text/plain": [".txt"] }
      }
    ]
  };
} else {
  // While outputToArray is defined (true), REDUCE outputs using
  // outputToArray.push(output);
  // outputToArray is declared in "Main.js".
  var outputArray;
  var fileSave = async (blob) => {
    const a = document.createElement('a');
    a.download = outputFileName;
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };
}
function displayOutputtingToFile() {
  sendPlainTextToIODisplay(`Outputting to file "${outputFileName}"...`, "info");
}
function displayOutputtingToTerminal() {
  sendPlainTextToIODisplay("Outputting to terminal...", "info");
}
outputFileMenuItem.addEventListener('click', async () => {
  try {
    if (supported) {
      // @ts-ignore non-standard Window method
      outputFileHandle = await window.showSaveFilePicker(outputPickerOptions);
      outputFileName = outputFileHandle.name;
      // Cancelling the picker throws an AbortError.
      // Create a FileSystemWritableFileStream to write to:
      Global.outputToFile = writable = await outputFileHandle.createWritable();
    } else {
      let filename = prompt("Save output file to downloads location as:", defaultOutputFileName);
      if (!filename) {
        const error = new Error();
        error.name = "AbortError";
        throw error;
      }
      outputFileName = filename;
      Global.outputToArray = outputArray = []; // array constructed from REDUCE output
    }
    displayOutputtingToFile();
    // Don't write TeX syntax to output file:
    typesetMathsEnabled = typesetMathsCheckbox.checked;
    if (typesetMathsEnabled) {
      enableTypesetMaths(false);
    }
    outputFileMenuItem.disabled = true;
    outputHereMenuItem.disabled = false;
    shutFileMenuItem.disabled = false;
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err.name, err.message);
    }
  }
  inputDiv.focus();
});
outputHereMenuItem.addEventListener('click', () => {
  if (supported) {
    Global.outputToFile = undefined;
  } else {
    Global.outputToArray = undefined;
  }
  displayOutputtingToTerminal();
  // If typeset maths was on, it has been stealthily turned off,
  // so if necessary turn it back on:
  if (typesetMathsEnabled && typesetMathsCheckbox.checked) {
    enableTypesetMaths(true);
  }
  outputOpenMenuItem.disabled = false;
  outputHereMenuItem.disabled = true;
  inputDiv.focus();
});
outputOpenMenuItem.addEventListener('click', () => {
  if (supported) {
    Global.outputToFile = writable;
  } else {
    Global.outputToArray = outputArray;
  }
  displayOutputtingToFile();
  // If typeset maths was on and has not explicilty been turned off,
  // then turn it off again:
  if (typesetMathsEnabled && typesetMathsCheckbox.checked)
    enableTypesetMaths(false);
  outputHereMenuItem.disabled = false;
  outputOpenMenuItem.disabled = true;
  inputDiv.focus();
});
shutFileMenuItem.addEventListener('click', async () => {
  if (supported) {
    try {
      await writable.close();
    } catch (err) {
      console.error(err.name, err.message);
    }
    Global.outputToFile = writable = undefined;
  }
  else {
    try {
      const blob = new Blob(outputArray); // array constructed from REDUCE output
      await fileSave(blob);
    } catch (err) {
      console.error(err.name, err.message);
    }
    Global.outputToArray = outputArray = undefined;
  }
  displayOutputtingToTerminal();
  // If typeset maths was on, it has been stealthily turned off,
  // so if necessary turn it back on:
  if (typesetMathsEnabled && typesetMathsCheckbox.checked)
    enableTypesetMaths(true);
  outputFileMenuItem.disabled = false;
  outputHereMenuItem.disabled = true;
  outputOpenMenuItem.disabled = true;
  shutFileMenuItem.disabled = true;
  inputDiv.focus();
});
