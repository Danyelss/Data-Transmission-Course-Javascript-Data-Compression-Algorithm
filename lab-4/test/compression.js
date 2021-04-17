const lib = require('bits-utils');

const text = 'IT IS BETTER LATTTTER THAN NEVER';
// console.log(text.length);
const symbols = lib.countASCIISymbols(text);
const alphabet = lib.getAlphabet(symbols);
const codes = lib.getSymbolsBitCodes(alphabet, 4)
console.log(codes);

