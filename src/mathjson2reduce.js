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
  if (mathjson.fn) {
    mathjson = mathjson.fn;
  }
  if (mathjson.sym) {
    return mathjson.sym;
  }
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
    const body = mathjson2reduce(mathjson[1]);
    const [triple, name, from, to] = mathjson[2].map(mathjson2reduce);
    console.assert(triple === 'Triple');
    return `for ${name} := ${from} : ${to} sum ${body}`;
  } else if (type === 'Product') {
    const body = mathjson2reduce(mathjson[1]);
    const [triple, name, from, to] = mathjson[2].map(mathjson2reduce);
    console.assert(triple === 'Triple');
    return `for ${name} := ${from} : ${to} product ${body}`;
  } else if (type === 'Integrate') {
    const [, f, tripleNameFromTo] = mathjson;
    const [, name, from, to] = tripleNameFromTo.map(mathjson2reduce);
    const fReduce = mathjson2reduce(f);
    const nameFromToReduce = `${name} = (${from} .. ${to})`;
    return `num_int(${fReduce}, ${nameFromToReduce})`;
  } else if (type === 'Square') {
    const tmpReduce = mathjson2reduce(mathjson[1]);
    return `(${tmpReduce} ^ 2)`;
  } else if (type === 'Negate') {
    const tmpReduce = mathjson2reduce(mathjson[1]);
    return `-${tmpReduce}`;
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
