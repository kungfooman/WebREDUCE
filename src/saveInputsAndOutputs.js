/**
 * @example
 * console.log(saveInputsAndOutputs());
 */
function saveInputsAndOutputs() {
  const inputs = [...document.querySelectorAll(".InputDiv")];
  const ret = [];
  for (const input of inputs) {
    const outputElement = input.closest("table").nextElementSibling;
    const i = input.innerText;
    const o = outputElement._reduce;
    ret.push({i, o});
  }
  return JSON.stringify(ret, null, 2);
}
export {saveInputsAndOutputs};
