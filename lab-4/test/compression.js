const lib = require('bits-utils');

const text = 'THE WEEKND ISSS ON FIRRRRE I NEED MORE WORDS THANKS';
console.log(text.length);
const symbols = lib.countASCIISymbols(text);
const alphabet = lib.getAlphabet(symbols);
console.log(alphabet);
const codes = lib.getSymbolsBitCodes(alphabet, 4)
console.log(codes);

