/**
 * @example
 * const str = reduce2js(`{{{{1,e(0)},
 *    {e(1),e(0)*e(1)}},
 *   {{e(2),e(0)*e(2)},
 *    {e(1)*e(2),e(0)*e(1)*e(2)}}},
 *  {{{e(3),e(0)*e(3)},
 *    {e(1)*e(3),e(0)*e(1)*e(3)}},
 *   {{e(2)*e(3),e(0)*e(2)*e(3)},
 *    {e(1)*e(2)*e(3),
 *     e(0)*e(1)*e(2)*e(3)}}}}`);
 * const e = _ => `e(${_})`
 * const expr = eval(str);
 * @param {string} reduce
 */
function reduce2js(reduce) {
  return reduce
    .replace(/{/g, '[')
    .replace(/}/g, ']');
}
export {reduce2js};
