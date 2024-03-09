import {Functions  } from "./TempFuncs.js";
import {loadPackage} from "./Main.js";
class ExpLogFunctions extends Functions {
  constructor() {
    super("ExpLogFunctions");
    this.dialogue
      .querySelector("div.function-templates>div:last-child")
      .addEventListener("click", () => loadPackage("trigd"));
  }
  result() {
    const values = [...this.selectedFunction.getElementsByTagName("input")]
      .map(el => el.value.trim());
    const fn = this.selectedFunction.dataset.function;
    switch (fn) {
      case "logb":
        return `logb(${values[1]},${values[0]})`;
      case "power":
        return `(${values[0]})^(${values[1]})`;
      case "root":
        return `(${values[1]})^(1/(${values[0]}))`;
      default:
        return `${fn}(${values.join()})`;
    }
  }
}
export {ExpLogFunctions};
