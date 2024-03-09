import {Template} from "./TempFuncs.js";
class SolveTemplate extends Template {
  constructor() {
    super("Solve Template");
  }
  result() {
    // Process equations and unknowns:
    const eqns = [], vars = [];
    for (let i = 0; i < this.inputs.length; i++) {
      let value = this.inputs[i].value.trim();
      if (value) eqns.push(value);
      value = this.inputs[++i].value.trim();
      if (value) vars.push(value);
    }
    if (eqns.length === 0) {
      alert(this.alertHeader +
        "At least one equation/expression is required.");
      throw new Error("empty field");
    }
    // Construct and return the REDUCE input:
    let text = "solve(";
    if (eqns.length === 1) text += eqns[0];
    else text += "{" + eqns.join(", ") + "}";
    // Process variables and, if numeric, start values:
    if (vars.length > 0) {
      text += ", ";
      if (vars.length === 1) text += vars[0];
      else text += "{" + vars.join(", ") + "}";
    }
    return text + ")";
  }
}
export {SolveTemplate};
