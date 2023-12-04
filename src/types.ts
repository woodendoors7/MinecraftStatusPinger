export class Packet {
    status: PacketStatus = {
        handshakeBaked: false,
        pingSent: false,
        pingBaked: false,
        pingSentTime: null,
    }
    meta: PacketMeta = {
        packetInitialized: false,
        metaCrafted: false,
        fieldsCrafted: false,
        packetID: null,
        dataLength: null,
        fullLength: null,
        metaLength: null,
    }
    dataBuffer = Buffer.alloc(0);
    fieldsBuffer = Buffer.alloc(0);
    crafted: PacketCrafted = {
        data: null,
        latency: null,
    };
    Error: Error = null;
}

//export type Packet = _Packet | Error;

interface PacketStatus {
    handshakeBaked: boolean,
    pingSent: boolean,
    pingBaked: boolean,
    pingSentTime: number,
}

interface PacketMeta {
    packetInitialized: boolean
    metaCrafted: boolean,
    fieldsCrafted: boolean,
    packetID: number,
    dataLength: number,
    fullLength: number,
    metaLength: number,
}

interface PacketCrafted {
    data: string,
    latency: number
}

interface _ServerStatusOptions {
    port?: number
    timeout?: number
    ping?: boolean,
    protocolVersion?: number,
    throwOnParseError?: boolean,
    disableSRV?: boolean,
    disableJSONParse?: boolean,
}

type NotBoth =
    | {host: string, hostname?: never}
    | {host?: never, hostname: string}

export type ServerStatusOptions = _ServerStatusOptions & NotBoth;

export class ServerStatus {
    constructor(statusRaw: string, latency?: number, throwOnParseError?: boolean, disableJSONParse?: boolean) {
        if(!disableJSONParse){
            try {
                this.status = JSON.parse(statusRaw);
            } catch (err) {
                if (throwOnParseError) throw err
                this.status = null
            }
        } else this.status = null;

        this.statusRaw = statusRaw
        if (latency) {
            this.latency = latency
        } else this.latency = null;
    }
    latency: number | null;
    status: DynamicObject | null;
    statusRaw: string;
}


export type DynamicObject = {
    [key: string]: any;
};
 