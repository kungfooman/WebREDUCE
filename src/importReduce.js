import {sendToReduce} from "./sendToReduce.js";
/**
 * @param {string} filename
 */
async function importReduce(filename) {
  const res = await fetch(filename);
  const txt = await res.text();
  await sendToReduce(txt);
}
export {importReduce};
