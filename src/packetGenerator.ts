import varint from "./better-varint.js"
const _protocolVersion = 753;
import {Packet, ServerStatusOptions} from "./classes.js";


async function craftHandshake(hostname: String, port:number) {
    let packetBody = await craftHandshakeBody(hostname, port);

    // Field 1: Length of the entire object, (VarInt)
    // Field 2: PacketID, (VarInt)
    // Field 3: The body of the request
    const packetID = 0;
    
    let packetLengthBuffer = Buffer.from(varint.encode(varint.encodingLength(packetID) + packetBody.length));
    let packetIDBuffer = Buffer.from(varint.encode(packetID));

    let craftedHandshake = Buffer.concat([
        packetLengthBuffer,
        packetIDBuffer,
        packetBody,
    ])

    return craftedHandshake
}

async function craftHandshakeBody(hostname: String, port: number) {
    // Field 1: The Protocol Version, (VarInt)
    // Field 2: The hostname of the server, (String) prefixed with it's length (VarInt)
    // Field 3: The port of the server, (UInt16)
    // Field 4: Next expected state, whether to get the status (1) or login (2), (VarInt)
    let protocolVersionBuffer = Buffer.from(varint.encode(_protocolVersion));
    let hostnamePrefixBuffer = Buffer.from(varint.encode(hostname.length));
    let hostnameBuffer = Buffer.from(hostname, 'utf8');
    let portBuffer = Buffer.allocUnsafe(2)
    portBuffer.writeUInt16BE(port, 0)
    let nextStateBuffer = Buffer.from(varint.encode(1))

    let packetBody = Buffer.concat([
        protocolVersionBuffer,
        hostnamePrefixBuffer,
        hostnameBuffer,
        portBuffer,
        nextStateBuffer
    ])

    return packetBody;
}

async function craftEmptyPacket(packetID: number) {

    let packetLengthBuffer = Buffer.from(varint.encode(varint.encodingLength(packetID)));
    let packetIDBuffer = Buffer.from(varint.encode(packetID));

    let craftedPacket = Buffer.concat([
        packetLengthBuffer,
        packetIDBuffer
    ])
    return craftedPacket;
}

async function craftPingPacket() {
    // Field 1: Length of the entire object, (VarInt)
    // Field 2: PacketID, (VarInt)
    // Field 3: Payload, (Long)

    //* The payload is the current time, however, it does not matter.
    // The server should return the same value back, but not all servers do.
    // The time of when the ping request was sent is stored in a variable.
    const packetID = 1;

    let longBuffer = await makeLongBuffer(Date.now())

    let packetLengthBuffer = Buffer.from(varint.encode(varint.encodingLength(packetID) + longBuffer.length));
    let packetIDBuffer = Buffer.from(varint.encode(packetID));

    let craftedPacket = Buffer.concat([
        packetLengthBuffer,
        packetIDBuffer,
        longBuffer
    ])

    return craftedPacket;
}


async function makeLongBuffer(longNumber: number) {
    let buf = Buffer.allocUnsafe(8);
    buf.writeBigInt64BE(BigInt(longNumber))

    return buf;
}

export default { craftHandshake, craftEmptyPacket, craftPingPacket } 