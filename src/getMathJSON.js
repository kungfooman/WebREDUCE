function getMathJSON() {
  const mi = document.getElementById('mathinput');
  return JSON.parse(mi._mathfield.getValue('math-json'));
}
export {getMathJSON};
