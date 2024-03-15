export const Global = {
  echo: false,
  hideOutput: false,
  inputFromKbd: undefined,
  outputToFile: undefined,
  outputToArray: undefined,
  // True if REDUCE has not yet produced any output.
  noOutput: true,
  // True if mobile version selected.
  mobileVersion: location.search.includes("mobile"),
};
