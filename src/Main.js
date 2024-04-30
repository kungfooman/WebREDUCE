import {Global                  } from "./Global.js";
import {lastInput               } from "./InputEditor.js";
import {asciify                 } from "./asciify.js";
import {getMathJSON             } from "./getMathJSON.js";
import {getOutputElement        } from "./getOutputElement.js";
import {mathjson2reduce         } from "./mathjson2reduce.js";
import {sendPlainTextToIODisplay} from "./sendPlainTextToIODisplay.js";
import {sendToReduce            } from "./sendToReduce.js";
import {startREDUCE             } from "./startREDUCE.js";
import {stopREDUCE              } from "./stopREDUCE.js";
/** True if console logging is enabled. */
export const debug = location.search.includes("debug");
// Set up access to document elements and reset their defaults for when the page is reloaded:
const startREDUCEMenuItem   = document.getElementById("StartREDUCEMenuItem");
const loadPackagesMenuItem  = document.getElementById("LoadPackagesMenuItem");
const stopREDUCEMenuItem    = document.getElementById("StopREDUCEMenuItem");
const restartREDUCEMenuItem = document.getElementById("RestartREDUCEMenuItem");
const ioColouringCheckbox   = document.getElementById('IOColouringCheckbox');
if (ioColouringCheckbox) {
  ioColouringCheckbox.checked = true;
}
// Can only apply bootstrap.Dropdown.getInstance() once everything is set up, so do it dynamically.
/**
 * Close a dropdown menu; used in menu-item check-box change-event
 * handlers so that clicking on the check box closes the menu.
 * @param {any} menuLink
 */
export function hideMenuLink(menuLink) {
  bootstrap.Dropdown.getInstance(menuLink).hide();
}
const viewMenuLink = document.getElementById("ViewMenuLink");
export function hideViewMenuLink() {
  hideMenuLink(viewMenuLink);
}
/** Typeset Maths View Menu HTML Element. */
export const typesetMathsCheckbox = document.getElementById('TypesetMathsCheckbox');
if (typesetMathsCheckbox) {
  typesetMathsCheckbox.checked = true;
}
const centreTypesetMathsCheckbox = document.getElementById('CentreTypesetMathsCheckbox');
if (centreTypesetMathsCheckbox) {
  centreTypesetMathsCheckbox.checked = true;
}
/** Input Editor HTML Element. */
export const inputDiv = "todo getInputDiv()";
//export const inputDiv = document.getElementsByClassName('InputDiv')[0];
//inputDiv.innerHTML = "";
//inputDiv.focus();
export function refocus() {
  //if (mobileVersion) // Ensure I/O Display is visible:
  //  window.scrollTo(0, document.getElementById("IODisplayIframe").offsetTop);
  //else // Focus the input editor:
  //inputDiv.focus();
}
/** Earlier Button HTML Element. */
export const earlierButton = document.getElementById('EarlierButton');
if (earlierButton) {
  earlierButton.disabled = true;
}
/** Send Input Button HTML Element. */
const mathjson2reduceButton = document.getElementById("mathjson2reduceButton");
if (mathjson2reduceButton) {
  mathjson2reduceButton.onclick = () => {
    const json = getMathJSON();
    const red = mathjson2reduce(json);
    const div = lastInput ?? document.getElementsByClassName("InputDiv")[0];
    div.innerText = red;
  }
}
/** Later Button HTML Element. */
export const laterButton = document.getElementById('LaterButton');
if (laterButton) {
  laterButton.disabled = true;
}
const fileMenuLink = document.getElementById("FileMenuLink");
const templatesMenuLink = document.getElementById("TemplatesMenuLink");
const functionsMenuLink = document.getElementById("FunctionsMenuLink");
export function setRunningState(running) {
  if (!startREDUCEMenuItem) {
    // Not running with UI stuff.
    return;
  }
  startREDUCEMenuItem.disabled = running;
  loadPackagesMenuItem.disabled = !running;
  stopREDUCEMenuItem.disabled = !running;
  restartREDUCEMenuItem.disabled = !running;
  //sendInputButton.disabled = !running;
  typesetMathsCheckbox.disabled = !running;
  fileMenuLink.classList.toggle("disabled", !running);
  templatesMenuLink.classList.toggle("disabled", !running);
  functionsMenuLink.classList.toggle("disabled", !running);
}
setRunningState(false);
if (typeof Worker === "undefined") {
  // This is not a sufficient condition!
  alert("This browser does not support Web Workers and so cannot run Web-REDUCE!");
  throw new Error("Can't run REDUCE!");
}
/**
 * Respond to a message from the REDUCE web worker,
 * normally by displaying a processed version in ioDisplay.
 * @param {*} event
 * @returns null
 */
export function reduceWebMessageHandler(event) {
  if (Global.hideOutput) { // hide changes of switches etc.
    Global.hideOutput = false;
    return;
  }
  // console.log("reduceWebMessageHandler, event:", event);
  if (event.data.channel === 'plot') {
    const {script, data} = event.data;
    editorInput.setValue(script.replace('/tmp/plotdata.txt', 'data.txt'));
    editorData.setValue(data);
    launch();
  }
  if (event.data.channel === 'stdout') {
    let output = event.data.line;
    try {
      if (Global.outputToFile) { // assigned in "FileMenu.js"
        // Some line termination is necessary, but this produces more vertical space than it should!
        Global.outputToFile.write(output);
        Global.outputToFile.write("\n");
        return;
      } else if (Global.outputToArray) { // assigned in "FileMenu.js"
        Global.outputToArray.push(output);
        Global.outputToArray.push("\n");
        return;
      }
    } catch (ignore) {}
    // If an empty string is passed (ie asking for a blank line of output)
    // it gets lost in the display, so output a single space character.
    if (output == '') {
      debug && console.log("OUTPUT: Empty line"); // for debugging
      sendPlainTextToIODisplay(' ');
    }
    else {
      debug && console.log(`OUTPUT: ${output}`); // for debugging
      // The mathematical part of the output delived by REDUCE will have the form:
      // latex:\black$\displaystyle\frac{-2\*\arctan\left(x\right)+\log\left(x-1\right)-\log\left(x+1\right)}{4}$
      // delimited by a pair of control characters, \u0002 before and \u0005 after.
      // The TeX in the middle is extracted and MathJax formats it.
      // Detect the case where the output line contains some TeX:
      let n = output.indexOf('\u0002');
      if (n != -1) {
        // Here I not only strip out the material before the "U+0002" but also the
        // "junk" that reads "latex:\black$\displaystyle" and a final "U+0005".
        // Those are fragments that the REDUCE interface for TeXmacs inserts.
        output = output.substring(n + 1 + 26, output.length - 2);
        const outputTeX = output;
        if (!window.MathJax) {
          console.warn('reduceWebMessageHandler> No MathJax instance available.', {output});
          return;
        }
        output = MathJax.tex2chtml(output);
        output.classList.add("output");
        const outputElement = getOutputElement();
        outputElement.append(output);
        outputElement._reduce.push(/*event.data.line*/outputTeX);
        // The MathJax documentation doesn't tell the whole story!
        // See https://github.com/mathjax/MathJax/issues/2365:
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
        //scrollIODisplayToBottom();
      } else {
        // Textual rather than mathematical output from REDUCE gets inserted as is.
        // Highlight errors and warnings in output:
        const match = output.match(/^\*{3}(\*{2})?/);
        if (match) {
          sendPlainTextToIODisplay(output, match[1] ? "error" : "warning");
        } else {
          // Do not colour if input from file because this may be echoed input:
          sendPlainTextToIODisplay(output, Global.inputFromKbd && "output");
        }
      }
    }
  }
}
/**
 * Display an error event from the REDUCE web worker.
 * @param {ErrorEvent} event
 * @returns null
 */
export function reduceWebErrorHandler(event) {
  // console.error(event.message, event);
  sendPlainTextToIODisplay(event.toString(), "error");
}
/**
 * Echo text to the I/O display as REDUCE input and send it to REDUCE,
 * mapping any non-ASCII characters to ASCII.
 * Called in this file, InputEditor.mjs and TempFuncs.mjs.
 * @param {string} text - Input text to be sent to REDUCE.
 */
export function sendToReduceAndEcho(text) {
  // still searching a bug that occues when copypasting turtle code from html manual...
  // console.log("BEFORE ASCIIFY", text);
  text = asciify(text);
  // console.log("AFTER ASCIIFY", text);
  sendToReduceAndEchoNoAsciify(text);
}
/**
 * Echo text to the I/O display as REDUCE input and send it to REDUCE,
 * WITHOUT mapping any non-ASCII characters to ASCII.
 * Called in this file, InputEditor.mjs and TempFuncs.mjs.
 * @param {string} text - Input text to be sent to REDUCE.
 */
export async function sendToReduceAndEchoNoAsciify(text) {
  sendPlainTextToIODisplay(text, "input");
  await sendToReduce(text);
}
// ************
// Menu Support
// ************
// REDUCE menu:
startREDUCEMenuItem?.addEventListener("click", startREDUCE);
stopREDUCEMenuItem?.addEventListener("click", stopREDUCE);
restartREDUCEMenuItem?.addEventListener("click", () => {
  stopREDUCE();
  startREDUCE();
});
// I/O Colouring:
const ioColouringStyleElement = document.createElement("style");
ioColouringStyleElement.innerText = "pre.input {color: red;} *.output {color: blue;}";
ioColouringCheckbox?.addEventListener("change", () => {
  if (ioColouringCheckbox.checked) {
    document.head.appendChild(ioColouringStyleElement);
  } else {
    ioColouringStyleElement.remove();
  }
  hideViewMenuLink();
});
// Typeset Maths:
/**
 * Enable/disable typeset maths display by turning the fancy switch on/off privately.
 * @param {boolean} enable - True/false to enable/disable.
 */
export function enableTypesetMaths(enable) {
  Global.hideOutput = true;
  sendToReduce(enable ? 'on fancy;' : 'off fancy;');
}
typesetMathsCheckbox?.addEventListener("change", () => {
  enableTypesetMaths(typesetMathsCheckbox.checked);
  hideViewMenuLink();
});
// Centre Typeset Maths:
centreTypesetMathsCheckbox?.addEventListener("change", event => {
  MathJax.config.chtml.displayAlign = centreTypesetMathsCheckbox.checked ? 'center' : 'left';
  MathJax.startup.getComponents(); // See http://docs.mathjax.org/en/latest/web/configuration.html
  hideViewMenuLink();
});
//ioDisplayHead.appendChild(ioColouringStyleElement); // IOColouringCheckbox initially checked
//    if (location.search.includes("spoof")) {
//      setRunningState(true);
//      sendToReduce = (str) => { };
//    }
//    else if (!location.search.includes("noautorun"))
//      startREDUCE();
//  });
//  <style>
//    body {background-color: white;}
//    body, pre {font-family: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;}
//    pre {white-space: pre-wrap; margin: 0; font-size: 14px;}
//    pre.info {background-color: yellow;}
//    pre.warning {background-color: #ffa50040;} /* orange, 1/4 opaque */
//    pre.error {background-color: #ff000040;} /* red, 1/4 opaque */
//  </style>
