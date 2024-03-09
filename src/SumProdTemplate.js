import {Template} from "./TempFuncs.js";
class SumProdTemplate extends Template {
  constructor() {
    super("SumProd Template");
    const sumProdTdElement = this.pattern.querySelector("table tr+tr>td:first-child");
    document.getElementsByName("SumProdTemplate-SumProdButtons").forEach(element =>
      element.addEventListener("change", () => sumProdTdElement.innerText = element.value));
    const aElements = document.querySelectorAll("#SumProdTemplate a");
    aElements[1].hidden = true;
    document.getElementsByName("SumProdTemplate-SymNumButtons").forEach(element =>
      element.addEventListener("change", () => aElements.forEach(el => el.hidden = !el.hidden)));
  }
  resetButtonAction() {
    super.resetButtonAction();
    document.getElementById("SumProdTemplate-Sum").click();
    document.getElementById("SumProdTemplate-Sym").click();
  }
  result() {
    const sumProd = document.getElementById("SumProdTemplate-Sum").checked ? "sum" : "prod";
    if (document.getElementById("SumProdTemplate-Sym").checked) {
      // symbolic range: use sum/prod function:
      let text = sumProd + "(" +
        this.getValueCheckNonEmpty(this.inputs[1]) // operand
        + ", " + this.getValueCheckNonEmpty(this.inputs[2]); // var
      let t = this.inputs[3].value.trim(); // lowLim
      if (t) {
        text += ", " + t;
        t = this.inputs[0].value.trim(); // upLim
        if (t) text += ", " + t;
      }
      return text + ")";
    } else {
      // numeric range: use for loop:
      // switchNameOnOff("rounded");
      return "for " + this.getValueCheckNonEmpty(this.inputs[2]) // var
        + " := " + this.getValueCheckNonEmpty(this.inputs[3]) // lowLim
        + " : " + this.getValueCheckNonEmpty(this.inputs[0]) // upLim
        + " " + sumProd + " "
        + this.getValueCheckNonEmpty(this.inputs[1]); // operand
    }
  }
}
export {SumProdTemplate};
