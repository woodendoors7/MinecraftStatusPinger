import packetGen from "./packetGenerator.js"
import packetDecoder from "./packetDecoder.js"
import net from "net";
import varint from "varint"
async function getServerStatus(options) {
    let { port, hostname } = options;

    let portal = net.createConnection(port, hostname, async () => {
        let handshake = await packetGen.craftHandshake(hostname, port);
        let statusRequest = await packetGen.craftEmptyPacket(0);
        portal.write(handshake);
        //let expectData = waitForData(portal);
        portal.write(statusRequest);
        //let statusResponse = await expectData;
        //console.log(statusResponse)
    })

    let addBuffer = Buffer.alloc(0)

    portal.on("data", async (chunk) => {

        addBuffer = Buffer.concat([addBuffer, chunk])

        let result = await packetDecoder.decodePacket(addBuffer);

        console.log(chunk.toString())
        //let decodedData = packetDecoder.decodePacket(chunk)
        //console.log(decodedData)
    })

}

async function waitForData(portal) {
    return new Promise((resolve, reject) => {
        portal.on('data', (chunk) => {
            resolve(chunk);
        })
    })
}

export default { getServerStatus } 