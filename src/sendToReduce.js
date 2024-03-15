import {debug } from "./Main.js";
import {sleep } from "./sleep.js";
import {worker} from "./startREDUCE.js";
/**
 * Send a text string to REDUCE as input.
 * @param {string} str - The REDUCE input.
 */
async function sendToReduce(str) {
  debug && console.log(` INPUT: ${str}`); // for debugging
  // This function posts a string to REDUCE, which treats it rather as if
  // it had been keyboard input. At the start of a run I use this to send a
  // sequence of commands to REDUCE to adjust its input and output processing
  // to suit the needs I have here.
  const buf = new Uint8Array(str.length + 1);
  // Array of 8-bit unsigned integers, null-terminated, to match a C/C++ string
  // (hence the length + 1). The contents are initialized to 0.
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i); // Returns a number that is the UTF-16 code unit value at the given index.
    if (charCode === 160) {
      console.warn("Invalid charCode detected");
      charCode = 32; // Space without high-bit.
    }
    buf[i] = charCode;
  }
  worker.postMessage({
    funcName: 'insert_buffer',
    callbackId: '',
    data: buf
  });
  await sleep(100);
};
export {sendToReduce};
