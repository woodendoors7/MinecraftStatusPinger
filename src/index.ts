import packetGen from "./packetGenerator.js"
import packetDec from "./packetDecoder.js"
import * as net from "net";
import {Packet, ServerStatusOptions} from "./classes.js";

export default async function getServerStatus(options: ServerStatusOptions) {
    return new Promise((resolve, reject) => {
        let hostname = options.hostname;
        let port = options.port == null ? options.port : 25565;
        let timeout = options.timeout == null ? options.timeout : 10000;
        let ping = options.ping == null ? options.ping : true;

        // default port of 25565, default timeout of 10 seconds.
        let portal = net.createConnection(port, hostname, async () => {
            let handshake = await packetGen.craftHandshake(hostname, port);
            let statusRequest = await packetGen.craftEmptyPacket(0);
            portal.write(handshake);
            portal.write(statusRequest);
        })

        let packet = new Packet();

        portal.on("data", async (chunk) => {

            console.log({ chunk })

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










type Nul<Type> = Type | null;
