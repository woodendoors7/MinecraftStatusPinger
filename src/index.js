import packetGen from "./packetGenerator.js"
import packetDec from "./packetDecoder.js"
import net from "net";

async function getServerStatus(options, callbackFunc) {
    return new Promise((resolve, reject) => {
        let { hostname, port, timeout } = options;

        if (!hostname) throw new Error("Input Error: No hostname was specified.")
        if (!port) port = 25565
        if (!timeout) timeout = 10000;
        // default port of 25565, default timeout of 10 seconds.
        let portal = net.createConnection(port, hostname, async () => {
            let handshake = await packetGen.craftHandshake(hostname, port);
            let statusRequest = await packetGen.craftEmptyPacket(0);
            portal.write(handshake);
            portal.write(statusRequest);
        })

        let packet = packetTemplate

        let writeOnce = false;
        portal.on("data", async (chunk) => {

            console.log("New packet")
            console.log(chunk.toString())
            console.log(chunk)
            packet = await packetDec.packetPipeline(chunk, packet)
            if (packet == Error && !packet.baked) {
                portal.destroy()
                clearTimeout(timeoutFunc)
                if (packet.message == "MaxBuffer") throw new Error("Memory Leak Warning: Maximum buffer size of 100 Kilobytes reached.\nThe status packet should be smaller than 20 Kilobytes.");
                if (packet.message == "CorruptPacket") throw new Error("Network Error: Corrupted packet was received.");
            }


            if (packet.baked && !writeOnce) {
                writeOnce = true;
                //portal.destroy();
                clearTimeout(timeoutFunc)
                resolve(packet.data)
                let pingRequest = await packetGen.craftPingPacket(1)
                portal.write(pingRequest)
                console.log("written")
            }
        })

        portal.once("error", (error) => {
            clearTimeout(timeoutFunc);
            throw error
        })

        let timeoutFunc = setTimeout(() => {
            portal.destroy();
            throw new Error("Timed out.")
        }, timeout);

    })
}




let packetTemplate = {
    baked: false,
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
    data: null
}

export default { getServerStatus }

//throw new Error("Memory Leak Warning: Maximum buffer size of 100 Kilobytes reached.\nThe status packet should be smaller than 20 Kilobytes."); 