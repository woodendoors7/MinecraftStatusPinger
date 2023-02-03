/* 
* I actually don't understand varints at all.
* The varint and fast-varint packages didn't really work,
* varint didn't work because it wasn't properly importing encodingLength and
* fast-varint didn't work simply because there were no type definitions.
* I could've just wrapped varint.encode().length to get the length,
* or forked it and repaired the export, but who has time for that.

* I generated this with ChatGPT, let's hope it works.
*/

function encode(num: number): Buffer {
    const bytes: number[] = [];
    do {
        let byte = num & 0x7f;
        num = num >> 7;
        if (num > 0) {
            byte |= 0x80;
        }
        bytes.push(byte);
    } while (num > 0);
    return Buffer.from(bytes);
}

function decode(varint: Buffer, offset = 0): number {
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

export default { encode, decode, encodingLength }