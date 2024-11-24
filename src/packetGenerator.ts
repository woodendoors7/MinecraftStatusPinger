import varint from "./utils-varint.ts"


async function craftHandshake(hostname: string, port: number, protocolVersion: number) {
    let packetBody = await craftHandshakeBody(hostname, port, protocolVersion);

    // Field 1: Length of the entire object, (VarInt)
    // Field 2: PacketID, (VarInt)
    // Field 3: The body of the request
    const packetID = 0;
    
    let packetLengthBuffer = varint.encode(varint.encodingLength(packetID) + packetBody.length);
    let packetIDBuffer = varint.encode(packetID);

    let craftedHandshake = varint.concatUI8([
        packetLengthBuffer,
        packetIDBuffer,
        packetBody
    ])

    return craftedHandshake
}
 
async function craftHandshakeBody(hostname: string, port: number, protocolVersion: number) {
    // Field 1: The Protocol Version, (VarInt)
    // Field 2: The hostname of the server, (String) prefixed with it's length (VarInt)
    // Field 3: The port of the server, (UInt16)
    // Field 4: Next expected state, whether to get the status (1) or login (2), (VarInt)
    let protocolVersionBuffer = varint.encode(protocolVersion);
    let hostnamePrefixBuffer = varint.encode(hostname.length);
    let hostnameBuffer = new TextEncoder().encode(hostname);
    let portBuffer = varint.craftUInt16BE(port);
    let nextStateBuffer = varint.encode(1)

    let packetBody = varint.concatUI8([
        protocolVersionBuffer,
        hostnamePrefixBuffer,
        hostnameBuffer,
        portBuffer,
        nextStateBuffer
    ])

    return packetBody;
}

async function craftEmptyPacket(packetID: number) {

    let packetLengthBuffer = varint.encode(varint.encodingLength(packetID));
    let packetIDBuffer = varint.encode(packetID);

    let craftedPacket = varint.concatUI8([
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

    let longBuffer = varint.craftInt64BE(BigInt(Date.now()));

    let packetLengthBuffer = varint.encode(varint.encodingLength(packetID) + longBuffer.length);
    let packetIDBuffer = varint.encode(packetID);

    let craftedPacket = varint.concatUI8([
        packetLengthBuffer,
        packetIDBuffer,
        longBuffer
    ])

    return craftedPacket;
}



export default { craftHandshake, craftEmptyPacket, craftPingPacket } 