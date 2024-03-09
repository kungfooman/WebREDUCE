import {Template} from "./TempFuncs.js";
class IntegralTemplate extends Template {
  constructor() {
    super("Integral Template");
    const fields = this.pattern.children;
    this.zIntDiv = fields[0];
    const zLimTextFields = this.zIntDiv.querySelectorAll("input"); // [upper, lower]
    this.yIntDiv = fields[1];
    const yLimTextFields = this.yIntDiv.querySelectorAll("input");
    const xIntDiv = fields[2];
    const xLimTextFields = xIntDiv.querySelectorAll("input");
    this.limTextFields = [xLimTextFields, yLimTextFields, zLimTextFields];
    this.integrandTextField = fields[3];
    this.intVarTextFields = [fields[5], fields[7], fields[9]];
    this.yDSpan = fields[6];
    this.zDSpan = fields[8];
    this.intVarTextFields[0].addEventListener("input", () => {
      this.intVarTextFields[1].hidden = (this.intVarTextFields[0].value.trim().length == 0);
    });
    this.intVarTextFields[1].addEventListener("input", () => {
      const hidden = (this.intVarTextFields[1].value.trim().length == 0);
      this.yIntDiv.hidden = hidden;
      this.yDSpan.hidden = hidden;
      this.intVarTextFields[2].hidden = hidden;
    });
    this.intVarTextFields[2].addEventListener("input", () => {
      const hidden = (this.intVarTextFields[2].value.trim().length == 0);
      this.zIntDiv.hidden = hidden;
      this.zDSpan.hidden = hidden;
    });
    this.init();
  }
  init() {
    this.zIntDiv.hidden = this.yIntDiv.hidden = true;
    this.yDSpan.hidden = this.zDSpan.hidden = true;
    this.intVarTextFields[1].hidden = false;
    this.intVarTextFields[2].hidden = true;
  }
  resetButtonAction() {
    super.resetButtonAction();
    this.init();
  }
  result() {
    let text = this.integrandTextField.value.trim();
    if (this.checkNonEmpty && (!text || !this.intVarTextFields[0].value.trim())) {
      alert(this.alertHeader +
        "The integrand and integration variable are both required.");
      throw new Error("empty field");
    }
    // Wrap integrand in nested integrals:
    for (let i = 0; i < 3; i++) {
      const intVar = this.intVarTextFields[i].value.trim();
      if (intVar) {
        text = "int(" + text;
        const lowLim = this.limTextFields[i][1].value.trim();
        const upLim = this.limTextFields[i][0].value.trim();
        if (this.checkNonEmpty && (!lowLim !== !upLim)) {
          // boolean !== is equivalent to exclusive or.
          alert(this.alertHeader +
            "The limits must be both empty or both specified.");
          throw new Error("empty field");
        }
        text += ", " + intVar;
        if (lowLim) text += ", " + lowLim + ", " + upLim;
        text += ")";
      }
    }
    return text;
  }
}
export {IntegralTemplate};
