import {Template} from "./TempFuncs.js";
class ForTemplate extends Template {
  constructor() {
    super("For Template");
    const forElements = this.pattern.querySelectorAll("div.for");
    forElements[1].hidden = true;
    document.getElementsByName("ForTemplate-EachButtons").forEach(element =>
      element.addEventListener("change", () =>
        forElements.forEach(el => { el.hidden = !el.hidden })));
    this.inOn = "in";
    this.inButton = document.getElementById("ForTemplate-InButton");
    this.inButton.parentElement.querySelectorAll("ul>li>button").forEach(element =>
      element.addEventListener("click", () => {
        this.inOn = element.value;
        this.inButton.innerText = this.inOn;
      }));
    this.doWhat = "do";
    this.doButton = document.getElementById("ForTemplate-DoButton");
    this.doButton.parentElement.querySelectorAll("ul>li>button").forEach(element =>
      element.addEventListener("click", () => {
        this.doWhat = element.value;
        this.doButton.innerText = this.doWhat;
      }));
    this.forButton = document.getElementById("ForTemplate-ForButton");
    this.textArea = this.pattern.querySelector("textarea");
  }
  resetButtonAction() {
    super.resetButtonAction();
    this.forButton.click();
    this.inButton.innerText = this.inOn = "in";
    this.doButton.innerText = this.doWhat = "do";
    this.textArea.value = "";
  }
  result() {
    let text = "for ";
    if (this.forButton.checked) {
      // Iterate over a numerical range:
      text += this.getValueCheckNonEmpty(this.inputs[0]) // forVar
        + " := " + this.getValueCheckNonEmpty(this.inputs[1]); // from
      const step = this.inputs[2].value.trim(); // step
      if (!step || step === "1")
        text += " : ";
      else
        text += " step " + step + " until ";
      text += this.getValueCheckNonEmpty(this.inputs[3]); // until
    } else  // Iterate over a list:
      text += "each " + this.getValueCheckNonEmpty(this.inputs[4]) // foreachVar
        + " " + this.inOn
        + " " + this.getValueCheckNonEmpty(this.inputs[5]); // foreachList
    return text + " " + this.doWhat
      + " " + this.getValueCheckNonEmpty(this.textArea); // exprn
  }
}
export {ForTemplate};
