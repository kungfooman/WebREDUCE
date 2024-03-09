import {Functions  } from "./TempFuncs.js";
import {loadPackage} from "./Main.js";
class OrthoPolyFunctions extends Functions {
  constructor() {
    super("OrthoPolyFunctions");
    this.dialogue.addEventListener("show.bs.modal", () => loadPackage("specfn"));
  }
  result() {
    const values = [...this.selectedFunction.getElementsByTagName("input")]
      .map(el => el.value.trim());
    const fn = this.selectedFunction.dataset.function;
    switch (fn) {
      case "JacobiP":
        return `JacobiP(${values[2]},${values[0]},${values[1]},${values[3]})`;
      case "GegenbauerP":
        return `GegenbauerP(${values[1]},${values[0]},${values[2]})`;
      case "AssocLegendreP":
        return `LegendreP(${values[1]},${values[0]},${values[2]})`;
      case "GenLaguerreP":
        return `LaguerreP(${values[1]},${values[0]},${values[2]})`;
      default:
        return `${fn}(${values.join()})`;
    }
  }
}
export {OrthoPolyFunctions};
