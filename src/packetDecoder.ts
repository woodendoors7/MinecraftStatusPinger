import varint from "./utils-varint.ts"
import { Packet } from "./types.ts";


async function packetPipeline(chunk: Uint8Array, packet: Packet) {
  // Wait for and Collect all the data coming from the server.
  if (packet.status.pingSent) return await craftLatency(packet);

  packet.dataBuffer = await varint.concatUI8([
    packet.dataBuffer,
    chunk
  ])

  if (packet.dataBuffer.length > 102400) {
    packet.Error = new Error("Maximum buffer size of 100 Kilobytes reached.\nThe status packet should be smaller than 20 Kilobytes.")
    return packet;
  }

  if (!packet.meta.packetInitialized) packet = await craftPacketMeta(packet);
  if (packet.dataBuffer.length != packet.meta.fullLength) return packet;
  if (!packet.meta.fieldsCrafted) packet = await craftData(packet)
  return packet;
}


async function craftLatency(packet: Packet) {
  /*
    The same packet we sent to the server should be sent back, however
    some servers send some kind of non standard string back, therefore,
    any packet sent by the server after we requested the ping 
    is counted as the ping response.
  */

  packet.crafted.latency = Date.now() - packet.status.pingSentTime;
  packet.status.pingBaked = true;
  return packet;
}

async function craftData(packet: Packet) {
  // This crafts the first and only data field. It slices off the meta fields.
  packet.fieldsBuffer = packet.dataBuffer.slice(packet.meta.metaLength)
  let fieldLength = varint.decode(packet.fieldsBuffer)
  packet.fieldsBuffer = packet.fieldsBuffer.slice(varint.encodingLength(fieldLength));
  packet.crafted.data = new TextDecoder().decode(packet.fieldsBuffer); 
  packet.status.handshakeBaked = true;
  return packet;
}

async function craftPacketMeta(packet: Packet) {
  // Field 1: Length of the packet, (VarInt)
  // Field 2: Packet ID, (VarInt)
  // Field 3: Data fields
  packet.meta.dataLength = varint.decode(packet.dataBuffer);
  packet.meta.fullLength = varint.encodingLength(packet.meta.dataLength) + packet.meta.dataLength;
  packet.meta.packetID = varint.decode(packet.dataBuffer, varint.encodingLength(packet.meta.dataLength));
  packet.meta.metaLength = varint.encodingLength(packet.meta.dataLength) + varint.encodingLength(packet.meta.packetID);

  packet.meta.metaCrafted = true;
  packet.meta.packetInitialized = true;

  if (packet.meta.dataLength == null || packet.meta.fullLength == null || packet.meta.packetID == null) packet.Error = new Error("Invalid packet was received.")

  return packet;
}

export default { packetPipeline } 