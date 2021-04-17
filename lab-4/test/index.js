const lib = require('bits-utils');

// a=0 b=1
// aaaabbbb => 64 bits ASCII
// abababab => 8 bits

function encode(text){
    let buffers = new Uint8Array(1);
    for(let i=0;i<text.length;i++) {
        if(text[i]==='b') {
            lib.setBit(buffers, 0, i, 1);
        }
    }
    return buffers;
}

function decode(buffers){
    let result = '';
    for(let i=0;i<8;i++) {

        if(lib.readBit(buffers, 0, i) === 0) {
            result+='a';
        }

        if(lib.readBit(buffers, 0, i) === 1) {
            result+='b';
        }
    }
    return result;
}

const inputText = 'baaabbbb';
console.log(`Input text: ${inputText}`);
let encodedMessageInBinary = encode(inputText);
console.log(`Encoded data: ${lib.printBuffer(encodedMessageInBinary)} on ${encodedMessageInBinary.length*8} bits`);
console.log(`Decoded message: ${decode(encodedMessageInBinary)}`);
