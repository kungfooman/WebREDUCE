import {Template   } from "./TempFuncs.js";
import {loadPackage} from "./Main.js";
class MatrixTemplate extends Template {
  constructor() {
    super("Matrix Template");
    this.dialogue.addEventListener("show.bs.modal", () => loadPackage("matrix"));
  }
  result() {
    const maxRows = 4, maxCols = 4, rows = [];
    // Determine the matrix dimensions (nRows * nCols) and convert empty values to "0":
    let nColsI, nCols = 0, nRows = 0;
    for (let i = 0; i < maxRows; i++) {
      const row = [];
      nColsI = 0;
      for (let j = 0; j < maxCols; j++) {
        const value = this.inputs[i * maxCols + j].value;
        if (value) {
          row.push(value);
          nColsI = j + 1;
        } else row.push("0");
      }
      if (nColsI > nCols) nCols = nColsI;
      if (nColsI > 0) nRows = i + 1;
      rows.push(row);
    }
    // Construct and return the REDUCE input:
    let text = "mat((";
    for (let i = 0; i < nRows; i++) {
      if (i > 0) text += "), (";
      const row = rows[i];
      for (let j = 0; j < nCols; j++) {
        if (j > 0) text += ", ";
        text += row[j];
      }
    }
    return text + "))";
  }
}
export {MatrixTemplate};
