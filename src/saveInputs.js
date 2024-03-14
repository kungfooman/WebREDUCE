/**
 * @example
 * console.log(saveInputs());
 */
function saveInputs() {
  const inputs = [...document.querySelectorAll(".InputDiv")].map(_ => _.innerText);
  return JSON.stringify(inputs, null, 2);
}
export {saveInputs};
