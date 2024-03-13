import {sendToReduceAndEchoNoAsciify} from "./Main.js";
import {sleep                       } from "./sleep.js";
const loadedPackages = new Set();
/**
 * Load the specified package once only.
 * @param {string} pkg - Name of package to be loaded.
 */
async function loadPackage(pkg) {
  if (loadedPackages.has(pkg)) {
    return;
  }
  sendToReduceAndEchoNoAsciify(`load_package ${pkg};`);
  await sleep(200);
  // Need to wait for REDUCE to digest this.
  // Should wait for the next prompt, but can't at present,
  // so only use when there is a natural pause!
  loadedPackages.add(pkg);
}
export {loadedPackages, loadPackage};
