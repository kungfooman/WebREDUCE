import {createNewInput} from './InputEditor.js';
function clearNotebook() {
  [...document.querySelectorAll(".InputDiv")].forEach(_ => _.remove());
  [...document.querySelectorAll(".OutputDiv")].forEach(_ => _.remove());
  [...document.querySelectorAll(".InputIdentifier")].forEach(_ => _.remove());
  createNewInput();
}
export {clearNotebook};
