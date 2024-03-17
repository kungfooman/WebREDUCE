import {lastInput} from "./InputEditor.js";
function getOutputElement() {
  if (lastInput?.isConnected) {
    if (lastInput.closest("table").nextElementSibling.classList.contains("OutputDiv")) {
      const output = lastInput.closest("table").nextElementSibling;
      //output._reduce = [];
      //output.innerHTML = ""; // todo: keep history of DOM's for quick comparisons
      return output;
    } else {
      const o = document.createElement('div');
      o._reduce = [];
      //l..nextElementSibling
      o.classList.add('OutputDiv');
      lastInput.closest("table").after(o);
      return o;
    }
  }
  // Will happen only at startup - once an input cell is clicked,
  // its output cell will be the receiver of output.
  // debugger;
  return document.getElementById("SystemOutput");
}
export {getOutputElement};
