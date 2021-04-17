const chalk = require('chalk');

const fs = require('fs');
const lib = require('bits-utils');

function loadWords(filename) {
  const input = fs.readFileSync(filename, { encoding: 'utf8'});
  let words = input.split('\r\n');
  words.push(' ');
  words.push('\r\n');
  return words;
}

function getCodes(words) {
  let codes = new Map();
  words.forEach((word, index) => {
    codes.set(word, index.toString(2).padStart(8, '0'));
  });
  return codes;
}

function getInvertedCodes(words) {
  return new Map([...words.entries()].map(([key, value]) => [value, key]));
}

function encodeOneWord(word, codes) {
  let buffers = new Uint8Array(1);
  const code = codes.get(word);
  if (!code) {
    throw new Error(chalk.red(`'${word}' is not supported`));
  }
  for (let i = 0; i < code.length; i++) {
    lib.setBit(buffers, 0, i, code[i]);
  }
  return buffers;
}

function decodeOneWord(binaryData, invertedCodes) {
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += lib.readBit(binaryData, 0, i);
  }
  const word = invertedCodes.get(code);
  return word;
}

/*words = loadWords();
codes = getCodes(words);
console.log(codes)
invertedCodes = getInvertedCodes(codes);
//console.log(invertedCodes);
binaryData = encodeOneWord('havett', codes);

let testBuffers = new Uint8Array(1);
for (let i = 5; i < 8; i++) {
  lib.setBit(testBuffers, 0, i, 1);
}
console.log(lib.printBuffer(testBuffers));
console.log(decodeOneWord(testBuffers, invertedCodes));

// console.log(binaryData);
// console.log(lib.printBuffer(binaryData))

 */
module.exports = {
  loadWords,
  getCodes,
  getInvertedCodes,
  encodeOneWord,
  decodeOneWord
};
