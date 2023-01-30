import packetGen from "./packetGenerator.js"
import packetDec from "./packetDecoder.js"
import net from "net";

async function getServerStatus(options) {
    return new Promise((resolve, reject) => {
        let { hostname, port, timeout, ping } = options;
        if (!hostname) throw new Error("Input Error: No hostname was specified.")
        if (!port) port = 25565
        if (!timeout) timeout = 10000;
        if (ping == null) ping = true;

        // default port of 25565, default timeout of 10 seconds.
        let portal = net.createConnection(port, hostname, async () => {
            let handshake = await packetGen.craftHandshake(hostname, port);
            let statusRequest = await packetGen.craftEmptyPacket(0);
            portal.write(handshake);
            portal.write(statusRequest);
        })

        let packet = packetTemplate;
        portal.on("data", async (chunk) => {

            console.log({chunk})

            packet = await packetDec.packetPipeline(chunk, packet)

            if (packet.status.pingBaked || (packet.status.handshakeBaked && !ping)) {
                clearTimeout(timeoutFunc);
                resolve(packet.crafted);
            }

            if (packet.status.handshakeBaked && !packet.status.pingSent) {
                let pingRequest = await packetGen.craftPingPacket()
                packet.status.pingSentTime = Date.now();
                await portal.write(pingRequest)
                packet.status.pingSent = true;
            }
        })

        portal.once("error", (netError) => {
            clearTimeout(timeoutFunc);
            reject();
            throw netError
        })


        let timeoutFunc = setTimeout(() => {
            portal.destroy();
            throw new Error("Timed out.")
        }, timeout);

    })
}

let packetTemplate = {
    status: {
        handshakeBaked: false,
        pingSent: false,
        pingBaked: false,
        pingSentTime: null
    },
    meta: {
        metaCrafted: false,
        fieldsCrafted: false,
        packetID: null,
        dataLength: null,
        fullLength: null,
        metaLength: null
    },
    dataBuffer: Buffer.alloc(0),
    fieldsBuffer: Buffer.alloc(0),
    crafted: {
        data: null,
        latency: null
    }
}

export default { getServerStatus }
