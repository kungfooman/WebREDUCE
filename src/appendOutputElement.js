import {getOutputElement} from "./getOutputElement.js";
/**
 * @param {HTMLElement} pre
 * @param {string} text
 */
function appendOutputElement(pre, text) {
  const outputElement = getOutputElement();
  if (!outputElement) {
    console.warn("appendOutputElement> Missing output element for:", {pre, text});
    return;
  }
  outputElement.append(pre);
  outputElement._reduce = outputElement._reduce ?? [];
  outputElement._reduce.push(text);
}
export {appendOutputElement};
