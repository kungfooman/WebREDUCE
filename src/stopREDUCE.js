import {worker} from "./startREDUCE.js";
function stopREDUCE() {
  worker.terminate();
  sendPlainTextToIODisplay("REDUCE stopped");
  setRunningState(false);
  noOutput = true;
  Global.hideOutput = false;
}
export {stopREDUCE};
