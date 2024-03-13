/**
 * @example
 * const rets = [
 *   0.707106781187,
 *   0.632455532034,
 *   0.613571991078,
 *   0.608833912518,
 *   0.607648256256,
 *   0.607351770141,
 *   0.607277644094,
 *   0.607259112299,
 *   0.607254479333,
 *   0.60725332109
 * ].map((_, i) => [i + 1, _]);
 * js2reduce(rets);
 * @param {any} data - The data to convert.
 * @return {string} String representation parsable by REDUCE.
 */
function js2reduce(data) {
    if (data instanceof Array) {
        const tmp = data.map(js2reduce);
        return `{${tmp.join(', ')}}`;
    }
    return data;
}
export {js2reduce};
