import { createNewInput, lastInput } from "./InputEditor.js";
import {mathjson2reduce} from "./mathjson2reduce.js";
// Global variables assigned in more than one module:
export const Global = {
  echo: false,
  hideOutput: false,
  inputFromKbd: undefined,
  outputToFile: undefined,
  outputToArray: undefined
};
/** True if console logging is enabled. */
export const debug = location.search.includes("debug");
/** True if mobile version selected. */
export const mobileVersion = (location.search.includes("mobile"));
// Set up access to document elements and reset their defaults for when the page is reloaded:
const startREDUCEMenuItem = document.getElementById("StartREDUCEMenuItem");
const loadPackagesMenuItem = document.getElementById("LoadPackagesMenuItem");
const stopREDUCEMenuItem = document.getElementById("StopREDUCEMenuItem");
const restartREDUCEMenuItem = document.getElementById("RestartREDUCEMenuItem");
const ioColouringCheckbox = document.getElementById('IOColouringCheckbox');
ioColouringCheckbox.checked = true;
// Can only apply bootstrap.Dropdown.getInstance() once everything is set up, so do it dynamically.
/**
 * Close a dropdown menu; used in menu-item check-box change-event
 * handlers so that clicking on the check box closes the menu.
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
typesetMathsCheckbox.checked = true;
const centreTypesetMathsCheckbox = document.getElementById('CentreTypesetMathsCheckbox');
centreTypesetMathsCheckbox.checked = true;
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
earlierButton.disabled = true;
/** Send Input Button HTML Element. */
export function getMathJSON() {
  return JSON.parse(mi._mathfield.getValue("math-json"));
}
const mathjson2reduceButton = document.getElementById("mathjson2reduceButton");

mathjson2reduceButton.onclick = () => {
  const json = getMathJSON();
  const red = mathjson2reduce(json);
  const div = lastInput ?? document.getElementsByClassName("InputDiv")[0];
  div.innerText = red;
}
/** Later Button HTML Element. */
export const laterButton = document.getElementById('LaterButton');
laterButton.disabled = true;
const fileMenuLink = document.getElementById("FileMenuLink");
const templatesMenuLink = document.getElementById("TemplatesMenuLink");
const functionsMenuLink = document.getElementById("FunctionsMenuLink");
/** True if REDUCE has not yet produced any output. */
export let noOutput = true;
export let worker;
function setRunningState(running) {
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
 * Scroll the REDUCE I/O display to the bottom.
 */
function scrollIODisplayToBottom() {
  //window.scroll(0, document.body.scrollHeight);
}
export function getOutputElement() {
  if (lastInput) {
    if (lastInput.closest("table").nextElementSibling.classList.contains("OutputDiv")) {
      const output = lastInput.closest("table").nextElementSibling;
      //output.innerHTML = ""; // todo: keep history of DOM's for quick comparisons
      return output;
    } else {
      const o = document.createElement('div');
      //l..nextElementSibling
      o.classList.add('OutputDiv');
      lastInput.closest("table").after(o);
      return o;
    }
  }
  // Will happen only at startup - once an input cell is clicked,
  // its output cell will be the receiver of output.
  // debugger;
  return document.getElementById("SystemOutput");
}
/**
 * Send plain (i.e. non maths) text to the I/O display by appending
 * a <pre> element. Then scroll the display to the bottom.
 * @param {string} text - The plain text to display.
 * @param {string} [displayClass] - The HTML class attribute to attach to the <pre> element.
 */
export function sendPlainTextToIODisplay(text, displayClass) {
  if (text.trim() === '') {
    return;
  }
  if (noOutput) {
    // This code executes immediately after REDUCE loads:
    //window.scrollTo(0, document.getElementById("Menubar").offsetTop);
    setRunningState(true);
    displayClass = undefined;
    noOutput = false;
    text = (mobileVersion ? "Mobile " : "") + "Web " + text;
  }
  // For now, append text within a <pre> element:
  const pre = document.createElement("pre");
  if (displayClass) {
    pre.classList.add(displayClass);
  }
  pre.innerText = text;
  getOutputElement().append(pre);
  scrollIODisplayToBottom();
}
/**
 * Respond to a message from the REDUCE web worker,
 * normally by displaying a processed version in ioDisplay.
 * @param {*} event
 * @returns null
 */
function reduceWebMessageHandler(event) {
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
        output = MathJax.tex2chtml(output);
        output.classList.add("output");
        getOutputElement().append(output);
        // The MathJax documentation doesn't tell the whole story!
        // See https://github.com/mathjax/MathJax/issues/2365:
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
        scrollIODisplayToBottom();
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
function reduceWebErrorHandler(event) {
  // console.error(event.message, event);
  sendPlainTextToIODisplay(event.toString(), "error");
}
/**
 * Send a text string to REDUCE as input.
 * @param {string} str - The REDUCE input.
 */
export let sendToReduce = (str) => {
  debug && console.log(` INPUT: ${str}`); // for debugging
  // This function posts a string to REDUCE, which treats it rather as if
  // it had been keyboard input. At the start of a run I use this to send a
  // sequence of commands to REDUCE to adjust its input and output processing
  // to suit the needs I have here.
  const buf = new Uint8Array(str.length + 1);
  // Array of 8-bit unsigned integers, null-terminated, to match a C/C++ string
  // (hence the length + 1). The contents are initialized to 0.
  for (let i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i); // Returns a number that is the UTF-16 code unit value at the given index.
  }
  worker.postMessage({
    funcName: 'insert_buffer',
    callbackId: '',
    data: buf
  });
};
/**
 * @param {number} ms - How long to sleep in milliseconds.
 */
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
export async function startREDUCE() {
  try {
    // Doesn't seem to catch errors in the worker!
    // Need to catch worker errors in the worker and pass them out as messages.
    worker = new Worker(mobileVersion ? "mobile/reduce.web.js" : "reduce.web.js");
    worker.onmessage = reduceWebMessageHandler;
    worker.onerror = reduceWebErrorHandler;
    // The rejectionhandled and unhandledrejection events described
    // on MDN don't seem to work or to be in the official spec!
    sendToReduce(`<<
      lisp (!*redefmsg := nil);
      load_package tmprint;
      on nat, fancy, errcont;
      off int;
    >>$`);
    await sleep(200);
    loadPackage('gnuplot');
    await sleep(200);
    loadPackage('turtle');
    await sleep(200);
    sendToReduce(`<<
      % Test: symbolic plot!-filename(); % Should return "/tmp/data.txt"
      symbolic procedure plot!-filename();
      begin
        return "/tmp/plotdata.txt";
      end;
      symbolic procedure PlotOpenDisplay();
      begin
        plotpipe!* := open("/tmp/plotcmds.txt", 'output);
        if null plotheader!* then <<
          nil
        >> else if atom plotheader!* then <<
          plotprin2 plotheader!*;
          plotterpri()
        >> else if eqcar(plotheader!*,'list) then
          for each x in cdr plotheader!* do <<
          plotprin2 x;
          plotterpri()
        >> else <<
          typerr(plotheader!*,"gnuplot header");
        >>
      end;
    >>$`);
    await sleep(100);
    createNewInput();
  } catch (error) {
    reduceWebErrorHandler(error);
    throw error; // cannot continue
  }
}
export function stopREDUCE() {
  worker.terminate();
  sendPlainTextToIODisplay("REDUCE stopped");
  setRunningState(false);
  noOutput = true;
  Global.hideOutput = false;
}
// *****************
// Utility Functions
// *****************
const toASCII = {
  Α: "!Alpha", Β: "!Beta", Γ: "!Gamma", Δ: "!Delta", Ε: "!Epsilon", Ζ: "!Zeta", Η: "!Eta", Θ: "!Theta",
  Ι: "!Iota", Κ: "!Kappa", Λ: "!Lambda", Μ: "!Mu", Ν: "!Nu", Ξ: "!Xi", Ο: "!Omicron", Π: "!Pi",
  Ρ: "!Rho", Σ: "!Sigma", Τ: "!Tau", Υ: "!Upsilon", Φ: "!Phi", Χ: "!Chi", Ψ: "!Psi", Ω: "!Omega",
  α: "alpha", β: "beta", γ: "gamma", δ: "delta", ε: "epsilon", ζ: "zeta", η: "eta", θ: "theta",
  ι: "iota", κ: "kappa", λ: "lambda", μ: "mu", ν: "nu", ξ: "xi", ο: "omicron", π: "pi",
  ρ: "rho", σ: "sigma", τ: "tau", υ: "upsilon", φ: "phi", χ: "chi", ψ: "psi", ω: "omega",
  "²": "2"
};
/**
 * Map non-ASCII characters in a text string to ASCII.
 * @param {string} text - Input text to be sent to REDUCE.
 * @returns string
 */
export function asciify(text) {
  let result = "";
  for (const char of text)
    if (char > "\x7F") {
      const newChar = toASCII[char];
      result += newChar ? newChar : char;
    } else {
      result += char;
    }
  return result;
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
export function sendToReduceAndEchoNoAsciify(text) {
  sendPlainTextToIODisplay(text, "input");
  sendToReduce(text);
}
const loadedPackages = new Set(); // should probably be in a closure!
/**
 * Load the specified package once only.
 * @param {string} pkg - Name of package to be loaded.
 */
export function loadPackage(pkg) {
  if (loadedPackages.has(pkg)) {
    return;
  }
  sendToReduceAndEchoNoAsciify(`load_package ${pkg};`);
  // Need to wait for REDUCE to digest this.
  // Should wait for the next prompt, but can't at present,
  // so only use when there is a natural pause!
  loadedPackages.add(pkg);
}
// ************
// Menu Support
// ************
// REDUCE menu:
startREDUCEMenuItem.addEventListener("click", startREDUCE);
stopREDUCEMenuItem.addEventListener("click", stopREDUCE);
restartREDUCEMenuItem.addEventListener("click", () => { stopREDUCE(); startREDUCE(); });
// I/O Colouring:
const ioColouringStyleElement = document.createElement("style");
ioColouringStyleElement.innerText = "pre.input {color: red;} *.output {color: blue;}";
ioColouringCheckbox.addEventListener("change", () => {
  if (ioColouringCheckbox.checked)
    document.head.appendChild(ioColouringStyleElement);
  else
    ioColouringStyleElement.remove();
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
typesetMathsCheckbox.addEventListener("change", () => {
  enableTypesetMaths(typesetMathsCheckbox.checked);
  hideViewMenuLink();
});
// Centre Typeset Maths:
centreTypesetMathsCheckbox.addEventListener("change", event => {
  MathJax.config.chtml.displayAlign = centreTypesetMathsCheckbox.checked ? 'center' : 'left';
  MathJax.startup.getComponents(); // See http://docs.mathjax.org/en/latest/web/configuration.html
  hideViewMenuLink();
});

const iframe = document.createElement("div");
document.body.append(iframe);
//iframe.id = 'IODisplaIODisplayIframeyIframe';
//ioDisplayHead.appendChild(ioColouringStyleElement); // IOColouringCheckbox initially checked
//    if (location.search.includes("spoof")) {
//      setRunningState(true);
//      sendToReduce = (str) => { };
//    }
//    else if (!location.search.includes("noautorun"))
//      startREDUCE();
//  });
//iframe.srcdoc = `<!DOCTYPE html>
//<html>
//<head>
//  <title>Web REDUCE</title>
//  <style>
//    body {background-color: white;}
//    body, pre {font-family: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;}
//    pre {white-space: pre-wrap; margin: 0; font-size: 14px;}
//    pre.info {background-color: yellow;}
//    pre.warning {background-color: #ffa50040;} /* orange, 1/4 opaque */
//    pre.error {background-color: #ff000040;} /* red, 1/4 opaque */
//  </style>
//  <script>MathJax = { tex: { macros: { "*": "\\\\," } } };</script>
//  <script async="async" src="./node_modules/mathjax/es5/tex-chtml.js"></script>
//</head>
//<body>
//  By default, REDUCE should load automatically.
//</body>
//</html>`;
//}
window.onload = startREDUCE;
