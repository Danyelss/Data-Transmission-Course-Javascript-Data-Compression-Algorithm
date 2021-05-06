let bitsUtils = require('bits-utils');
const fs = require('fs');
let Parser = require('binary-parser').Parser;
let { app } = require('./server-config');
let {
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

} = require('../lib/lib');
const timestamp = require('time-stamp');
const filename = '../lib/common-words.txt';
const words = loadWords(filename);
const codes = getCodes(words);
let axios = require('axios');

let chalk = require('chalk');

app.listen(3001, function () {
  console.log('Storage server running @ localhost:3001');
});

app.post('/compressed', function (request, response) {
  const payloadSizeInBytes = request.get('content-length');
  console.log(`Received ${payloadSizeInBytes * 8} bits`);
  let buf = Buffer.from(request.rawBody, 'binary');
  const parser = new Parser().array('data', {
    type: 'uint8',
    length: 1
  });

  const binaryData = parser.parse(buf).data;
  console.log(`Received binary data: ${bitsUtils.printBuffer(binaryData)}`);

  const filename = '../lib/common-words.txt';
  const words = loadWords(filename);
  const codes = getCodes(words);
  const invertedCodes = getInvertedCodes(codes);

  console.time('Decompression');
  const uncompressed = decodeOneWord(binaryData, invertedCodes);
  console.timeEnd('Decompression');

  const fileName = 'decompressed.txt';
  fs.appendFileSync(
    fileName,
    `${timestamp.utc('YYYY/MM/DD:mm:ss')} ${uncompressed}\n`
  );
  console.log(`<${uncompressed}> saved to ${fileName}`);

  response.json({
    status: `Received ${bitsUtils.printBuffer(
      binaryData
    )} and decoded '${uncompressed}'`
  });
});

var charTrue = 1;
var codesMap = new Map();
var charForCode;
var decodedString = '';
var inverseMap = true;
var invertedMap;
var allDone = false;
let totalBits = 0;

app.post('/tableCodes', function (request, response) {

  const payloadSize = request.get('content-length');
  totalBits += parseInt(payloadSize, 10);
  let buf = Buffer.from(request.rawBody, 'binary');

  if( charTrue == 1 ){
        charForCode = convertBufferToChar(buf);

        response.json({
        status: `Received ${charForCode} char`

        });
  charTrue = 0;
  }
  else{
        var codeForChar = convertBinaryToString(buf);
        codesMap.set(charForCode, codeForChar );

        response.json({
        status: `Received ${codeForChar} code`

        });
  charTrue = 1;
  }

});

app.post('/shannonFanoEncodedText', function (request, response) {
    if( inverseMap == true ){
         invertedMap = getInvertedCodes(codesMap);
        inverseMap = false;
    }

    const payloadSize = request.get('content-length');
    totalBits += parseInt(payloadSize, 10 );
    let buf = Buffer.from(request.rawBody, 'binary');

    var char = convertBinaryToString(buf);

    decodedChar = invertedMap.get(char);

    if( decodedChar == '\n' ){
        decodedChar = '\r\n';
    }
    decodedString += decodedChar;
    console.log();
    console.log(decodedString);
    console.log(totalBits);

    fs.appendFile('decodedShannonFanoToFile.txt', decodedChar, function (err) {
          if (err) throw err;
        });  // Append data

    response.json({
    status: `Received ${decodedChar} char`

    });
});

app.post('/text', function (request, response) {
  const payloadSizeInBytes = request.get('content-length');
  console.log(`Received ${payloadSizeInBytes * 8} bits`);
  let text = request.rawBody;
  console.log(text);
  const fileName = 'plain-text.txt';
  fs.appendFileSync(fileName, `${text}\n-----------\n`);
  response.json({ status: `Received ${payloadSizeInBytes * 8} bits`});
});

app.post('/multipleCompressedWords', function (request, response) {
  const payloadSizeInBytes = request.get('content-length');
  console.log(`Received ${payloadSizeInBytes * 8} bits`);
  let buf = Buffer.from(request.rawBody, 'binary');
  const parser = new Parser().array('data', {
    type: 'uint8',
    length: 1
  });

  const binaryData = parser.parse(buf).data;
  console.log(`Received binary data: ${bitsUtils.printBuffer(binaryData)}`);

  const filename = '../lib/common-words.txt';
  const words = loadWords(filename);
  const codes = getCodes(words);
  const invertedCodes = getInvertedCodes(codes);

  console.time('Decompression');
  const uncompressed = decodeOneWord(binaryData, invertedCodes);
  console.timeEnd('Decompression');

  const fileName = 'decompressed.txt';
  fs.appendFileSync(
    fileName,
    `${timestamp.utc('YYYY/MM/DD:mm:ss')} ${uncompressed}\n`
  );
  console.log(`<${uncompressed}> saved to ${fileName}`);

  response.json({
    status: `Received ${bitsUtils.printBuffer(
      binaryData
    )} and decoded '${uncompressed}'`
  });
});
