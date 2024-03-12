/** @type {Record<string, string>} */
export const mathjsonOps = {
  Add: '+',
  Subtract: '-',
  Multiply: '*',
  Divide: '/',
  Power: '**',
};
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
    if (mathjson === 'ExponentialE') {
      return 'e';
    }
    const parts = mathjson.split('_');
    if (parts.length === 2) {
      const lhs = mathjson2reduce(parts[0]);
      const rhs = mathjson2reduce(parts[1]);
      return `mkid(${lhs}, ${rhs})`;
    }
    // take it as it is
    return mathjson;
  }
  if (typeof mathjson === 'number') {
    return mathjson;
  }
  if (type === 'Sum') {
    const body = mathjson[1];
    const args = mathjson[2];
    const [triple, name, from, to] = args;
    console.assert(triple === 'Triple');
    const bodyReduce = mathjson2reduce(body);
    const fromReduce = mathjson2reduce(from);
    const toReduce = mathjson2reduce(to);
    return `for ${name} := ${fromReduce} : ${toReduce} sum ${bodyReduce}`;
  } else if (type === 'Product') {
    const body = mathjson[1];
    const args = mathjson[2];
    const [triple, name, from, to] = args;
    console.assert(triple === 'Triple');
    const bodyReduce = mathjson2reduce(body);
    const fromReduce = mathjson2reduce(from);
    const toReduce = mathjson2reduce(to);
    return `for ${name} := ${fromReduce} : ${toReduce} product ${bodyReduce}`;
  } else if (mathjsonOps[type]) {
    const op = mathjsonOps[type];
    const [,...args] = mathjson;
    const argsReduce = args.map(mathjson2reduce).join(` ${op} `);
    return `(${argsReduce})`;
  } else if (type === 'Delimiter') {
    const val = mathjson2reduce(mathjson[1]);
    return `(${val})`;
  }
  console.assert(mathjson instanceof Array, "mathjson must be an array now");
  // Convert to regular function call
  // For example: ['Square', 'n']
  // Turns into: Square(n)
  const [,...args] = mathjson;
  const argsReduce = args.map(mathjson2reduce).join(', ');
  return `${type}(${argsReduce})`;
}
export {mathjson2reduce};
