/**
 * @example
 *   const json = JSON.parse(mi._mathfield.getValue("math-json"));
 *   mathjson2reduce(json);
 * @param {["Sum", ...any]|string} mathjson
 * @returns {string|undefined}
 */
function mathjson2reduce(mathjson) {
  const type = mathjson[0];
  if (typeof mathjson === 'string') {
    // take it as it is
    return mathjson;
  }
  if (type === 'Sum') {
    const body = mathjson[1];
    const args = mathjson[2];
    const [triple, name, from, to] = args;
    console.assert(triple === 'Triple');
    const bodyReduce = mathjson2reduce(body);
    return `for ${name} := ${from} : ${to} sum ${bodyReduce}`;
  }
  console.error("mathjson2reduce: unhandled element", mathjson);
}
export {mathjson2reduce};
