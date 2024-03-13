import {getOutputElement} from './getOutputElement.js';
function clearOutputElement() {
  const tmp = getOutputElement();
  tmp.innerHTML = '';
  tmp._reduce.length = 0;
}
export {clearOutputElement};
