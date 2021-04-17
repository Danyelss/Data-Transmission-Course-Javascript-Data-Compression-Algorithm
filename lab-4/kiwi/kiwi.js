let bitsUtils = require('bits-utils');
const fs = require('fs');
let Parser = require('binary-parser').Parser;
let { app } = require('./server-config');
let {
  loadWords,
  getCodes,
  getInvertedCodes,
  decodeOneWord
} = require('../lib/lib');
const timestamp = require('time-stamp');

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

app.post('/text', function (request, response) {
  const payloadSizeInBytes = request.get('content-length');
  console.log(`Received ${payloadSizeInBytes * 8} bits`);
  let text = request.rawBody;
  console.log(text);
  const fileName = 'plain-text.txt';
  fs.appendFileSync(fileName, `${text}\n-----------\n`);
  response.json({ status: `Received ${payloadSizeInBytes * 8} bits`});
});
