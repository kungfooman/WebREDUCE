/**
 * @param {number} ms - How long to sleep in milliseconds.
 */
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
export {sleep};
