/** @type {Record<any, any>} */
const toASCII = {
  Α: "!Alpha", Β: "!Beta", Γ: "!Gamma", Δ: "!Delta", Ε: "!Epsilon", Ζ: "!Zeta", Η: "!Eta", Θ: "!Theta",
  Ι: "!Iota", Κ: "!Kappa", Λ: "!Lambda", Μ: "!Mu", Ν: "!Nu", Ξ: "!Xi", Ο: "!Omicron", Π: "!Pi",
  Ρ: "!Rho", Σ: "!Sigma", Τ: "!Tau", Υ: "!Upsilon", Φ: "!Phi", Χ: "!Chi", Ψ: "!Psi", Ω: "!Omega",
  α: "alpha", β: "beta", γ: "gamma", δ: "delta", ε: "epsilon", ζ: "zeta", η: "eta", θ: "theta",
  ι: "iota", κ: "kappa", λ: "lambda", μ: "mu", ν: "nu", ξ: "xi", ο: "omicron", π: "pi",
  ρ: "rho", σ: "sigma", τ: "tau", υ: "upsilon", φ: "phi", χ: "chi", ψ: "psi", ω: "omega",
  "²": "2"
};
/**
 * Map non-ASCII characters in a text string to ASCII.
 * @example
 * asciify("λ") === 'lambda';
 * @param {string} text - Input text to be sent to REDUCE.
 * @returns {string} String without aforementioned Unicode characters.
 */
function asciify(text) {
  let result = "";
  for (const char of text)
    if (char > "\x7F") {
      const newChar = toASCII[char];
      result += newChar ? newChar : char;
    } else {
      result += char;
    }
  return result;
}
export {asciify};
