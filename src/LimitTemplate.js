import { Template } from "./TempFuncs.js";
// import {loadPackage} from "./src/Main.js";
class LimitTemplate extends Template {
  constructor() {
    super("Limit Template");
    // this.dialogue.addEventListener("show.bs.modal", () => loadPackage("matrix"));
    this.dirInd = 0;
    this.DIRSTRINGS = ["\u2000", "+", "−"]; // En Quad = U+2000
    this.dirSup = this.pattern.querySelector("sup");
    this.dirSup.addEventListener("click", () =>
      this.dirSup.innerText = this.DIRSTRINGS[this.dirInd = (++this.dirInd) % 3]);
  }
  resetButtonAction() {
    super.resetButtonAction();
    this.dirSup.innerText = this.DIRSTRINGS[this.dirInd = 0];
  }
  result() {
    // if (loadSPECFN.isSelected()) preamble("load_package specfn;\n");
    const dir = ["", "!+", "!-"][this.dirInd];
    const values = Array.from(this.inputs).map(input => this.getValueCheckNonEmpty(input));
    return `limit${dir}(${values[2]}, ${values[0]}, ${values[1]})`;
  }
}
export {LimitTemplate};
