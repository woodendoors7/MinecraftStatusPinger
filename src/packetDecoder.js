import varint from "varint"

async function packetPipeline(chunk, packet) {
  // Wait for and Collect all the data coming from the server.
  if (packet.status.pingSent) return await craftPingResponse(chunk, packet);

  packet.dataBuffer = await Buffer.concat([
    packet.dataBuffer,
    chunk
  ])

  if (Buffer.byteLength(packet.dataBuffer) > 102400) throw new Error("Maximum buffer size of 100 Kilobytes reached.\nThe status packet should be smaller than 20 Kilobytes.")
  if (!packet.meta.packetInitialized) packet = await craftPacketMeta(packet);
  if (packet.dataBuffer.length != packet.meta.fullLength) return packet;
  if (!packet.meta.fieldsCrafted) packet = await craftData(packet)
  return packet;
}

async function craftPingResponse(chunk, packet) {
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

async function craftData(packet) {
  // This crafts the first and only data field. It slices off the meta fields.
  packet.fieldsBuffer = packet.dataBuffer.slice(packet.meta.metaLength)
  let fieldLength = varint.decode(packet.fieldsBuffer)
  packet.fieldsBuffer = packet.fieldsBuffer.slice(varint.encodingLength(fieldLength));
  packet.crafted.data = JSON.parse(packet.fieldsBuffer.toString());
  packet.status.handshakeBaked = true;
  return packet;
}

async function craftPacketMeta(packet) {
  // Field 1: Length of the packet, (VarInt)
  // Field 2: Packet ID, (VarInt)
  // Field 3: Data fields

  packet.meta.dataLength = varint.decode(packet.dataBuffer, 0);
  packet.meta.fullLength = varint.encodingLength(packet.meta.dataLength) + packet.meta.dataLength;
  packet.meta.packetID = varint.decode(packet.dataBuffer, varint.encodingLength(packet.meta.dataLength))
  packet.meta.metaLength = varint.encodingLength(packet.meta.dataLength) + varint.encodingLength(packet.meta.packetID);

  if (packet.meta.dataLength == null || packet.meta.fullLength == null || packet.meta.packetID == null) return new Error("Corrupted or invalid packet was received.")

  packet.meta.metaCrafted = true;
  return packet;
}

export default { packetPipeline } 