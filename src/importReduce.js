import {sendToReduce} from "./sendToReduce.js";
/**
 * @param {string} filename
 */
async function importReduce(filename) {
  const res = await fetch(filename);
  const txt = await res.text();
  sendToReduce(txt);
}
export {importReduce};
