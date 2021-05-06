let bitsUtils = require('bits-utils');
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
  convertBinaryToString
} = require('../lib/lib');
const chalk = require('chalk');
const fs = require('fs');
const kiwiUrl = 'http://localhost:3001';
const filename = '../lib/common-words.txt';
const words = loadWords(filename);
const codes = getCodes(words);
const timestamp = require('time-stamp');
let axios = require('axios');

// metadata with first binary package, into binary
// binary map recostruction
//
var totalBits = 0;

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

function sendMultipleWords(){
    const binaryData = encodeOneWord(word, codes);

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

function postOnTableCodes(buf){
    axios
        .post(`${kiwiUrl}/tableCodes`, buf, {
            headers: {
                'Content-Type': 'text/html'
            }
        })
        .then(res => {
          //  console.log(
          //      `Response from ${chalk.greenBright('kiwi')}: "${res.data.status}"`
          //  );
        });
}

function postOnShannonFanoEncodedText(buf){
    axios
        .post(`${kiwiUrl}/shannonFanoEncodedText`, buf, {
            headers: {
                'Content-Type': 'text/html'
            }
        })
        .then(res => {
         //   console.log(
        //        `Response from ${chalk.greenBright('kiwi')}: "${res.data.status}"`
        //    );
        });
}

function tableToBuffer(codeTable){
    for( let i = 0; i < codeTable.length; i++ ){
        var buf = bufferCreationAndAssign(convertCharToBinary(codeTable[i][0]));
        postOnTableCodes(buf);

        for( let k = 0; k < 1000; k++ ){
            k++;
            k--;
        }

        buf = bufferCreationAndAssign( codeTable[i][1] );
        postOnTableCodes(buf);

        for( let k = 0; k < 1000; k++ ){
            k++;
            k--;
        }
    }
}

function textBuffer(text){
    for( let i = 0; i < text.length; i++ ){
        if(text[i] != '\r'){
        var ok = true;
            for( let j = 0; j < codeTable.length && ok == true ; j++ ){
                if( codeTable[j][0] == text[i] ){
                    var buf = bufferCreationAndAssign( codeTable[j][1] );
                    postOnShannonFanoEncodedText(buf);

                    ok = false;

                    for( let k = 0; k < 1000; k++ ){
                        k++;
                        k--;
                    }
                    totalBits += 8;

                }
            }
        }
    }
}

function sendFromFile(){
    try {
      const data = fs.readFileSync('fileToReadFrom.txt', 'utf8');
      return data.toString();
      //return data
    } catch (err) {
      console.error(err)
    }
}

let text = sendFromFile();
let mappedText = Mapping(text);
let codeTable = codeTableFunction(shannonFanoRec(mappedText));

//console.log(codeTable);

tableToBuffer(codeTable);

textBuffer(text);

console.log(totalBits);




