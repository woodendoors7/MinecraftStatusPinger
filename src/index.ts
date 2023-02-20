import packetGen from "./packetGenerator.js"
import packetDec from "./packetDecoder.js"
import * as net from "net";
import { Packet, ServerStatusOptions, ServerStatus } from "./classes.js";

import { promises as dnsPromises } from 'dns';
const dns = new dnsPromises.Resolver();
dns.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]);

async function lookup(options: ServerStatusOptions): Promise<ServerStatus> {
    return new Promise<ServerStatus>(async (resolve, reject) => {
        let hostname = options.hostname;
        let port = options.port != null ? options.port : 25565;
        let timeout = options.timeout != null ? options.timeout : 10000;
        let ping = options.ping != null ? options.ping : true;
        let throwOnParseError = options.throwOnParseError != null ? options.throwOnParseError : true;
        let disableSRV = options.disableSRV != null ? options.disableSRV : false;
        console.log(disableSRV)
        if (!disableSRV) ({ hostname, port } = await processSRV(hostname, port))

        // Default port of 25565, default timeout of 10 seconds.
        // Ping is sent by default. 
        let portal = net.createConnection(port, hostname, async () => {
            // Send first the handshake, and then the status request to the server.
            let handshake = await packetGen.craftHandshake(hostname, port);
            let statusRequest = await packetGen.craftEmptyPacket(0);
            portal.write(handshake);
            portal.write(statusRequest);
        })

        let packet = new Packet();
        portal.on("data", async (chunk) => {

            /* 
                Pass every new chunk of data sent from the server into the pipeline,
                and also pass the packet object in, which holds the current state of the request.
                The pipeline returns the packet object, with changes made from processing the data chunk. 
            */

            packet = await packetDec.packetPipeline(chunk, packet)


            if (packet.status.pingBaked || (packet.status.handshakeBaked && !ping)) {
                let serverStatus = new ServerStatus(packet.crafted.data, packet.crafted.latency, throwOnParseError)
                clearTimeout(timeoutFunc);
                portal.destroy();
                return resolve(serverStatus);
            }

            /* 
                If the handshake and status request were sent out and replied to,
                generate the ping packet, log the time it was sent out on and send it.
            */

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

async function setDnsServers(serverArray: Array<string>) {
    await dns.setServers(serverArray);
    return true;
}

async function processSRV(hostname: string, port: number) {
    /*
     *  Tries to get a SRV record from the provided hostname, unless disabled with the disableSRV flag.
     *  The hostname can't be localhost, the port always has to be 25565, and the hostname cannot be an IP. 
    */

    if (hostname == "localhost" && port != 25565 && net.isIP(hostname) != 0) return { hostname, port }
    let result = await dns.resolveSrv("_minecraft._tcp." + hostname).catch(() => { })
    if (!result || result.length == 0 || !result[0].name || !result[0].port) return { hostname, port }
    return { hostname: result[0].name, port: result[0].port }
}

export default { setDnsServers, lookup }