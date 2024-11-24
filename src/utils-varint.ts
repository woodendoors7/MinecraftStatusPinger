/*
*  This file contains functions for manipulating varints, and certain purpose specific function for manipulating data types that are required by minecraft's server list ping portion of the protocol.
*  And now I understand them :3
*/

function encode(num: number): number[] {
  const bytes: number[] = [];
  do {
    let byte = num & 0x7f;
    num = num >> 7;
    if (num > 0) {
      byte |= 0x80;
    }
    bytes.push(byte);
  } while (num > 0);
  return bytes;
}

function decode(varint: Uint8Array, offset = 0): number {
  let result = 0;
  let shift = 0;
  for (let i = offset; i < varint.length; i++) {
    const byte = varint[i];
    result |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) {
      break;
    }
    shift += 7;
  }
  return result;
}


function encodingLength(num: number, offset = 0): number {
  let length = offset;
  do {
    length++;
    num = num >> 7;
  } while (num > 0);
  return length - offset;
}


function concatUI8(arrayOfArrays: Array<any>): Uint8Array {
  //* Based on my own testing, using this way is significantly faster than using the spread syntax
  //*  Merging two long arrays a million times:
  //     set method Uint8Array    = 551ms             (Deno: 472ms)   
  //     spread syntax Uint8Array = 27825ms [+4950%]  (Deno: 27855ms) [+5801%]
  //     Buffer.concat            = 257ms   [-53%]    (Deno: 620ms)   [+32%]
  //*  (Buffer was faster, but I think it's a fair deal between code cleanliness; to not have a hybrid of both, cross platform support, and overall performance).

  for (let e = 0; e < arrayOfArrays.length; e++) {
    if (!(arrayOfArrays[e] instanceof Uint8Array)) arrayOfArrays[e] = new Uint8Array(arrayOfArrays[e])
  }

  const fullLength = arrayOfArrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(fullLength);

  let offset = 0;
  for (let i = 0; i < arrayOfArrays.length; i++) {
    const elem = arrayOfArrays[i];
    result.set(elem, offset);
    offset += elem.byteLength;
  }

  return result;
}

function craftInt64BE(value: bigint) {
  value = BigInt(value);

  const array = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
      array[i] = Number(value & 0xFFn); 
      value >>= 8n;                    
  }
  return array;
}


function craftUInt16BE(value: number) {
  const array = new Uint8Array(2);
  array[0] = (value >> 8) & 0xFF; // High byte
  array[1] = value & 0xFF;        // Low byte
  return array;
}

export default { encode, decode, encodingLength, concatUI8, craftInt64BE, craftUInt16BE }