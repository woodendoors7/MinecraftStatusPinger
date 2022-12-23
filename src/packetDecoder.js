import varint from "varint"

async function packetPipeline(chunk, packet) {
  // Wait for and Collect all the data coming from the server.
  packet.dataBuffer = await Buffer.concat([
    packet.dataBuffer,
    chunk
  ])
  if (Buffer.byteLength(packet.dataBuffer) > 102400) return new Error("MaxBuffer")
  if (!packet.meta.packetInitialized) packet = await craftPacketMeta(packet);
  if (packet.dataBuffer.length != packet.meta.fullLength) return packet;
  if (!packet.meta.fieldsCrafted) packet = await craftData(packet)
  return packet;
}

async function craftData(packet) {
  // This crafts the first and only data field. It slices off the meta fields.
  packet.fieldsBuffer = packet.dataBuffer.slice(packet.meta.metaLength)
  let fieldLength = varint.decode(packet.fieldsBuffer)
  packet.fieldsBuffer = packet.fieldsBuffer.slice(varint.encodingLength(fieldLength));

  packet.data = JSON.parse(packet.fieldsBuffer.toString());
  packet.baked = true;
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

  if (packet.meta.dataLength == null || packet.meta.fullLength == null || packet.meta.packetID == null) return new Error("CorruptPacket")

  packet.meta.metaCrafted = true;
  return packet;
}

export default { packetPipeline } 