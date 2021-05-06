let bitsUtils = require('bits-utils');
let {
  loadWords,
  getCodes,
  getInvertedCodes,
  decodeOneWord,
  encodeOneWord
} = require('../lib/lib');
const chalk = require('chalk');
let axios = require('axios');
const fs = require('fs');
const kiwiUrl = 'http://localhost:3001';
const filename = '../lib/common-words.txt';
const words = loadWords(filename);
const codes = getCodes(words);
var Parser = require("binary-parser").Parser;
let { app } = require('./server-config');
const timestamp = require('time-stamp');


app.listen(3002, function () {
  console.log('Storage server running @ localhost:3002');  // make listening port
});

function sendWord(word) {
    const binaryData = encodeOneWord(word, codes);

    // Create timestamp

    var a = new Date(Date.now() * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

    fs.appendFile('orangeToFile.txt', time + ': ' + bitsUtils.printBuffer(binaryData) + '\r\n', function (err) {
      if (err) throw err;
      console.log( bitsUtils.printBuffer(binaryData) + ' saved to file!');
    });  // Append data

  console.log(
    `The binary code for ${chalk.blueBright(word)} is ${chalk.blueBright(
      bitsUtils.printBuffer(binaryData)
    )}`
  );

  console.log(
    `Sending ${chalk.blueBright(
      bitsUtils.printBuffer(binaryData)
    )} to ${chalk.greenBright('kiwi')}`
  );
  axios
    .post(`${kiwiUrl}/compressed`, binaryData, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
    .then(res => {
      console.log(
        `Response from ${chalk.greenBright('kiwi')}: "${res.data.status}"`
      );
    });
}

function sendText(text) {
  axios
    .post(`${kiwiUrl}/text`, text, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
    .then(res => {
      console.log(
        `Response from ${chalk.greenBright('kiwi')}: "${res.data.status}"`
      );
    });
}

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

function sendFromFile(){
    try {
      const data = fs.readFileSync('fileToReadFrom.txt', 'utf8')
      return data.toString();
      //return data
    } catch (err) {
      console.error(err)
    }
}
sendWord('give');
sendWord('this');
sendWord(' ');
sendWord('\r\n'); //https://stackoverflow.com/questions/1761051/difference-between-n-and-r
sendWord('because');
sendWord('have');

sendFromFile();

sendText('give');
sendText('this\r\nbecause');


sendText(sendFromFile()+'');  // Do I need to encode it? Do I need to make kiwi know how to decode it?