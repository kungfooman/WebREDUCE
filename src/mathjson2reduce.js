/**
 * @example
 *   const json = JSON.parse(mi._mathfield.getValue("math-json"));
 *   mathjson2reduce(json);
 * @param {["Sum", ...any]|string} mathjson
 * @returns {string|undefined}
 */
function mathjson2reduce(mathjson) {
  const type = mathjson[0];
  if (typeof mathjson === 'string' || typeof mathjson === 'number') {
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
  } else if (type === 'Multiply') {
    const lhs = mathjson2reduce(mathjson[1]);
    const rhs = mathjson2reduce(mathjson[2]);
    return `(${lhs} * ${rhs})`;
  } else if (type === 'Power') {
    const lhs = mathjson2reduce(mathjson[1]);
    const rhs = mathjson2reduce(mathjson[2]);
    return `(${lhs} ** ${rhs})`;
  } else if (type === 'Add') {
    const lhs = mathjson2reduce(mathjson[1]);
    const rhs = mathjson2reduce(mathjson[2]);
    return `(${lhs} + ${rhs})`;
  } else if (type === 'Subtract') {
    const lhs = mathjson2reduce(mathjson[1]);
    const rhs = mathjson2reduce(mathjson[2]);
    return `(${lhs} + ${rhs})`;
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
