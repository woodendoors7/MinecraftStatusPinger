import packetGen from "./packetGenerator.ts"
import packetDec from "./packetDecoder.ts"
import * as net from "node:net";
import { Packet, ServerStatusOptions, ServerStatus, DynamicObject } from "./types.ts";

import { promises as dns } from "node:dns";


/**
 * Looks up the server.
 * @example
 * Here's a simple example:
 * ```
 * let result = await mc.lookup({
 *    host: "mc.hypixel.net"
 *    port: 25565,
 *    timeout: 10000,
 *    ping: true,
 *    protocolVersion: 767
 *    throwOnParseError: false,
 *    SRVLookup: true,
 *    JSONParse: true
 * })
 * ```
 */
export async function lookup(options?: ServerStatusOptions): Promise<ServerStatus> {
    return new Promise<ServerStatus>(async (resolve, reject) => {

        let hostname = options.host || options.hostname;
        if (!hostname) return reject(new Error("No hostname was provided!"));

        let port = options.port != null ? options.port : 25565;
        if(port < 0 || port > 65535) return reject(new Error("Port number must be between 0 and 25565!"));

        let timeout = options.timeout != null ? options.timeout : 10000;
        let ping = options.ping != null ? options.ping : true;
        let protocolVersion = options.protocolVersion != null ? options.protocolVersion : 767;
        let throwOnParseError = options.throwOnParseError != null ? options.throwOnParseError : true;
        let SRVLookup = options.SRVLookup != null ? options.SRVLookup : true;
        let JSONParse = options.JSONParse != null ? options.JSONParse : true;
        if (SRVLookup) ({ hostname, port } = await processSRV(hostname, port))
        // Default port of 25565, default timeout of 10 seconds.
        // Ping is sent by default. 

        let portal = net.createConnection({ port: port, host: hostname, lookup: customLookup }, async () => {
            // Send first the handshake, and then the status request to the server.
            let handshake = await packetGen.craftHandshake(hostname, port, protocolVersion);

            let statusRequest = await packetGen.craftEmptyPacket(0);

            portal.write(handshake);
            portal.write(statusRequest);

        })

        let packet = new Packet();
        portal.on("data", async (_chunk) => {

            /* 
                Pass every new chunk of data sent from the server into the pipeline,
                and also pass the packet object in, which holds the current state of the request.
                The pipeline returns the packet object, with changes made from processing the data chunk. 
            */

            let chunk = new Uint8Array(<any>_chunk);
            packet = await packetDec.packetPipeline(chunk, packet)
            if (packet.Error) {
                clearTimeout(timeoutFunc)
                return reject(packet.Error)
            }


            if (packet.status.pingBaked || (packet.status.handshakeBaked && !ping)) {
                let serverStatus;
                try {
                    serverStatus = new ServerStatus(packet.crafted.data, packet.crafted.latency, throwOnParseError, JSONParse)
                } catch (error) {
                    clearTimeout(timeoutFunc);
                    portal.destroy();
                    return reject(error);
                }
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
                packet.status.pingSent = true;
                await portal.write(pingRequest);
            }
        })

        portal.once("error", (netError) => {
            clearTimeout(timeoutFunc);
            reject(netError);
        })

        let timeoutFunc = setTimeout(() => {
            portal.destroy();
            reject(new Error("Timed out."))
        }, timeout);

    })
}


/**
 * Used for changing the default DNS servers. 
 * @example
 * ```
    // Recommended servers
    mc.setDnsServers(["9.9.9.9", "1.1.1.1", "8.8.8.8"])
    // (Quad9, Cloudflare, Google)
    // Cloudflare is the fastest for DNS queries in most of the world.
```
 */
export async function setDnsServers(serverArray: Array<string>): Promise<boolean> {
    await dns.setServers(serverArray);
    return true;
}

async function customLookup(hostname: string, options: DynamicObject, callback: CallableFunction) {
    let result = await dns.lookup(hostname, options).catch((e) => {
        callback(e);
    })

    if (!result) return;
    if (options?.all) callback(null, result)
    else callback(null, result.address, result.family);
}

async function processSRV(hostname: string, port: number) {
    /*
     *  Tries to get a SRV record from the provided hostname, unless disabled with the disableSRV flag.
     *  The hostname can't be localhostname, the port always has to be 25565, and the hostname cannot be an IP. 
    */


    if (port != 25565 || net.isIP(hostname) != 0) return { hostname, port }
    let result = await dns.resolveSrv("_minecraft._tcp." + hostname).catch(() => { })
    if (!result || result.length == 0 || !result[0].name || !result[0].port) return { hostname, port }
    return { hostname: result[0].name, port: result[0].port }
}

/**
 * The default export, containing setDnsServers and lookup
 */
export default { setDnsServers, lookup }