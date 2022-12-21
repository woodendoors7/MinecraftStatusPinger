import varint from "varint"

async function decodePacket(buffer) {
  // Decode packet length
  buffer = Buffer.concat([Buffer.alloc(0), buffer])

  let packetLength = varint.decode(buffer, 0)
  let totalLength = varint.encodingLength(packetLength) + packetLength;
  //console.log(varint.encodingLength(packetLength))
  //console.log(buffer)
  //console.log(buffer.length)
  let packetID = varint.decode(buffer, varint.encodingLength(packetLength))

  if (!packetLength)return; //throw new Error("Network Error: No packet or corrupted packet was received.")
  if (buffer.length < totalLength) return// throw new Error("Network Error: Incomplete packet was received.")
  if (packetID === undefined) return //throw new Error("Server Error: Corrupted packet was received.")

  // Slice data
  let data = buffer.slice(
    varint.encodingLength(packetLength) +
    varint.encodingLength(packetID)
  )

  if (packetID == 0) data = JSON.parse(data)

  return { ID: packetID, response: data }
}



export default { decodePacket } 