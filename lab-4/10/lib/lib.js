const chalk = require('chalk');

const fs = require('fs');
const bitsUtils = require('bits-utils');

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
    bitsUtils.setBit(buffers, 0, i, code[i]);
  }
  return buffers;
}

function decodeOneWord(binaryData, invertedCodes) {
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += bitsUtils.readBit(binaryData, 0, i);
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

// Dani

function readBuffer(buffer){
    let result = '';

    for( let i = 0; i < buffer.length; i++ ){
        result += bitsUtils.readBit(buffer, i, i );
    }

    return result;
}

function convertCharToBinary(char){
    var binaryChar = char.charCodeAt(0).toString(2);
        while(binaryChar.length < 8 ){
            binaryChar = binaryChar.unshift('0');
        }
    return binaryChar;
}

function convertBufferToChar(buffer){
    var stringBuffer = convertBinaryToString(buffer);

    var asciiCode =  parseInt(stringBuffer,2).toString(10);

    return String.fromCharCode(asciiCode);
}

function convertBinaryToString(buffer){
    var result = '';

    for( let i = 0; i < buffer.length; i++ ){
        result += bitsUtils.readBit(buffer, i, i );
    }

    return result;
}

function bufferCreationAndAssign(code){
   var buffer = Buffer.alloc(code.length);

   for( let i = 0; i < code.length; i++ ){
        bitsUtils.setBit( buffer, i, i, parseInt(code[i]) );
   }

   return buffer;
}

String.prototype.unshift = function(el) {
     let arr = [this];
     arr.unshift(el);
     return arr.join("");
 }

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

// inverse Map
const reverseObject = (obj) => {
   const newObj = {};
   Object.keys(obj).forEach(key => {
      if(newObj[obj[key]]){
         newObj[obj[key]].push(key);
      }else{
         newObj[obj[key]] = [key];
      }
   });
   return newObj;
};

/*                        for Shannon-Fano                     */
{
function reverseMap(map) {
    aux = map.slice(0).reverse().map(
        function(val, index) {
            return val;
        }
    );

    return aux;
}

function allUsedChars(string){
  var charSet = [...new Set(string.match(/[ -~]/g))];
  charSet.push('\n');
  return charSet;
}

function numberOfAppearances(char,string) {
  var regExp = new RegExp(char, 'gi');
  return (string.match(regExp) || []).length;
}

function Mapping(string){
  return sortMap(allUsedChars(string).map( char => [char,numberOfAppearances(char,string)] ));
}

function sortMap(Tab){

    Tab.sort(sortingFunc);

    function sortingFunc(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }

    return Tab;
}

function shannonFanoRec(map){
   var P1 = [];
   var P2 = [];

   if(map.length>1){

        while((sumOfElements(P1) < sumOfElements(subArray(map,P1.length,map.length)))
             && (P1.length<map.length -1)){
                P1.push(map[P1.length]);
            }

        P2=subArray(map,P1.length,map.length);

        P1=affect_code(P1,"1");
        P2=affect_code(P2,"0");

        return shannonFanoRec(P1).concat(shannonFanoRec(P2));

    }
    else{
            return map;
        }
}

function subArray( map, i, j ){
    var subArray=[];
    for(var k = i ; k<j; k++) {
        subArray.push(map[k]);
    }
    return subArray;
}

function sumOfElements(map){
    var s=0 ;

    map.forEach(element => {
        s+=element[1];
    });

    return s;
}

function affect_code(map,s){
    map.forEach(element => {

    element[0]+=s;
    });

    return map;
}

function codeTableFunction(map){
  var tab=[];

  map.forEach(element => {
    tab.push([element[0][0],element[0].substring(1,element[0].length)]);
 });

 return tab;
}
}

module.exports = {
  loadWords,
  getCodes,
  getInvertedCodes,
  encodeOneWord,
  decodeOneWord,
  readBuffer,
  codeTableFunction,
  Mapping,
  shannonFanoRec,
  bufferCreationAndAssign,
  convertCharToBinary,
  convertBufferToChar,
  convertBinaryToString,
  reverseObject



};
