import {Global             } from './Global.js';
import {setRunningState    } from "./Main.js";
import {appendOutputElement} from "./appendOutputElement.js";
/**
 * Send plain (i.e. non maths) text to the I/O display by appending
 * a <pre> element. Then scroll the display to the bottom.
 * @param {string} text - The plain text to display.
 * @param {string} [displayClass] - The HTML class attribute to attach to the <pre> element.
 */
function sendPlainTextToIODisplay(text, displayClass) {
  if (text.trim() === '') {
    return;
  }
  if (Global.noOutput) {
    // This code executes immediately after REDUCE loads:
    //window.scrollTo(0, document.getElementById("Menubar").offsetTop);
    setRunningState(true);
    displayClass = undefined;
    Global.noOutput = false;
    text = (Global.mobileVersion ? "Mobile " : "") + "Web " + text;
  }
  // For now, append text within a <pre> element:
  const pre = document.createElement("pre");
  if (displayClass) {
    pre.classList.add(displayClass);
  }
  pre.innerText = text;
  appendOutputElement(pre, text);
}
export {sendPlainTextToIODisplay};
